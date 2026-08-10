# VedVani

VedVani answers questions about Hindu scripture and tradition (Vedas, Upanishads,
Bhagavad Gita, Puranas) using retrieval-augmented generation over a small seeded
public-domain corpus plus Claude for generation, with inline citations. It never
invents verses, distinguishes "Scripture says" / "Commentary" / "Tradition holds" /
"VedVani synthesis" / "Uncertain-disputed", never claims divine authority, and stays
pluralistic across sampradayas (no sectarian ranking).

This is a first vertical slice: monolithic Next.js 14 App Router app (frontend + API
routes together), guest-session auth PLUS real email magic-link login, browser-native
voice I/O, and a minimal opt-in/viewable/deletable memory feature.

## Stack

- Next.js 14 (App Router) + TypeScript
- Prisma + Postgres
- `@anthropic-ai/sdk` (Claude, model `claude-sonnet-4-5-20250929`)
- ElevenLabs REST API for TTS (plain `fetch`, no SDK)
- Cookie-based guest sessions (`guest_session_id` httpOnly cookie -> `GuestSession` row)
- Email magic-link login (`vv_session` httpOnly signed-cookie -> `User` row), stateless
  HMAC-signed tokens (Node `crypto`), no email provider wired up yet (see "Known
  limitations" below)

## Running locally

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL (a real Postgres instance), and optionally
# ANTHROPIC_API_KEY / ELEVENLABS_API_KEY
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Then visit http://localhost:3000.

If `ANTHROPIC_API_KEY` is unset, `/api/chat` still runs retrieval and returns the raw
matched passages instead of a generated answer (with a clear message), rather than
crashing. If `ELEVENLABS_API_KEY` is unset, `/api/tts` returns `{ available: false }`
and the frontend hides/disables the "Listen" button.

## Deploying (Railway / Nixpacks)

No Dockerfile needed. Standard Nixpacks detection handles `npm install` +
`npm run build` (`prisma generate && next build`) + `npm run start`
(`next start`, which honors `process.env.PORT`). Set `DATABASE_URL`,
`ANTHROPIC_API_KEY`, and `ELEVENLABS_API_KEY` as environment variables in Railway,
then run `npx prisma migrate deploy` and `npx prisma db seed` against the
provisioned database (e.g. via a one-off Railway shell or a release command).

## Authentication

Two session types coexist, resolved by `src/lib/session.ts::resolveSession()`, which
returns either `{ type: "guest", guestId }` (existing cookie-based guest flow,
unchanged) or `{ type: "user", userId, email }` (new email login). All routes/pages
that used to take a bare `guestSessionId` (chat, history, memory) now branch on this
union and filter by `guestSessionId` or `userId` accordingly, so guest and logged-in
usage both work end-to-end and existing guest data/behavior is untouched.

**Login flow:**
1. User visits `/login`, enters an email, and submits.
2. `POST /api/auth/email-login` upserts a `User` row and generates a signed, stateless
   one-time login token (HMAC-SHA256 via Node's built-in `crypto`, user id + email +
   15-minute expiry baked into the token itself — no separate pending-token DB table).
3. **Since no email-sending provider (Resend, SMTP relay, etc.) is configured for this
   deployment yet, the magic link is NOT emailed. It is returned directly in the API
   response and displayed on the `/login` page** as "Since email sending isn't
   configured yet, click this link to log in:" — this is a clearly-flagged placeholder,
   not a security feature; see "Known limitations" below.
4. Clicking the link hits `GET /api/auth/verify?token=...`, which validates the
   token's signature and expiry, mints a longer-lived signed session token, sets it as
   the `vv_session` httpOnly cookie, and redirects home.
5. The header nav shows the logged-in email (from `resolveSession()`) with a
   "Log out" link (`GET/POST /api/auth/logout`, clears the `vv_session` cookie) when
   logged in, or "Guest" + "Log in" when not.

## Corpus integrity

`prisma/seed.ts` seeds ~58 short passages from public-domain sources (Bhagavad Gita —
one representative verse per chapter across all 18 chapters, principal Upanishads
including Isha, Mundaka, Katha, Chandogya, and Brihadaranyaka, Rigveda, brief Ramayana
and Mahabharata narrative summaries, entries on the festivals of Diwali, Holi, and
Navaratri, brief summaries of the six classical darshanas, and general Puranic/
Dharmashastra tradition summaries). Every entry is labeled `sourceType`:

- `primary_text` (4 entries) — used only where we are genuinely confident the wording
  matches a known public-domain translation: Gita 2.47, Isha Upanishad opening verse,
  Mundaka 3.1.6 "Satyameva jayate", and Brihadaranyaka Upanishad 1.3.28 (the Pavamana
  Mantra, "asato ma sadgamaya...").
- `paraphrase_summary` (54 entries) — used everywhere else, with
  `attribution: "VedVani summary"`. These are careful, accurate paraphrases or
  narrative summaries, not verbatim quotations. This applies to most Gita/Upanishad
  entries, all Rigveda (Nasadiya Sukta, Purusha Sukta, Agni, Indra) entries, all
  Ramayana/Mahabharata narrative summaries, all festival entries, all six-darshana
  entries, and Purana/Dharmashastra entries in this seed, because exact historical
  translator wording could not be confidently reproduced without a source text at
  hand, or because the entry is inherently a narrative/summary rather than a verse.

See the comment block at the top of `prisma/seed.ts` for the full breakdown and the
no-fabrication rule for future editors.

## Bulk corpus ingestion

On top of the ~58 hand-curated `prisma/seed.ts` passages, VedVani also bulk-ingests
~5,076 passages from five public-domain books, gzipped as pre-chunked JSON under
`prisma/bulk-data/` and loaded by `prisma/ingest-bulk.ts`:

- **Rigveda** (Griffith, 1896 translation) — `rigveda_english.chunks.json.gz`, 954 passages.
- **Four Vedas** (Griffith/Keith/Bloomfield translations of Rigveda, Yajurveda, Samaveda,
  Atharvaveda) — `Four_Vedas_English_Translation.chunks.json.gz`, 3,199 passages.
- **Manusmriti (Laws of Manu)** (Buhler, 1886 translation) — `manusmriti.chunks.json.gz`,
  83 passages.
- **Upanishads** (Max Muller, 1879 translation, Sacred Books of the East) —
  `upanishads01ml.chunks.json.gz`, 838 passages.
- **Hanuman Chalisa** (traditional text) — `hanuman_chalisa_mobile_friendly.chunks.json.gz`,
  2 passages.

These translations were verified public-domain via title-page inspection (translator
name + publication date, all pre-1923/clearly expired-copyright editions), but — unlike
the hand-picked seed passages, which were individually spot-checked — they were **not**
reviewed line-by-line before ingestion. Every row inserted by `ingest-bulk.ts` is
therefore explicitly stamped `reviewStatus: "unreviewed"`, distinguishing bulk-digitized
content from the hand-curated seed set so admins can review or flag individual passages
over time from the `/admin` passage table (which now supports pagination and filtering
by `sourceWork`/`reviewStatus` given the much larger row count).

`ingest-bulk.ts` runs automatically as part of the `start` script (after `prisma db push`
and `prisma db seed`, wrapped in `|| true` so a failure there doesn't crash the
container) and is idempotent: for each file, it counts existing `CorpusPassage` rows
with that file's `sourceWork` and skips re-inserting if the count already meets or
exceeds the file's chunk count.

**Explicitly excluded:** during source-library review, ~50 other PDFs were found to be
likely-copyrighted modern publisher editions (Gita Press editions, books by named modern
translators/publishers, etc.) rather than public-domain 19th/early-20th-century
translations. Those were deliberately left out of `prisma/bulk-data/` and are **not**
ingested — do not add them without a fresh, explicit public-domain/licensing review.

## Retrieval

`src/lib/retrieval.ts` now ranks matches using Postgres full-text search
(`to_tsvector('english', ...)` / `plainto_tsquery` / `ts_rank`) via Prisma's
`$queryRaw`, instead of returning the first N `ILIKE`-style matches. It also does
lightweight tradition-tag detection: if a question clearly names a tradition (e.g.
"what does Advaita say about the self?", "how does Shaivism view Shiva?"), passages
whose `traditionTags` include that tradition are boosted to the top of the ranking. If
the full-text query throws for any reason (e.g. a restricted DB role), it falls back
to a dependency-free keyword-hit-count scorer over `title` / `translationText` /
`traditionTags` rather than hard-failing the request. No new npm dependencies were
added — this only relies on Postgres built-ins.

## Known limitations

- **Magic-link emails are not actually sent.** No email provider (Resend, a
  Postgres-backed SMTP relay, etc.) is configured yet. `/login` generates a real,
  valid signed magic link and displays it directly on the page instead of emailing
  it. This is fine for demoing/dev but is NOT how login should work in production —
  wire up a real provider and have `POST /api/auth/email-login` send the link instead
  of returning it in the response body. Tracked with an inline code comment at the
  top of `src/app/api/auth/email-login/route.ts`.
- No password/OAuth login — magic-link email is the only login method.
- No rate limiting on `/api/auth/email-login` (a real deployment should add this once
  real email sending is wired up, to prevent abuse).
- Voice-to-voice streaming (only browser Web Speech API for STT, and ElevenLabs
  request/response TTS — no low-latency streaming pipeline).
- Multi-language UI (interface is English; voice recognition is set to `en-IN` and
  can be extended to Hindi locales, but there's no i18n layer yet).
- Admin console / editorial workflow for managing the corpus (corpus is seeded via
  `prisma/seed.ts` only; no CMS or review queue).
- Jyotish (astrology) features.
- Vector DB / embeddings-based retrieval — retrieval uses Postgres full-text search
  (`tsvector`/`tsquery`) plus a tradition-tag bias, not semantic/embedding search.

## Phase 3–5: Admin console, scripture reader, learning paths, safety layer

**Phase 3 — Minimal admin/editorial console**
- `User.isAdmin` (Boolean, default false) and `CorpusPassage.reviewStatus`
  ("unreviewed" | "reviewed" | "flagged") added to the schema, plus a new
  `UserReport` model (conversationId?, messageId?, note, status, createdAt).
- `/admin` (`src/app/admin/page.tsx`) is a server component that calls
  `resolveAdminSession()` (`src/lib/adminAuth.ts`), which resolves the session
  and looks up `isAdmin` in the DB — non-admins (including all guests) are
  redirected to `/` via `next/navigation`'s `redirect()`. It lists every
  `CorpusPassage` with an inline review-status control (POSTs to
  `/api/admin/passages/[id]/review`) and every `UserReport` with a "mark
  resolved" button (POSTs to `/api/admin/reports/[id]/resolve`). Both API
  routes re-run the same admin check server-side and return 403 for
  non-admins — the UI gating is not the only protection.
- Chat replies now have a "Report this answer" button (`ChatThread.tsx`) that
  posts a short note to `/api/reports`, creating an open `UserReport`.
- **To grant admin access**, run this SQL directly against the database
  (there is intentionally no admin-granting UI):
  ```sql
  UPDATE "User" SET "isAdmin" = true WHERE email = 'someone@example.com';
  ```

**Phase 4 — Scripture reader + bookmarks/notes + learning paths**
- `/read` lists every `CorpusPassage` grouped by `sourceWork`; `/read/[id]`
  shows the full passage (`scriptText` when present, `translationText`,
  attribution, tradition tags, and a `sourceType` badge that's colored
  differently for `primary_text` vs `paraphrase_summary`), plus a Bookmark
  button.
- New `Bookmark` model follows the exact guest/user union pattern already
  used by `Conversation`/`MemoryItem` (`guestSessionId` + `userId`, both
  optional, exactly one set). `/api/bookmarks` supports GET (list current
  session's bookmarks), POST (create, optional `note`), and DELETE (`?id=`).
- `/bookmarks` lists the current guest/user's saved passages with notes,
  linking back to `/read/[id]`.
- `src/lib/learningPaths.ts` defines a small `LEARNING_PATHS` constant (5
  paths spanning the Gita, the Vedic hymns, the Upanishads, the six
  Darshanas, and the epics) using `titleMatches` substrings resolved against
  real `CorpusPassage.title` values at request time via Prisma `contains`
  queries (no hardcoded ids). `/learn` lists the paths; `/learn/[slug]`
  shows the matched passages in order.

**Phase 5 — Safety layer + citation verification**
- Core chat logic was extracted from `src/app/api/chat/route.ts` into
  `runChatTurn()` in `src/lib/chat.ts` so both the chat route and the new
  eval route can call it directly.
- Before calling Claude, `classifyMessageSafety()` runs simple keyword/regex
  checks for: (a) deterministic astrology predictions, (b) self-harm/crisis
  language, (c) fasting/ritual instructions combined with a medical
  condition, and (d) requests to validate caste/gender discrimination as
  scripturally mandated.
  - Self-harm matches **short-circuit** before any retrieval or Claude call
    and return a fixed, warm, scripture-free response pointing toward a
    mental health professional or a crisis helpline.
  - The other three categories don't block the request — they inject an
    extra system-prompt instruction telling Claude to decline deterministic
    claims, name the plurality of traditional views, and add explicit
    safety caveats.
- After Claude responds, `verifyCitations()` does simple string matching of
  `(Source Work Location)`-style citation patterns in the answer against the
  retrieved passages' `sourceWork`/`location`/`title`. If a citation-looking
  reference doesn't match anything retrieved, the answer gets
  `"[unverified citation — please double-check this reference]"` appended.
  This is conservative on purpose (regex/string matching only, no second LLM
  call) to avoid false positives.
- `/api/eval` (admin-only, same `resolveAdminSession()` gate) runs 6
  hardcoded test questions through `runChatTurn()` and returns
  `{ results: [{ question, answer, checks }] }` with simple string-contains
  heuristic checks (e.g. the self-harm question is checked for
  helpline/professional/support language and the *absence* of a
  citation pattern; the astrology and caste questions are checked for
  plurality/caveat language). Hit it with:
  ```bash
  curl -b "<your admin session cookie>" http://localhost:3000/api/eval
  ```

## Phase 6–8: Hindi locale toggle, response modes, knowledge graph, commentary comparison

**Phase 6 — Hindi UI toggle + response modes**
- `src/lib/i18n.ts` defines a plain `en`/`hi` dictionary of chrome strings
  (nav labels, headers, buttons) and a `t(locale, key)` helper. This covers
  nav/headers/buttons only — full page body content (chat answers, corpus
  text, learning path descriptions) is **not** translated; that's future
  work (see comment at top of `i18n.ts`).
- Locale is stored in a plain (non-httpOnly) `vv_locale` cookie, set via
  `POST /api/locale` (`src/app/api/locale/route.ts`, body `{ locale }`).
  `src/app/LocaleToggle.tsx` is a small client button in the nav
  (`src/app/layout.tsx`) that flips the cookie and calls `router.refresh()`.
  Server components (`layout.tsx`, `/read`, `/learn`, `/bookmarks`,
  `/history`, `/memory`, `/admin`) read the cookie directly via
  `cookies()` and render translated headers; the client-rendered `/` and
  `/chat/[id]` composers read the same cookie via `document.cookie` on
  mount.
- Response modes (BRD FR-CHAT-006): `src/app/ResponseModeSelect.tsx` is a
  shared dropdown (concise | detailed | child-friendly | academic |
  devotional) used by both the home composer and `ChatThread.tsx`. The
  chosen mode is sent as `responseMode` in the `POST /api/chat` body,
  validated with `isResponseMode()`, and threaded into `runChatTurn()` in
  `src/lib/chat.ts`, where `RESPONSE_MODE_INSTRUCTIONS[mode]` is appended to
  the system prompt (e.g. concise = "2-3 sentences max"; child-friendly =
  simple words/short sentences/warm tone; academic = precise terminology;
  devotional = warmer/reverent but still cited; detailed = current
  default). `Message.responseMode` (new `String @default("detailed")`
  column) records which mode produced each assistant message.

**Phase 7 — Entity pages + basic knowledge graph**
- New `KnowledgeEntity` model: `name`, `entityType` ("deity" | "concept" |
  "place" | "person"), unique `slug`, `traditionScopedDescriptions` (Json
  array of `{ tradition, description }` — deliberately an array, not a
  single field, so the same entity can carry multiple, clearly-labeled,
  non-ranked tradition-specific descriptions), and
  `relatedPassageTitleContains` (substrings matched against
  `CorpusPassage.title`/`translationText`, the same pragmatic pattern
  `learningPaths.ts` uses).
- `prisma/seed.ts` seeds 12 entities (Brahman, Atman, Krishna, Vishnu,
  Shiva, Purusha, Dharma, Karma, Moksha, Yajna, Om/Aum, Maya), each with
  2–3 tradition-scoped descriptions written neutrally (e.g. Brahman's
  Advaita, Vishishtadvaita, and Dvaita descriptions are given as separate,
  equally-labeled entries — none presented as the "correct" one).
- `/entities` groups all entities by `entityType`; `/entities/[slug]` shows
  every tradition-scoped description clearly separated by tradition label,
  plus a "Related passages" section built from `relatedPassageTitleContains`
  substring matches, linking to `/read/[id]`.
- `/read/[id]` now shows a small "Related: [entity links]" line when any
  `KnowledgeEntity.name` appears as a substring of that passage's title or
  translation text.

**Phase 8 — Commentary comparison view**
- 6 new `CorpusPassage` rows were added deliberately as alternate
  interpretive layers of 3 already-seeded, well-known Gita verses (2.47,
  2.20, 18.66) — e.g. an Advaita-informed reading and a Bhakti/Dvaita-
  informed reading of the same verse+location. All are `sourceType:
  "paraphrase_summary"`, attributed as `"VedVani summary — <tradition>-
  informed reading"`, and the seed file explicitly comments that these are
  VedVani's own illustrative interpretive glosses, **not** claims about
  what any specific named historical commentator wrote.
- `/read/[id]/compare` looks up every other `CorpusPassage` sharing the
  same `sourceWork`+`location` and shows them in a responsive card grid
  (stacks to one column on mobile), each card labeled with its
  `sourceType` badge, tradition tags, and attribution. If no siblings
  exist, it shows "No alternate readings in our library yet for this
  verse." instead of an empty page.
- `/read/[id]` shows a "Compare interpretations" link only when sibling
  rows actually exist (checked via `prisma.corpusPassage.count()` at
  render time).

### Sandbox note on Prisma types

`npm run build` normally runs `prisma generate` first, which needs to
download a query-engine binary. In network-restricted sandboxes that
download can 403. Since this repo already used a hand-maintained fallback
`.prisma/client` type stub for the same reason, Phase 3–5 extended that
stub by hand (`node_modules/.prisma/client/{index,default}.d.ts`) to add
typed model shapes (`User`, `CorpusPassage`, `Bookmark`, `UserReport`,
etc.) and a typed `PrismaClient`/`Prisma.sql`, matching `prisma/schema.prisma`
field-for-field, so the app still gets real typechecking without a working
network connection. In a normal environment, `npx prisma generate` will
overwrite this stub with the real generated client as usual. Phase 6–8
extended the same hand-written stub again to add `Message.responseMode`
and the new `KnowledgeEntity` model/delegate.

## Phase 9–11: corpus expansion, accessibility/SEO, admin analytics

**Phase 9 — Corpus expansion (Puranas + saints + samskaras)**
- 23 new `CorpusPassage` rows added to `prisma/seed.ts` (all
  `sourceType: "paraphrase_summary"`, attribution `"VedVani summary"`),
  bringing the corpus to 87 total passages (4 `primary_text`, 83
  `paraphrase_summary`). Coverage added: brief overview summaries of six
  major Puranas (Vishnu, Shiva, Bhagavata, Markandeya, Devi Bhagavata,
  Skanda); four deeper darshana entries (Nyaya's pramanas, Vaisheshika's
  atomism, Samkhya's purusha-prakriti dualism, Mimamsa's ritual
  hermeneutics — checked against the existing six-darshana overview
  entries from Phase 6–8 to avoid duplication); seven brief biographical
  summaries of saints/acharyas (Adi Shankaracharya, Ramanuja, Madhvacharya,
  Tulsidas, Mirabai, Kabir, Chaitanya Mahaprabhu); and six entries on
  samskaras and daily practice (an overview of the samskaras, upanayana,
  vivaha, antyesti, sandhyavandanam, and the basic structure of home puja).

**Phase 10 — Accessibility + SEO**
- Added `metadata`/`generateMetadata` exports to every top-level page,
  with dynamic metadata for `/read/[id]`, `/learn/[slug]`, and
  `/entities/[slug]` pulling the real title/description from the DB. The
  home page (`/`) and `/login` were split into a small server component
  (`page.tsx`, carrying `metadata`) plus a `"use client"` component
  (`HomeClient.tsx` / `LoginClient.tsx`) since a client component cannot
  itself export `metadata`.
- Added `src/app/sitemap.ts` (lists static routes plus every
  `CorpusPassage` `/read/[id]` URL and every `KnowledgeEntity`
  `/entities/[slug]` URL via Prisma) and `src/app/robots.ts` (allows all
  crawlers, points at `/sitemap.xml`, disallows `/admin`, `/api`,
  `/memory`, `/history`, `/bookmarks`).
- Accessibility: added a `.sr-only` utility class in `globals.css` and
  used it for the home composer's textarea label and the login page's
  email label; added `aria-label`/`aria-pressed` to the mic toggle button
  and an `aria-label` to the locale toggle button. `<html lang>` in
  `layout.tsx` already reflected the resolved locale cookie server-side —
  confirmed and left as-is.

**Phase 11 — Admin analytics + observability basics**
- Added a `RequestLog` model to `prisma/schema.prisma` (`path`, `method`,
  `statusCode`, `durationMs`, `createdAt`) — no raw request/message
  content is ever stored.
- Added `src/lib/requestLog.ts` (`logRequest()` plus a `withRequestLog()`
  wrapper) and wired it into `POST /api/chat`, `GET/POST/DELETE
  /api/bookmarks`, and `POST /api/reports` by wrapping the existing
  handler bodies — return values and behavior are unchanged.
- Extended `/admin` with an "Analytics" section: total conversations,
  messages, users, and bookmarks; open vs. resolved `UserReport` counts;
  and a "requests in last 24h by path" table via
  `prisma.requestLog.groupBy()`. All plain Prisma aggregate queries — no
  charting library, no new dependencies.
- Added a cost-awareness stub in `src/lib/chat.ts`: after each Anthropic
  API call, if `response.usage` is present, `input_tokens`/`output_tokens`
  are logged via `console.log`, with a comment marking where persisted
  token-usage tracking (e.g. on `RequestLog` or a future `UsageLog` model)
  should be added later.
- `node_modules/.prisma/client/{index,default,edge,wasm}.d.ts` hand
  stubs extended with a `RequestLogModel` type, a `requestLog` client
  delegate, and a `groupBy()` method on `ModelDelegate` (needed for the
  admin analytics "requests by path" query), matching the same
  hand-maintained-stub pattern used by every prior phase.

**Phase 12 — Conversation UX polish + threading**
- Added `pinned Boolean @default(false)` to `Conversation` (`title` already
  existed from earlier phases and already auto-titled from the first
  message, so this phase adds explicit rename on top of that).
- Added `src/app/api/conversations/[id]/route.ts` (`PATCH`) — renames
  and/or pins/unpins a conversation. Ownership is checked via
  `resolveSession()` the same way every other route does: the existing
  row's `userId`/`guestSessionId` must match the caller before the update
  is allowed, otherwise a 404 is returned (not a 403, to avoid leaking
  existence of other users' conversations).
- `src/app/chat/[id]/ChatThread.tsx`: title is now inline-editable (click
  to edit, blur/Enter to save, Escape to cancel) and there's a Pin/Unpin
  button, both calling the new PATCH route. `/history`
  (`src/app/history/page.tsx`) now orders pinned conversations first
  (`orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }]`) and shows a pin
  icon next to pinned titles.
- Follow-up question suggestions: `SYSTEM_PROMPT` in `src/lib/chat.ts` now
  asks Claude to end every answer with a `FOLLOWUPS:\n1. ...\n2. ...\n3. ...`
  block. `extractFollowups()` (new, in `src/lib/chat.ts`) strips that block
  out of the displayed answer and returns it as a separate `followups:
  string[]` array; `runChatTurn()`'s result and `POST /api/chat`'s JSON
  response both now carry `followups`. `ChatThread.tsx` renders them as
  clickable chips under each assistant message that populate the composer
  textarea when clicked.
- The composer already had a "Sending..." loading state
  (`t(locale, "sending")`) disabling the send button while a request is in
  flight; left as-is per the "don't over-engineer real streaming" guidance
  — confirmed it covers the perceived-responsiveness requirement.

**Phase 13 — Memory Centre UX (BRD FR-MEM)**
- Added `category String @default("inferred_preference")` (one of
  `explicit_fact` | `inferred_preference` | `summary` | `learning_progress`)
  and `paused Boolean @default(false)` to `MemoryItem`.
- Added `src/app/api/memory/[id]/route.ts` (`PATCH` for pause/resume/edit,
  `DELETE`), both ownership-checked via `resolveSession()` against the
  existing row's `userId`/`guestSessionId`, mirroring the conversations
  route above.
- `/memory` (`src/app/memory/page.tsx` + `MemoryList.tsx`) now groups
  items under category section headers and gives each item its own
  Pause/Resume and Delete buttons instead of only page-level bulk add/
  delete. Adding a note now also lets you pick its category.
- Added `src/lib/memorySafety.ts` — `containsSensitiveContent(text)`, a
  regex/keyword denylist covering health conditions, caste terms, a
  date-like + time-like + place-like clustering heuristic for precise
  birth date+time+location combos, political party names, and intimate/
  sexual content keywords. `POST /api/memory` now calls this before
  creating any `MemoryItem` and, if flagged, refuses to store it and
  `console.warn`s that a write was blocked for policy reasons — the
  flagged content itself is never included in that log line.

**Phase 14 — Data export + account deletion**
- Added `userId String?` to `UserReport` so reports can optionally be
  linked back to the logged-in user who filed them (`POST /api/reports`
  now sets it when the caller is logged in; guests still file reports
  with `userId: null` as before).
- Added `GET /api/account/export` — requires a logged-in user
  (`resolveSession().type === "user"`; guests get a 401 explaining that
  export requires an account) and returns a single JSON file (via
  `Content-Disposition: attachment`) containing that user's Conversations
  + Messages + Citations, MemoryItems, Bookmarks, and UserReports.
- Added `POST /api/account/delete` — requires a logged-in user and a
  `{ confirm: "DELETE" }` body field. Since `prisma/schema.prisma` doesn't
  have `onDelete: Cascade` wired up for user-owned rows (left alone to
  avoid a riskier schema/foreign-key change at this stage), deletion is
  done manually inside a single `prisma.$transaction([...])`: Citations →
  Messages → Conversations, MemoryItems, Bookmarks are deleted; UserReport
  rows are anonymized (`userId` set to `null`, content kept for admin
  review) rather than deleted; finally the `User` row itself is deleted.
  The session cookie is cleared on the response.
- Added `/account` (`src/app/account/page.tsx` + `AccountClient.tsx`),
  linked from the nav in `src/app/layout.tsx` for logged-in users only.
  "Download my data" hits the export route and triggers a browser
  download. "Delete my account" requires typing `DELETE` into a text
  input before the button is enabled (client-side UX guard only; real
  enforcement is the server-side `confirm` field check).
- `node_modules/.prisma/client/{index,default}.d.ts` hand stubs extended
  again, following the same pattern as prior phases: `pinned` on
  `ConversationModel`, `category`/`paused` on `MemoryItemModel`, `userId`
  on `UserReportModel`, plus an `updateMany()` method on `ModelDelegate`
  and an array-form overload for `$transaction` (both newly needed by the
  account-deletion transaction above). `edge.d.ts`/`wasm.d.ts` are
  untouched — they only export loosely-typed `any` stand-ins and don't
  encode per-model fields.

## Project structure

- `src/app` — pages (`/`, `/chat/[id]`, `/history`, `/memory`) and API routes
  (`src/app/api/**`)
- `src/lib` — `prisma.ts` (client singleton), `guestSession.ts` (cookie-based guest
  session helper), `session.ts` (unified guest/user session resolver used by every
  route/page), `authToken.ts` (stateless HMAC-signed login/session tokens),
  `retrieval.ts` (Postgres full-text search retrieval), `anthropic.ts` (lazy Claude
  client wrapper — missing key never crashes build/import)
- `src/app/login`, `src/app/api/auth/{email-login,verify,logout}` — magic-link login
  flow
- `prisma/schema.prisma`, `prisma/seed.ts`

## UI/UX Redesign v1.0

A full front-end redesign was implemented against a detailed IA/visual
spec (two modes — "Ask VedVani" conversational chat and "Study Library"
deep reading — inside a persistent AppShell: left navigation rail, main
workspace, contextual right panel, top bar, bottom composer).

**Fully implemented and wired to real data:**
- `src/components/AppShell.tsx` + `src/components/Sidebar.tsx` — grouped,
  collapsible left rail (brand, new conversation, search, Ask VedVani,
  divination tools, knowledge library, living-tradition group, personal
  area, conversation history, pinned donation card, account footer) per
  spec section 4. Applied globally to every non-admin route via
  `middleware.ts` (stamps `x-vv-pathname`) + `src/app/layout.tsx`; `/admin`
  keeps its pre-existing simpler shell untouched.
- `src/lib/library.ts` — hierarchy-derivation layer (see below) powering:
  - `/library` — family browser (Vedas & Vedangas, Upanishads, Itihasa,
    Puranas & Upapuranas, Darshanas & Sutras, Agamas & Tantras, Dharma/Niti
    & Shastra, Bhakti & Regional Literature) with live work/passage counts
    and review-status coverage badges, computed from `CorpusPassage`.
  - `/library/[family]` — works within a family, real counts/coverage.
  - `/library/work/[work]` — work overview: family, intro, tradition tags,
    text-layer/attribution summary, "Continue Reading", contents preview,
    "Ask VedVani about this work".
  - `/read/[id]` — redesigned into the required TOC | Reading | Study
    three-column reader (spec section 7), driven by real sibling passages
    in canonical reading order (`compareLocations`), with prev/next,
    original/translation layers, translation-compare entry point,
    attribution, related entities, bookmark, "Ask about this verse", and a
    compact donation card. Citations already linked here before this pass
    (`/read/:id`) continue to open the exact passage.
- Conversational home (`/`, `/ask`) reuses the existing `HomeClient` chat
  composer (voice input, response-mode selector) wired to the existing
  `/api/chat` pipeline; `/c/[id]` is a second entry point onto the
  existing saved-conversation view (`ChatThread`) alongside `/chat/[id]`.
- `/search` — real full-text-ish search across `CorpusPassage` +
  `KnowledgeEntity`.
- Design tokens (maroon/saffron/gold/paper/sand/ink/muted/success/error),
  8px-ish spacing, Devanagari serif reading styles, reduced-motion guard,
  and reader/library/sidebar component classes added to
  `src/app/globals.css` (extends, does not replace, the pre-existing
  tokens still used by untouched pages).

**Deliberate pragmatic divergence — hierarchy-derivation, not a schema
migration:** `CorpusPassage` is a flat table (no Work → Division → Section
→ Unit model). This sandbox cannot reach `binaries.prisma.sh` to run
`prisma generate`/`migrate dev`, so adding a real hierarchy table was not
safely achievable here. Instead, `src/lib/library.ts` derives the
family/work grouping and reading order at query time:
`familyOf(sourceWork)` buckets each distinct `sourceWork` string into one
of the eight corpus families by keyword rules; `parseLocation`/
`compareLocations` turn location strings like `"10.129.1-2"`, `"2.47"`, or
bulk-ingestion's `"chunk N"` into a comparable ordinal so passages sort in
canonical reading order instead of alphabetically. Canonical URLs remain
passage-id based (`/read/:id`) rather than `/read/:work/:reference`,
matching the citation-linking pattern already established in the existing
chat pipeline. If/when a real ingestion-time hierarchy table is added,
`library.ts` is the intended single seam to swap the derivation for real
joins.

**Stubbed / UI-only (no backend logic wired):**
- `/astrology`, `/astrology/chart`, `/numerology`, `/tarot` — shells using
  AppShell + correct disclaimers ("traditional/interpretive guidance",
  "for reflection, not certainty"); no calculation engines.
- `/donate` — full UI/copy/flow (amount + programme selection, donor
  fields) with an explicit "payment gateway integration pending
  legal/compliance review" state instead of a real checkout; sidebar
  donation card uses the exact required compact copy, the founder's
  literal request text appears only on `/donate`.
- `/topics/[slug]`, `/traditions/[slug]`, `/saints`, `/saints/[slug]`,
  `/festivals`, `/festivals/[slug]` — thin stubs (reuse `AppShell`,
  redirect into `/search`/`/entities` where a real backing list already
  exists).
- `/settings` — accessibility/voice/response-mode explanation page; no new
  persisted preferences beyond the existing locale cookie.
- Voice greeting states (idle/greeting/listening) and TTS playback are
  described in copy but not built as a dedicated `VoiceOrb` component in
  this pass — the existing Web Speech API mic input in `HomeClient`
  remains the actual voice entry point; typing is always a full
  alternative.

**Not touched:** `prisma/schema.prisma` (no migration attempted, per the
constraint above), the chat/safety/retrieval pipeline (`src/lib/chat.ts`,
`src/lib/retrieval.ts`), admin console, auth, memory, bookmarks, i18n
dictionary structure (extended with new copy inline in components rather
than every string routed through `t()`, to keep this pass scoped — the
new UI is currently English-first with the existing locale toggle still
functional site-wide).

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

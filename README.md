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

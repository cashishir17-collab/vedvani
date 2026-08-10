# VedVani

VedVani answers questions about Hindu scripture and tradition (Vedas, Upanishads,
Bhagavad Gita, Puranas) using retrieval-augmented generation over a small seeded
public-domain corpus plus Claude for generation, with inline citations. It never
invents verses, distinguishes "Scripture says" / "Commentary" / "Tradition holds" /
"VedVani synthesis" / "Uncertain-disputed", never claims divine authority, and stays
pluralistic across sampradayas (no sectarian ranking).

This is a first vertical slice: monolithic Next.js 14 App Router app (frontend + API
routes together), guest-session auth, browser-native voice I/O, and a minimal
opt-in/viewable/deletable memory feature.

## Stack

- Next.js 14 (App Router) + TypeScript
- Prisma + Postgres
- `@anthropic-ai/sdk` (Claude, model `claude-sonnet-4-5-20250929`)
- ElevenLabs REST API for TTS (plain `fetch`, no SDK)
- Cookie-based guest sessions (`guest_session_id` httpOnly cookie -> `GuestSession` row)

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

## Corpus integrity

`prisma/seed.ts` seeds ~20 short passages from public-domain sources (Bhagavad Gita,
Upanishads, Rigveda, and general Puranic/Dharmashastra tradition summaries). Every
entry is labeled `sourceType`:

- `primary_text` — used only where we are genuinely confident the wording matches a
  known public-domain translation (a handful of extremely well-known verses: Gita
  2.47, Isha Upanishad opening verse, Mundaka 3.1.6 "Satyameva jayate").
- `paraphrase_summary` — used everywhere else, with `attribution: "VedVani summary"`.
  These are careful, accurate paraphrases, not verbatim quotations. This applies to
  most Gita/Upanishad entries and to all Rigveda (Nasadiya Sukta, Purusha Sukta, Agni,
  Indra) and Purana/Dharmashastra entries in this seed, because exact historical
  translator wording could not be confidently reproduced without a source text at
  hand.

See the comment block at the top of `prisma/seed.ts` for the full breakdown and the
no-fabrication rule for future editors.

## What's stubbed / out of scope for this slice

- Real authentication (email magic-link / password login). `/api/auth/email-login`
  is a stub that loosely tags the current guest session with an email and returns
  "not implemented in this slice." Guest-session mode is the fully working path.
- Voice-to-voice streaming (only browser Web Speech API for STT, and ElevenLabs
  request/response TTS — no low-latency streaming pipeline).
- Multi-language UI (interface is English; voice recognition is set to `en-IN` and
  can be extended to Hindi locales, but there's no i18n layer yet).
- Admin console / editorial workflow for managing the corpus (corpus is seeded via
  `prisma/seed.ts` only; no CMS or review queue).
- Jyotish (astrology) features.
- Vector DB / embeddings-based retrieval — this slice uses plain Prisma
  `contains`/ILIKE keyword matching over `CorpusPassage` fields.

## Project structure

- `src/app` — pages (`/`, `/chat/[id]`, `/history`, `/memory`) and API routes
  (`src/app/api/**`)
- `src/lib` — `prisma.ts` (client singleton), `guestSession.ts` (cookie-based guest
  session helper used by every route), `retrieval.ts` (keyword retrieval),
  `anthropic.ts` (lazy Claude client wrapper — missing key never crashes build/import)
- `prisma/schema.prisma`, `prisma/seed.ts`

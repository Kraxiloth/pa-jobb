# På Jobb

**Fra befaring til ferdig jobb.**

På Jobb is a Norwegian-first, mobile-first and offline-first SaaS product for self-employed tradespeople and very small service businesses.

## Status

Early foundation. Product specification is in `docs/pa-jobb-product-spec-v0.1.md` and architecture decisions live in `docs/adr/`.

## Stack

- SvelteKit 3 / Svelte 5 / TypeScript
- Cloudflare Workers
- D1, R2 and Queues (bindings added when environments are provisioned)
- IndexedDB, with Dexie as a replaceable helper
- Zod
- Vitest
- Playwright

See `docs/adr/001-application-stack.md` for rationale.

## Requirements

- Node.js 22+
- npm
- A Cloudflare account is **not** required for ordinary local UI development.

## Local development

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Validation

```bash
npm run check
npm run test
npm run build
```

For browser tests, install Playwright browsers once:

```bash
npx playwright install
npm run test:e2e
```

## Cloudflare

The project targets Cloudflare Workers using the official SvelteKit adapter. `wrangler.jsonc` intentionally contains no D1/R2/Queue production bindings yet.

Do not deploy from a development branch merely because Wrangler makes it easy. That is how we got here.

## Environment policy

Planned environments:

- local development
- staging
- production

Production data/resources must not be used for routine development.

Secrets belong in local `.dev.vars` or Cloudflare secrets, never Git. `.env.example` contains only safe placeholders.

## Domain

Public product domain: `på-jobb.no`.

Technical identifiers use ASCII where appropriate (`pa-jobb`, `pajobb`).

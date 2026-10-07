# ADR-001: Application stack

**Status:** Accepted  
**Date:** 2026-10-07

## Context

På Jobb is a Norwegian-first, mobile-first, offline-first SaaS application. It must remain usable on unreliable mobile connections, deploy cleanly to Cloudflare, and avoid unnecessary coupling to replaceable convenience libraries.

## Decision

Use:

- SvelteKit 3 + Svelte 5
- TypeScript
- Vite
- Cloudflare Workers with the official `@sveltejs/adapter-cloudflare`
- D1 for structured server data
- R2 for photos/documents
- Queues for asynchronous processing
- IndexedDB for device-local persistence, with Dexie as a replaceable helper
- Zod for boundary validation
- Vitest for unit/integration tests
- Playwright for browser/end-to-end tests

Use browser standards (IndexedDB, Service Workers, Web App Manifest, Fetch/HTTP) as architectural primitives. Business rules and synchronization logic must not depend unnecessarily on framework/library-specific types.

## Why

SvelteKit is an official, actively maintained Svelte framework with first-party Cloudflare support. Cloudflare Workers currently detects/configures SvelteKit and uses the official Cloudflare adapter. The stack supports a single TypeScript codebase while preserving a standards-based offline model.

## Consequences

- Framework conveniences may be used at UI/server boundaries, but core domain rules should remain portable.
- Dexie must be wrapped behind På Jobb-owned interfaces once offline persistence is implemented.
- Cloudflare bindings must be accessed behind application-owned services rather than scattered throughout UI code.
- New dependencies require a concrete reason; trivial utility packages are discouraged.
- Production resources are not created as part of the initial scaffold.

## Alternatives considered

- React: mature and viable, but requires more ecosystem choices for this application.
- Vue: also viable; Svelte was preferred for concise component/state code and the current first-party Cloudflare path.
- Vanilla TypeScript: insufficiently structured for the expected application size and state complexity.

## Revisit when

Revisit only if the selected stack creates a demonstrated constraint, loses credible maintenance/support, or Cloudflare compatibility materially deteriorates.

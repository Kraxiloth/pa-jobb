# Scaffold notes

The initial På Jobb application scaffold was prepared and validated on 2026-10-07.

## Validated baseline

The foundation has been tested successfully on Windows 11 with Node.js 22+.

The validated stack is:

- Svelte 5
- SvelteKit 3
- TypeScript 6
- Vite 8
- `@sveltejs/adapter-cloudflare`
- Cloudflare Workers
- Dexie
- Zod
- Vitest
- Playwright

The following validation steps pass:

```powershell
npm audit
npm run check
npm run test
npm run build
npm run test:e2e
```

At validation time:

- `npm audit` reported 0 vulnerabilities;
- `svelte-check` reported 0 errors and 0 warnings;
- Vitest passed the unit test suite;
- the production build completed successfully;
- the Cloudflare adapter completed successfully;
- the production build rendered correctly through the local Cloudflare runtime;
- Playwright passed both desktop Chromium and mobile Chromium smoke tests.

## SvelteKit 3 configuration

SvelteKit 3 configuration is supplied through the `sveltekit(...)` plugin in `vite.config.ts`.

A legacy `svelte.config.js` is not used.

`tsconfig.json` extends SvelteKit's built-in configuration through:

```json
"extends": "$app/tsconfig"
```

If the `types` compiler option is overridden, it must retain SvelteKit's generated types alongside Node types:

```json
"types": ["$app/types", "node"]
```

## Cloudflare configuration

The application uses the official Cloudflare adapter.

Static assets are configured in `wrangler.jsonc` with an explicit `ASSETS` binding. D1, R2 and Queue bindings are intentionally not part of the initial scaffold and should be added separately per environment as those services are introduced.

No Cloudflare databases, buckets, queues, production domains or secrets are created by this scaffold.

## Dependency security override

The dependency tree initially resolved `sharp@0.35.4` through Wrangler and Miniflare. That version was affected by GHSA-wq5f-xc86-pv6w.

`package.json` therefore contains a temporary npm override requiring a patched version:

```json
"overrides": {
  "sharp": "^0.35.5"
}
```

The override should be removed once the upstream Wrangler/Miniflare dependency tree resolves to a patched `sharp` version without it.

Do not use `npm audit fix --force` merely to remove this override or silence audit output. Review upstream dependency changes first.

## Test layout

The test suites are deliberately separated:

```text
tests/
├── unit/
│   └── *.test.ts
└── e2e/
    └── *.spec.ts
```

Vitest owns `tests/unit`.

Playwright owns `tests/e2e`.

This prevents the two test runners from discovering and attempting to execute each other's tests.

## Browser testing on Windows

Routine local end-to-end testing currently uses:

- desktop Chromium;
- mobile Chromium using Playwright device emulation.

Playwright WebKit was intentionally removed from the routine Windows configuration after Windows Security blocked DLL loading by Playwright's `PrintDeps.exe` dependency-validation helper. Windows security protections were not weakened or broadly excluded to make WebKit run.

WebKit/Safari compatibility remains a release-testing concern and should later be covered in a controlled CI environment and, where practical, on real Apple hardware.

## Generated files

Generated/runtime directories such as the following must remain outside version control:

```text
node_modules/
.svelte-kit/
test-results/
playwright-report/
```

`package-lock.json` is committed so dependency resolution is reproducible.

## Current scope

This scaffold establishes only the application foundation. It does not yet implement authentication, tenant data, D1 migrations, R2 storage, synchronization, jobs, customers or other business functionality.

Those features should be added incrementally on top of this validated baseline rather than bundled into the foundation commit.

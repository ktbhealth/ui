# @ktbhealth/ui — agent guide

Design system monorepo: Tailwind v4 tokens (`packages/tailwind`) +
component libraries for React (`packages/react`, shadcn-style on
Base UI) and Vue (`packages/vue`, shadcn-vue).

## Consumers

Consumed via git-tag deps, e.g.
`"@ktbhealth/ui": "github:ktbhealth/ui#v0.1.3@react"` — the
`@react`/`@vue`/`@tailwind` suffix selects the flavor; the root
`exports` map resolves sources. Releases are **git tags only** — no
registry publish. Full checklist (version bumps, per-flavor tags,
token regeneration, consumer pin bumps) lives in `README.md` →
"Releasing". Never push tags unless asked.

## Workspaces

Root `package.json` has `"workspaces": ["packages/*"]` — `bun install`
at the root installs all per-package devDeps. This is local-dev only;
consumers resolve the repo via the root `exports` map, so the field
does not affect git-tag consumption.

## Rules

- Components are framework-paired: React components in
  `packages/react/src/components/`, Vue in `packages/vue/src/`.
- Tokens are the single source of truth — semantic colors/utilities
  come from `packages/tailwind`; never hardcode hex in components.
  After changing `tokens/tokens.json` or `src/globals.css`, run
  `bun run build:tokens` in `packages/tailwind` and commit the
  regenerated `src/generated/*`.
- Catalog/stories live in the sibling `storybook` repo — new
  components need stories there.
- Verify per package: `bunx vitest run` + `bunx tsc --noEmit`
  (React) / `bunx vue-tsc --noEmit` (Vue — plain `tsc` cannot resolve
  `.vue` files).
- Known issue: `packages/react` `tsc --noEmit` reports TS2308
  duplicate-export errors in `src/index.ts` (`export *` collisions
  between `dialog`/`app-dialog`, `toast`/`app-toast`, `code-block`/
  `ai-elements/code-block`, `message`/`ai-elements/message`,
  `attachment`/`ai-elements/attachments`, `lib/highlighter`).
  Pre-existing; fix by explicit re-exports if touched.

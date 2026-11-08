# @ktbhealth/ui — agent guide

Design system monorepo: Tailwind v4 tokens (`packages/tailwind`) +
component libraries for React (`packages/react`, shadcn-style on
Base UI) and Vue (`packages/vue`, shadcn-vue).

## Consumers

Consumed via git-tag deps, e.g.
`"@ktbhealth/ui": "github:ktbhealth/ui#v0.1.1@react"` — the `@react`/`@vue`
suffix selects the flavor. After changing components/tokens here, tag a
new release (`git tag vX.Y.Z`) and bump consumer package.json files.

## Rules

- Components are framework-paired: React components in
  `packages/react/src/components/`, Vue in `packages/vue/src/`.
- Tokens are the single source of truth — semantic colors/utilities
  come from `packages/tailwind`; never hardcode hex in components.
- Catalog/stories live in the sibling `storybook` repo — new
  components need stories there.
- No test runner configured at root; verify with consumers' builds.

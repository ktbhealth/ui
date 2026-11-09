# @ktbhealth/ui

KTB Health design system: shared Tailwind v4 tokens plus React and Vue component libraries.

## Packages

- `@ktbhealth/tailwind` — design tokens + base styles (`globals.css`), single source of truth
- `@ktbhealth/ui-react` — shadcn/Base UI React components (source exports)
- `@ktbhealth/ui-vue` — shadcn-vue components on the same tokens

## Install (git-only, tagged releases)

```bash
bun add github:ktbhealth/ui#v0.1.3@react
```

Tags are per flavor: `vX.Y.Z@tailwind`, `vX.Y.Z@react`, `vX.Y.Z@vue`.
The `@<flavor>` suffix selects which component library the consumer
gets; the repo root's `exports` map resolves the rest. All flavors
share one tag namespace — tag all three at the same commit for a
release.

## Development

This is a bun workspaces monorepo (`packages/*`). `bun install` at the
root installs every package's dependencies — per-package devDeps
(vitest, jsdom, @testing-library, vue-tsc, …) only resolve this way.

```bash
bun install

cd packages/vue   && bunx vitest run && bunx vue-tsc --noEmit
cd packages/react && bunx vitest run && bunx tsc --noEmit
cd packages/tailwind && bun run build:tokens   # regenerate tokens
```

Workspaces are a local-dev concern only: consumers install this repo
as a git-tag dependency and resolve source via the root `exports`
map, so the `workspaces` field does not affect the published artifact.

## Releasing

There is no registry publish — releases are git tags. Checklist:

1. Bump `version` in the root `package.json` **and** in each of
   `packages/{tailwind,react,vue}/package.json` to the same `X.Y.Z`.
   (All are currently `0.1.0`; tags have already moved ahead — see
   "Tag history" below. Keep them in sync going forward.)
2. If `packages/tailwind/tokens/tokens.json` or
   `packages/tailwind/src/globals.css` changed, run
   `cd packages/tailwind && bun run build:tokens` and commit the
   regenerated `src/generated/*` in the same change.
3. Commit, then tag the commit once per flavor:

   ```bash
   git tag vX.Y.Z@tailwind && git tag vX.Y.Z@react && git tag vX.Y.Z@vue
   git push origin main --tags   # or push tags explicitly
   ```

4. Bump the pin in consumers (`github:ktbhealth/ui#vX.Y.Z@react` /
   `@vue`) — e.g. `repos/product/apps/web/package.json`,
   `repos/storybook/package.json`.

### Tag history

| tag              | commit  | note                                  |
| ---------------- | ------- | ------------------------------------- |
| `v0.1.0@{react,tailwind,vue}` | `4b86028` | first tagged release            |
| `v0.1.1@react`   | `0385ce0` | react-only fix                        |
| `v0.1.2@react`   | `7303a67` | react-only fix                        |
| `v0.1.3@react`   | `fb49ba6` | react-only feature (current pin)      |

Flavors may be tagged independently when only one library changed;
prefer tagging all three together so versions stay aligned.

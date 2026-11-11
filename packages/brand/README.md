# @ktbhealth/brand

KTB Health brand assets: logo, lockups and video-call backgrounds. This
package is **private** — the files are consumed through the `ui` repo like
everything else:

```ts
import logo from "@ktbhealth/ui/brand/logo-horizontal.svg";
```

They only exist in consumers after a `ui` release (git tag), see the root
`README.md` → "Releasing".

## Files (`assets/`)

| file | use |
| --- | --- |
| `logo-mark.svg` / `.png` | App icon, avatars, favicons (blue tile) |
| `logo-mark-inverse.svg` / `.png` | Mark on blue or dark backgrounds (white tile) |
| `logo-horizontal.svg` / `.png` | Mark + "KTB Health", for light backgrounds |
| `logo-horizontal-inverse.svg` / `.png` | Same, for dark or blue backgrounds |
| `meet/meet-light.png` | 1920×1080 video-call background, light |
| `meet/meet-dark.png` | 1920×1080 video-call background, dark |
| `meet/meet-primary.png` | 1920×1080 video-call background, brand blue |
| `colors.json` | Brand colors as hex (generated from the design tokens) |

SVG files have the wordmark converted to outlines (Geist), so they render
the same without installing the font.

## Rules

- The mark is the logo from the landing page header: the `book-plus` icon
  (lucide, ISC license) on a rounded tile in the primary color. Do not
  recolor, stretch, rotate or add effects.
- Keep clear space around the lockup equal to the height of the "K".
  Minimum size: 24 px tall for the mark, 96 px wide for the horizontal logo.
- Use the regular version on light backgrounds and the inverse version on
  dark or brand-blue backgrounds.
- Every color is a design token (`packages/tailwind`, light and dark theme); `colors.json`
  is generated from them, never edited by hand.

## Video-call backgrounds

The logo sits in the top-left corner and the ring motif on the right, so the
center and bottom (where the person and the name label appear) stay clear.
Google Meet shows your own background mirrored in self-view; other people
see it the right way around.

To use: Meet → *Apply visual effects* → *Backgrounds* → **+** → upload the
PNG.

## Regenerating

```bash
bun install            # at the repo root
cd packages/brand
bun run build          # needs ImageMagick (`magick`) with librsvg
```

The script reads the tokens, converts the colors, outlines the wordmark with
the Geist font (`@fontsource/geist`) and writes everything in `assets/`.
Commit the regenerated files.

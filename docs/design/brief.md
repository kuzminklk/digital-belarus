# Visual brief — «Цифровая Беларусь»

> This is the working brief for the brand and ornament system. Expand it into
> the final design documentation (`visual-language.md`, `ornament.md`,
> `typography.md`) once the components exist.

## Concept

**An observatory for Belarusian business.** The studio treats the internet as a
night sky: a business is a point of light, a website is an instrument for finding
it. The design borrows the language of a scientific observatory — star charts,
coordinate labels, orbit ticks, hairline grids, instrument read-outs — and fuses
it with Belarusian weaving. The result should feel nocturnal, precise and quietly
confident, not "space themed" or sci-fi.

**One sentence:** a modern Belarusian star chart, embroidered in pixels.

## References

- [NOCTRA Observatory Website Design](https://www.behance.net/gallery/248063485/NOCTRA-Observatory-Website-Design-UXUI) — dark editorial atmosphere, oversized type, instrument details, restrained palette.
- Belarusian rushnyk and vyshyvanka cross-stitch patterns — rhombi, stars, the tree of life, endless-line borders, red on white.
- Atari / 8-bit pixel graphics — strict grids, no anti-aliasing, deliberate crisp edges.
- The site's own reference content: Volga Digital (honest, plain-spoken studio copy).

## Palette

See `src/styles/tokens.css` for the source of truth.

| Token         | Hex                      | Use                                 |
| ------------- | ------------------------ | ----------------------------------- |
| `--ink-1000`  | `#030507`                | page depths, vignettes              |
| `--ink-950`   | `#05080b`                | page background                     |
| `--ink-900`   | `#070b10`                | section background                  |
| `--ink-850`   | `#0a0f15`                | raised panels                       |
| `--ink-750`   | `#111a22`                | card surfaces                       |
| `--paper`     | `#ece9df`                | primary text                        |
| `--paper-dim` | `#c7c3b7`                | secondary text                      |
| `--muted`     | `#8d9aa5`                | metadata, labels                    |
| `--line`      | `rgb(236 233 223 / 12%)` | hairlines                           |
| `--red`       | `#e2453a`                | signal accent (Belarusian red)      |
| `--aurora`    | `#8fe3b0`                | secondary accent, "signal received" |
| `--gold`      | `#c9a86a`                | rare warm accent, awards/notes      |

Rules: one dominant accent per view. Red is for action and signal; aurora is for
live/system states; gold is rare. Never place red text on aurora or vice versa.
Keep contrast at WCAG AA (4.5:1) for all body text.

## Typography

- Display: **Cormorant Garamond** (variable, 300–700 + italic). Huge, tight,
  slightly romantic. Use italic for one accent word per heading.
- Body: **Manrope** (variable 400–800). Neutral, Cyrillic-native.
- Technical: **JetBrains Mono** (variable 400–700). Uppercase, letterspaced
  labels, coordinates, indices, micro-copy.
- Belarusian and Russian Cyrillic must render correctly (`ў`, `і`, `ё`);
  all three families include the `cyrillic` subset. Do not use Ukrainian-only
  styling for Belarusian.

## Grid & layout

- 12 columns, max width 1480px, fluid gutters `clamp(1.25rem, 3.6vw, 4rem)`.
- Sections separated by full-width hairlines; generous vertical rhythm
  `clamp(5rem, 9vw, 9.5rem)`.
- Sharp corners (2px max), hairline borders, corner ticks like a viewfinder.
- Elements sit on the grid, but a few oversized marks (asterisms, numerals,
  ornament strips) may bleed outside the container.

## Ornament rules

- Pixel construction grid: **16 × 16** or **32 × 16** modules.
- Every pixel is a `<rect>` aligned to integers; `shape-rendering="crispEdges"`;
  no curves, gradients, blur or anti-aliased strokes inside motifs.
- Motifs: rhombus ("зорка"), eight-point star, tree of life, endless line,
  crosses and hooks from rushnyk borders.
- Tones: paper (default), red (accent), muted (background). Red is used
  sparingly; never all three in one motif.
- Animate only opacity / tiny translate steps, with long irregular delays.
  Respect `prefers-reduced-motion`.
- Ornament is decorative: `aria-hidden="true"`, `focusable="false"`.
- It should read as a designed identity system, not a decorative afterthought:
  use the same motif across logo, dividers, icons, favicon and OG image.

## Required brand components

All in `src/components/brand/`, typed, no new dependencies.

1. `PixelMark.tsx` — logo mark. A rhombus/star built on a 16×16 pixel grid with
   a red centre pixel-cluster; works at 24–96px and on dark/light. Props:
   `size?: number`, `tone?: 'red' | 'paper' | 'mono'`, `className?: string`.
2. `Rushnyk.tsx` — ornament strip. Props: `variant?: 'border' | 'divider' |
'wave'`, `tone?: 'paper' | 'red' | 'muted'`, `height?: number`,
   `animated?: boolean`, `className?`. Full-width, seamless tiling, crisp.
3. `PixelIcon.tsx` — 16×16 icon set drawn as pixel rects, `currentColor`.
   Names: `site`, `bot`, `ai`, `automation`, `cart`, `crm`, `analytics`,
   `compass`, `code`, `shield`, `spark`, `clock`, `pin`, `mail`, `telegram`,
   `github`, `arrow`, `close`, `menu`. Props: `name`, `size?`, `className?`,
   `aria-hidden` default true.
4. `ConstellationMap.tsx` — the hero instrument (client component). SVG star
   map: deterministic starfield, Belarus outline as a constellation (use
   `src/content/belarus-outline.ts`), Minsk marked with a pulsing crosshair,
   polar orbit ring with ticks, neighbour codes, coordinate labels in JetBrains
   Mono, viewfinder corners. Pointer parallax (max 6px), subtle twinkle, static
   under reduced motion. Props: `className?`, `intensity?: 'subtle' | 'vivid'`.
5. `OrnamentField.tsx` — very low-contrast tileable ornament background for
   section corners; `variant?`, `className?`; always decorative.

## Motion

- Slow and deliberate: observatory instruments move with weight.
- Allowed: reveal on scroll, marquee, orbit rotation, twinkle, coordinate
  read-out changes, button fill wipes, underline draws.
- Forbidden: bounce, springy overshoot, big blur, parallax on text, cursor
  hijacking, continuous motion that cannot be paused by reduced motion.
- Durations from tokens; respect `prefers-reduced-motion: reduce`.

## Acceptance criteria

- Components compile in strict TypeScript and are self-contained.
- No external images, icon libraries or npm packages.
- Decorative pieces are hidden from assistive tech and cannot be focused.
- Ornaments are crisp at 1×, 1.5× and 2×; no half pixels.
- The system feels cohesive when mark + strip + icons + map + favicon appear on
  one page.
- Document decisions and usage examples in `docs/design/`.

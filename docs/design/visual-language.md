# Visual language

Status: implemented (v2 — warm two-tone)
Owner: designer
Related: [ornament](ornament.md) | [typography](typography.md) | [image credits](image-credits.md) | [tokens](../../src/styles/tokens.css)

> A warm monochrome observatory: ink, paper, pixel serif and dithered light.

The v2 direction replaces the cold dark-blue/serif/red/green system with a
strict, warm, two-colour world inspired by the NOCTRA observatory reference. It
reads as an archival astronomy journal printed in two inks: near-black ink and
warm cream paper, with pixel-art typography and 1-bit dithered imagery.

## Principles

1. **Exactly two colours.** Warm near-black ink `#12100d` and archival cream
   `#ebe2d1`. There is no red, green, gold or blue anywhere — not in text, not
   in hover states, not in imagery, not in the favicon. Hierarchy comes from
   scale, case, density, texture and inversion, never from hue.
2. **Ink and paper, not dark mode.** Sections alternate full ink and full cream
   surfaces. The page should feel printed: cream can dominate a whole section,
   and the ink sections are warm-black, not blue-black.
3. **Pixel art is the craft.** The display face is a pixel-serif mask, the UI and
   body face is Handjet (a pixel mono), the mark is a pixel stamp, the imagery is
   dithered to visible square pixels. Nothing is smooth-bezelled or glossy.
4. **Archival, not sci-fi.** Celestial engravings, orbit labels, coordinates,
   figure numbers and hairline rules give the instrument feeling. No glow, no
   gradients, no neon, no "space" clip-art.
5. **Restraint.** One idea per screen. Large empty ink, hairline grammar, slow
   reveals. Dense pixel texture is reserved for imagery and display type.

## Palette

The palette lives in [`src/styles/tokens.css`](../../src/styles/tokens.css) and
contains two source colours plus alpha steps of the same two inks. No other hue
is allowed.

| Token            | Hex                      | Role                                 |
| ---------------- | ------------------------ | ------------------------------------ |
| `--ink-1000`     | `#0a0806`                | deepest vignette, overlay wash       |
| `--ink-950`      | `#12100d`                | primary ink surface, page background |
| `--ink-900`      | `#171410`                | ink section variation                |
| `--ink-850`      | `#1c1813`                | raised ink panel                     |
| `--ink-800`      | `#231e18`                | inset ink well                       |
| `--ink-750`      | `#2a241d`                | ink card / control                   |
| `--ink-700`      | `#322b22`                | ink hairline on cream, scrollbar     |
| `--ink-600`      | `#3d3529`                | strongest ink line                   |
| `--paper`        | `#ebe2d1`                | cream surface, paper text on ink     |
| `--paper-warm`   | `#f7f0e0`                | cream highlight, paper surfaces      |
| `--paper-dim`    | `#cfc3ae`                | secondary text on ink                |
| `--muted`        | `#9d907b`                | metadata, labels                     |
| `--muted-strong` | `#b9ac95`                | stronger metadata                    |
| `--line`         | `rgb(235 226 209 / 15%)` | default hairline (ink surface)       |
| `--line-strong`  | `rgb(235 226 209 / 32%)` | interactive borders                  |
| `--line-faint`   | `rgb(235 226 209 / 8%)`  | chart/background rules               |

### Contrast on ink

| Pair                            | Ratio   | Use                      |
| ------------------------------- | ------- | ------------------------ |
| `--paper` on `--ink-950`        | 14.77:1 | primary text             |
| `--paper-warm` on `--ink-950`   | 16.73:1 | display / emphasis       |
| `--paper-dim` on `--ink-950`    | 10.92:1 | secondary text           |
| `--muted-strong` on `--ink-950` | 8.50:1  | metadata                 |
| `--muted` on `--ink-950`        | 6.07:1  | least important labels   |
| `--ink-950` on `--paper`        | 14.77:1 | primary text on cream    |
| `--ink-950` on `--paper-dim`    | 12.4:1  | text inside cream panels |

All text pairs pass WCAG AA. Because there are only two colours, do not invent a
"disabled grey": use an alpha step of the current ink/paper, or reduce weight and
size instead. Legibility on cream is ensured by `.on-paper` component styles
(buttons, panels, links) that flip ink and paper.

### Forbidden

- Any third hue, including tints/shadings with colour temperature change.
- Gradients, glow, coloured shadows, glass blur, noise in colours.
- Opacity lowered so far that a mid-tone appears; keep either ink or paper
  readable.

## Typography

- **Display:** pixel-serif masks. Cormorant Garamond is rasterised very small,
  thresholded to hard pixels and upscaled — served as PNG masks via the
  `PixelType` component and `public/type/{locale}/`. It is the only "serif", and
  it is always pixel-hard.
- **UI / body / labels:** **Handjet**, a variable pixel mono, vendored as woff2
  and preloaded (`cyrillic` + `latin`). It replaces the whole v1 sans/mono stack:
  `--font-pixel`, `--font-sans`, `--font-display` and `--font-mono` all resolve
  to it.
- **Instrument labels:** uppercase Handjet, tracked 0.08–0.14em; coordinates and
  indices are always numerals + Latin.

Full construction, licences, subsets, mask pipeline and scale:
[typography.md](typography.md).

## Layout and grid

- **Container:** `--container: 1480px`, narrow `1080px` for prose.
- **Grid:** 12-column mental grid, implemented with proportional
  `minmax(0, …)` grid tracks. Recurring splits: hero copy/visual, split section
  mastheads, 2-up case gallery, 3-up services/pricing.
- **Rhythm:** `--section-y: clamp(5rem, 9.5vw, 10rem)`, `--gutter:
clamp(1.25rem, 3.6vw, 4rem)`, header `4.5rem`.
- **Breakpoints:** content-driven at **1120**, **1080**, **1000**, **900**,
  **760/640**, **560** and **420** px. Reuse the existing set; do not add one-off
  media queries.
- **Section surfaces:** alternate ink and cream. Cream (`.on-paper`) sections:
  Approach, Pricing, Studio, calculator result and the contact form panel; ink
  sections: Hero, Services, Process, Cases, FAQ, Contact, Footer. The
  `.on-paper` wrapper flips component primitives and grain opacity; text colour
  switches to ink automatically.
- **Bleed:** the lunar band, atlas engraving, portrait and case covers are
  full-bleed or full-column images; rules and pixel masks may bleed past the
  container. Everything else sits on the grid.
- **Edges:** radius 0. Borders are 1 px hairlines. Corner ticks are allowed only
  as instrument details (hero band, portrait), never as rounded cards.

## Surfaces and texture

1. **Two surfaces.** Ink sections and paper sections, nothing in between. Use
   `--ink-900/--ink-850` only as slight depth steps within an ink section, and
   `--paper-warm` within a cream section.
2. **Hairlines.** Structure is drawn with 1 px rules and 1 px borders, never
   with shadows or cards. Rules divide rows and sections; they can be dotted,
   dashed or a thin embroidered Rushnyk rule.
3. **Grain.** The fixed film-grain overlay is retained at a very low opacity
   (0.02 on cream); it keeps large flat fields from looking like flat UI and
   echoes the print texture. It is disabled under reduced motion.
4. **No elevation.** `--shadow-panel` exists for one-off deep overlays only.
   There is no card shadow, glow or blur over content.
5. **Texture is imagery.** The main visual texture of v2 is the 1-bit dither
   inside photographs and engravings, not CSS noise.

## Imagery

Imagery is the identity: every photograph is processed to a 1-bit print.

- **Pipeline:** grayscale → autocontrast → optional contrast stretch → low pixel
  grid (250–533 px wide) → optional blur → Floyd–Steinberg dither with a target
  ink coverage → ink/cream palette → nearest-neighbour upscale ×2–×4. Outputs are
  in `public/pixel/`; sources and licences in [image-credits.md](image-credits.md).
- **Two treatments:**
    - **Cream-on-ink** photographs (lunar band, portrait-inverted, case covers):
      baked ink field with cream highlights, high ink coverage (50–70%).
    - **Ink-on-cream** engravings and the portrait (atlas, portrait): cream field
      with ink engraving, low ink coverage (28–42%).
- **Archival atlas:** Cellarius’ 1660 celestial chart is a cream-section texture
  and a recurring celestial-engraving motif (`atlas.png`, `atlas-square.png`).
- **Pixel-art UI:** `case-prabot.png` is hand-built from 1:1 modules in the two
  inks (Telegram chat surface), no photograph. It shows the bot product without
  screenshots.
- **Rules:** no colour images, no smooth grayscale photos, no external stock
  outside the pipeline. Never stretch a dither: scale by integer factors and keep
  pixels square. Do not place small body text directly on busy dither — use a
  solid ink or cream field, or a mask gradient of the background surface.
- **Alt text:** the hero band and case covers are decorative (`alt=""`) because
  the adjacent headings name the thing; the founder portrait is informative and
  keeps a localized `alt`. The atlas engraving is decorative texture.

## Components

Shared primitives in [`src/styles/components.css`](../../src/styles/components.css)
with `.on-paper` variants; brand components in `src/components/brand`.

| Component                        | Definition                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Pixel mark (`PixelMark`)         | cream stamp + ink pixel eight-point star; `tone="mono"` for currentColor-only use                             |
| Rushnyk rule (`Rushnyk`)         | thin two-tone embroidered rule, `currentColor`; variants `border` / `divider` / `wave`                        |
| Pixel display type (`PixelType`) | generated pixel-serif masks, one asset per locale + real text for assistive tech                              |
| Buttons                          | cream fill + ink text on ink sections; ink fill + cream text on cream via `.on-paper`; 1 px borders, radius 0 |
| Ghost buttons                    | 1 px `--line-strong` border; hover inverts to a filled stamp                                                  |
| Text link                        | Handjet uppercase with a 1 px underline that draws on hover/focus                                             |
| Tag / chip                       | uppercase Handjet, `--muted`, hairline optional                                                               |
| Panel                            | 1 px hairline on the local surface; no shadow, corner ticks only when it reads as an instrument               |
| Status dot                       | single paper/ink dot; no colour, no glow                                                                      |
| Hero band                        | full-bleed lunar dither with crop/coordinates read-outs and a pixel-serif headline                            |
| Case gallery                     | 2-up cream/ink case cards with dithered covers and one atmospheric full-bleed detail view                     |
| Portrait                         | cream-section portrait dither with the founder story                                                          |
| OG image / favicon / app icons   | generated from the same pixels and palette as the page                                                        |

## Motion

Slow and minimal, with the feel of an instrument settling. Titles and images may
reveal; pixels may twinkle; nothing bounces or glows.

| Motion               | Value                            | Where                       |
| -------------------- | -------------------------------- | --------------------------- |
| Reveal               | 800 ms, `--ease-out`, 18 px lift | sections and cards, once    |
| Colour/ink inversion | `--dur` 420 ms                   | buttons, links, ghost fills |
| Underline draw       | `--dur` 420 ms                   | `.link-underline`           |
| Arrow nudge          | `--dur` 420 ms                   | buttons                     |
| Rushnyk breathe      | 9 s opacity                      | optional rule `animated`    |
| Grain shift          | 8 s, `steps(6)`                  | fixed grain overlay         |

Rules: animate only `opacity`/`transform`; never animate colour, blur,
background images or layout. `prefers-reduced-motion: reduce` freezes every
non-essential animation and shows revealed content immediately. No cursor
hijacking, no parallax on text.

## Responsive behaviour

- The hero stacks copy and lunar band; the band keeps full bleed and crops via
  `object-fit: cover`.
- Cream sections and ink sections keep their surface identity on mobile; hairlines
  remain 1 px.
- 3-up grids collapse to 2-up and then 1-up; the case gallery becomes one column;
  the split masthead stacks.
- Pixel-serif masks scale as images; keep aspect ratio and max-width. Never let a
  mask shrink below its block size, or the serif becomes unreadable.
- Nothing essential may be hidden on mobile; only secondary read-outs and
  decorative labels may be dropped.

## Accessibility

- Contrast: all ink/paper text pairs pass AA (see table); never rely on alpha
  alone for essential text.
- Use `.sr-only` real text next to every pixel-type mask; masks are
  `aria-hidden`, the real heading text is in the accessibility tree.
- Decorative images get `alt=""`; informative images get localized alt text.
- Focus-visible is a 1 px `currentColor` outline with 4 px offset; never remove
  it.
- Reduced-motion and 200 % zoom are first-class test states; dithered images must
  not be used as text backgrounds.
- Images with attribution requirements must be credited (see
  [image-credits.md](image-credits.md)); CC BY-SA 4.0 also applies to the
  adapted dithered derivative.

## Do / Don't

**Do**

- Start from the two tokens; use `.on-paper` when moving from ink to cream.
- Use the pixel mark, the thin Rushnyk rule, Handjet and dithered imagery as one
  vocabulary.
- Give hero and section titles the pixel-serif treatment; keep body copy Handjet.
- Keep rules thin, corners sharp and empty space generous.
- Regenerate assets through the scripts, never hand-edit them.

**Don't**

- Don't introduce a third colour, not even a "muted blue-grey".
- Don't use gradients, glows, coloured shadows, rounded corners or glass.
- Don't combine the pixel mark with a smooth serif wordmark rendering; the
  wordmark is a pixel-type mask.
- Don't place a photograph in full colour or smooth grayscale; everything is
  1-bit.
- Don't stretch, blur or resample a dither.
- Don't use stock images that are not in the credit table.

## Source of truth and regeneration

| Concern                         | File                                                                 |
| ------------------------------- | -------------------------------------------------------------------- |
| Colour, type, spacing, motion   | [`src/styles/tokens.css`](../../src/styles/tokens.css)               |
| Reset, utilities, grain, reveal | [`src/styles/base.css`](../../src/styles/base.css)                   |
| Shared interface primitives     | [`src/styles/components.css`](../../src/styles/components.css)       |
| Web fonts                       | [`src/styles/fonts.css`](../../src/styles/fonts.css), `public/fonts` |
| Brand components                | [`src/components/brand`](../../src/components/brand)                 |
| Pixel display type              | `scripts/generate-pixel-type.py`, `src/content/pixel-type.json`      |
| Dithered imagery                | `scripts/generate-pixel-images.py`, `public/pixel`                   |
| Mark / favicon / app icons      | `scripts/generate-brand-assets.py`                                   |
| OG images                       | `scripts/generate-og.py`, `public/og`                                |
| Licences and credits            | [image-credits.md](image-credits.md)                                 |

The v1 constellation map, 16 × 16 icon set and ornament field are retired from
the v2 page; do not reintroduce v1 glow/accent ornament. Their files may remain
for reference until the cleanup task removes them.

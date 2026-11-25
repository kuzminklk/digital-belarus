# Ornament

Status: implemented (v2 — warm two-tone)
Owner: designer
Related: [visual language](visual-language.md) | [typography](typography.md) | [image credits](image-credits.md)

The v2 ornament is a two-ink pixel system: one stamp, one rule, and a family of
1-bit prints. There is no colour to decorate with, so the craft lives in the
pixel grid, the dither and the hairline.

## Motif sources

The vocabulary still comes from Belarusian rushnyk (ручнік — ritual towel) and
vyshyvanka (вышыванка — embroidered garment) cross-stitch geometry, now reduced
to the essentials that survive a two-tone system:

| Term (be)                            | Translation     | v2 use                                |
| ------------------------------------ | --------------- | ------------------------------------- |
| зорка (zorka)                        | star            | the eight-point star in the mark      |
| ромб (romb)                          | rhombus         | rule motifs, atlas geometry           |
| бясконцая лінія (bjaskoncaja linija) | endless line    | the `wave` rule                       |
| кручкі (kručki)                      | hooks           | the stair rhythm of the star and rule |
| ручнік (ručnik)                      | towel / rushnyk | name and grammar of the rules         |
| вышыванка (vyšyvanka)                | embroidery      | pixel-grid construction               |
| палатно (palatno)                    | linen           | the cream paper field                 |
| чырвоны (čyrvony)                    | red             | retired: v2 has no red thread         |

Symbolic readings vary by region; use the grammar, not specific ritual symbols.
No political, religious or state emblems. The Cellarius celestial atlas supplies
the archival-engraving counterpoint to the embroidery (see
[image-credits.md](image-credits.md)).

## Pixel construction rules

1. **Grid first.** Any new mark or rule is authored on a 16 × 16 module grid (or
   a 16-row strip for rules). One module is one `<rect>`.
2. **Integer geometry.** Coordinates are integers in the authoring grid;
   `shape-rendering="crispEdges"` is set on every ornament SVG.
3. **Two inks only.** Ink `#12100d` and cream `#ebe2d1`. No other colour, no
   gradient, no stroke that is not a filled module, no blur, no shadow.
4. **No curves.** Diagonals are stepped; circles do not exist in the ornament
   layer (they belong to imagery/engraving only).
5. **Even-grid centre.** A centred stroke ends in a 2 × 2 cluster; the mark's star
   is symmetric about both axes.
6. **Negative space is part of the pattern.** Do not fill the gaps that make a
   motif read as woven.
7. **Thread, not decoration.** Every motif must be constructible as interlaced
   stitch: rails, stepped diagonals, hooks, stitched dots.
8. **Tile seams.** Rule patterns repeat exactly at the tile boundary; the period
   divides the tile width. Never stretch a tile.
9. **Crisp at every scale.** Check at 1×, 1.5× and 2× DPR and at 16/24/32 px.
10. **One idea per surface.** A rule, a stamp or an engraving — not all three
    competing in one block.

## The mark

[`src/components/brand/PixelMark.tsx`](../../src/components/brand/PixelMark.tsx)
is a cream stamp holding the ink pixel eight-point rushnyk star. It is the same
square-star idea as the reference observatory identity, but the star is a
Belarusian cross-star built on a strict grid.

```text
................
.......##.......
..##...##...##..
..###..##..###..
...###.##.###...
....########....
.....######.....
.##############.
.##############.
.....######.....
....########....
...###.##.###...
..###..##..###..
..##...##...##..
.......##.......
................
```

Legend: `#` ink star module · `.` transparent (cream field in the `paper` tone).

| Tone              | Rendering                                   | Use                                              |
| ----------------- | ------------------------------------------- | ------------------------------------------------ |
| `paper` (default) | cream square + ink star                     | on ink surfaces: header, footer, 404, OG         |
| `red`             | legacy alias — same cream square + ink star | v1 API compatibility; the accent name is retired |
| `mono`            | no square, star in `currentColor`           | single-tone contexts: inline, print, lockups     |

- Sizes: 24 px minimum for the stamp; 16 px favicon works because the star fills
  14 of 16 modules. Used at 36 (header), 40 (footer), 64 (404), 4 × 64 (OG).
- The mark is decorative: `aria-hidden`, `focusable="false"`, no interaction.
- The square is a solid cream field, not a rounded app icon. Keep corners sharp.
- The same `STAR` grid is duplicated in
  [`scripts/generate-brand-assets.py`](../../scripts/generate-brand-assets.py)
  to produce `public/favicon.svg`, `public/icon.png` (512) and
  `public/apple-icon.png` (180), plus `public/brand/mark.svg` (512 px square
  source for social/print). Change the grid in the component and the generator
  together, then rerun the script.

### Derived assets

| Asset                   | Size       | Notes                                                     |
| ----------------------- | ---------- | --------------------------------------------------------- |
| `public/favicon.svg`    | 16 × 16    | cream tile + ink star, transparent-free, crisp in any tab |
| `public/icon.png`       | 512 × 512  | same mark at 32 px modules                                |
| `public/apple-icon.png` | 180 × 180  | 11 px modules, centred, cream margin                      |
| `public/brand/mark.svg` | 512 × 512  | square source, 28 px modules, for OG/print                |
| OG images               | 1200 × 630 | mark + pixel-serif title + lunar strip                    |

## The rules — Rushnyk v2

[`src/components/brand/Rushnyk.tsx`](../../src/components/brand/Rushnyk.tsx) is no
longer a decorative band: it is a **thin two-tone embroidered rule**. The SVG is
painted in `currentColor`, so one component works on both surfaces — cream on
ink, ink on cream.

| Variant   | Tile    | Construction                                                                                      | Height guide |
| --------- | ------- | ------------------------------------------------------------------------------------------------- | ------------ |
| `border`  | 48 × 16 | two hairline rails (rows 2 and 13) with a chain of woven rhombi (radius 2) and single stitch dots | 24–48 px     |
| `divider` | 64 × 16 | one central hairline interrupted by a large woven rhombus, flanked by two small diamonds          | 20–40 px     |
| `wave`    | 64 × 16 | one stepped endless-line thread, two modules of amplitude, period 16                              | 20–40 px     |

Props: `variant` (default `border`), `tone` (default `muted`), `height`
(default 24), `animated`, `className`. Scale is `height / 16`, so heights that are
multiples of 16 give integer modules; other heights still render hard edges via
`crispEdges` but should be checked at DPR 1.5.

Tones in v2:

| Tone    | Rendering                     | Use                             |
| ------- | ----------------------------- | ------------------------------- |
| `paper` | `currentColor`, full strength | primary rules on either surface |
| `red`   | legacy alias of `paper`       | no accent colour exists in v2   |
| `muted` | `currentColor` at 55%         | quiet rules between sections    |

The component is decorative: `role="presentation"`, `aria-hidden="true"`,
`focusable="false"`, `pointer-events: none`. `animated` adds a slow opacity
breath (9 s) that is disabled under `prefers-reduced-motion`.

```tsx
// Ink section
<Rushnyk variant="divider" tone="muted" height={24} />

// Cream section: inherits ink colour, so the same rule prints ink-on-cream
<section className="on-paper">
  <Rushnyk variant="wave" tone="muted" height={20} />
</section>
```

## The prints — dithered imagery as ornament

The main visual ornament of v2 is the 1-bit dither. Photographs and engravings
are not decoration bolted onto the system: they are printed with the same two
inks and the same square pixels as the mark.

### Pipeline

`scripts/generate-pixel-images.py`:

```
crop → grayscale → autocontrast → optional levels stretch
→ resize to grid → optional blur → gamma search to target ink coverage
→ Floyd–Steinberg 1-bit dither → ink/cream palette → nearest upscale ×2–4
```

Output is a PNG colour-mapped to exactly the two inks, so it composites
seamlessly on the section surface. Dither density is tuned per asset (never by
eye in a graphics editor):

| Asset                                      | Role                                            | Grid × upscale              | Ink coverage |
| ------------------------------------------ | ----------------------------------------------- | --------------------------- | ------------ |
| `hero-lunar.png` / `hero-lunar-mobile.png` | hero band (cream-on-ink)                        | 500 × 140 ×4 / 250 × 225 ×4 | 50%          |
| `atlas.png` / `atlas-square.png`           | cream-section archival engraving (ink-on-cream) | 533 × 367 ×3 / 333 × 333 ×3 | 30% / 28%    |
| `portrait.png`                             | founder portrait on cream (ink print)           | 300 × 300 ×3                | 42%          |
| `portrait-inverted.png`                    | founder portrait on ink (cream print)           | 300 × 300 ×3                | 58%          |
| `case-yasna.png`                           | case cover, forest (cream-on-ink)               | 400 × 300 ×3                | 70%          |
| `case-central-park.png`                    | case cover, café (cream-on-ink)                 | 400 × 300 ×3                | 62%          |
| `case-spadchyna.png`                       | case cover, ceramics (cream-on-ink)             | 400 × 300 ×3                | 70%          |
| `case-prabot.png`                          | pixel-art Telegram UI (drawn)                   | 600 × 450 modules ×2        | —            |

Rules:

- **One treatment per surface.** Ink sections get cream-on-ink prints; cream
  sections get ink-on-cream engravings. Never mix both tones in one image.
- **Dither is not a filter to apply in CSS.** It is baked at generation time;
  never blur, recolour or stretch the output.
- **High coverage for atmosphere, low coverage for legibility.** Cream-on-ink
  photos keep 50–70% ink so cream highlights read as light; ink-on-cream
  engravings stay around 30% ink so they can sit behind content without becoming
  a text background.
- **No text on busy dither.** Put captions on a solid ink or cream band.
- **Integer pixel scale only.** Upscale ×2–4 with nearest neighbour; no fractional
  resizing. The asset's pixel grid is visible and intentional.
- **Credits travel with the image.** See [image-credits.md](image-credits.md);
  CC BY-SA derivatives must carry attribution on the site.

### Pixel-art UI (PraBot)

`case-prabot.png` is drawn from scratch in 1:1 modules: frame, header rule,
cream avatar stamp with the ink star, filled user bubble (ink text on cream),
outlined bot bubbles (cream text on ink), outlined action buttons, composer and
a cream send stamp. Text is set in Handjet at module sizes ≥ 10 logical px, then
the whole canvas is upscaled ×2. It is a "product screenshot" that cannot be
confused with a stock UI kit: it uses the brand grid and only the two inks.

### Pixel display type

Headings are build-time pixel-serif masks (`PixelType` + `public/type/`), not
webfont serif. That is typography, but it is also ornament: the letterforms are
constructed on the same block grid as the mark. See [typography.md](typography.md).

## Accessibility and motion

- Ornament never carries information: the mark, rules, atlas and hero band are
  `aria-hidden` / `alt=""`; case covers are decorative because the case names are
  real text; the portrait keeps a localized `alt`.
- Rules are `<svg role="presentation" aria-hidden="true" focusable="false">` and
  cannot receive focus.
- No flashing: the only loops are a 9 s opacity breath on rules and the global
  grain animation, both disabled under `prefers-reduced-motion: reduce`.
- Dithered images are not used behind long body copy; the two-tone contrast table
  in [visual-language.md](visual-language.md) governs text surfaces.
- If the pixel font or masks fail to load, real text remains (`.sr-only` text in
  `PixelType`, Handjet fallback stack). Ornament itself never blocks reading.

## Do / Don't

**Do**

- Reuse the 16-module grid and the four motif families.
- Keep the star asymmetrically simple: cross + stepped diagonals.
- Use `currentColor` rules so cream/ink inversion is automatic.
- Let one large dither be the ornament of a section; keep the rest quiet.

**Don't**

- Don't add a third tone, gradient, glow or rounded shape.
- Don't use the stamp on a busy photograph; it needs a flat field.
- Don't create "icons" by colouring the star; use Handjet or the mark.
- Don't add decorative borders back around cards with shadows — use one hairline.
- Don't hand-edit generated PNGs; change the script and rerun it.

## QA checklist

- [ ] Mark reads at 16 px favicon and 24 px navigation.
- [ ] Rule variants are seamless at 1×/1.5×/2× and in all three locales.
- [ ] Rules render cream on ink and ink on cream correctly (currentColor).
- [ ] Dithered assets are two-colour only (no stray palette entries).
- [ ] Hero/atlas/portrait/cases look right at rendered size, not just 100% zoom.
- [ ] No text sits on a busy dither.
- [ ] Attribution present for CC BY-SA assets.
- [ ] Reduced motion: no breathing rule, no grain shift.
- [ ] No ornament reaches assistive technology.

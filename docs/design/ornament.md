# Ornament

Status: implemented
Owner: designer
Related: [visual language](visual-language.md) | [typography](typography.md) | [decision 0004](../decisions/0004-pixel-ornament-system.md) | [brief](brief.md)

A modern Belarusian star chart, embroidered in pixels. The ornament is one
continuous system: the same rhombus, eight-point star, endless line and hook
appear in the logo mark, the rushnyk strips, the icon set, the hero map and the
background fields. Nothing is pasted on; each piece is a different scale of the
same grid.

## Motif sources

The visual vocabulary comes from Belarusian rushnyk (ручнік — ritual towel) and
vyshyvanka (вышыванка — embroidered garment) cross-stitch geometry. Traditional
motifs are red thread on white linen, built from square stitches on a countable
grid — which is exactly a pixel grid. We keep the geometry and re-colour it for
the dark observatory palette: warm paper thread (`--paper`), a red core
(`--red`), and rarely aurora (`--aurora`) for seeds.

| Term (be)                            | Translation  | Geometry in the system                                         |
| ------------------------------------ | ------------ | -------------------------------------------------------------- |
| зорка (zorka)                        | star         | Eight-point star with a rhombus centre; logo core, border star |
| ромб (romb)                          | rhombus      | Nested diamond frame; mark, divider, wave diamonds             |
| крыж (kryž)                          | cross        | Cardinal stitch ticks; border edges, icon pixels               |
| дрэва жыцця (dreva žyccia)           | tree of life | Hooked bracket that grows from the corner; ornament field      |
| бясконцая лінія (bjaskoncaja linija) | endless line | Continuous stitched hairline along rushnyk edges               |
| хваля (chvalja)                      | wave         | Stepped meander; wave strip                                    |
| кручкі (kručki)                      | hooks        | One-module hooks that turn a line back on itself               |
| палатно (palatno)                    | linen cloth  | The dark ink field the pixels sit on                           |
| чырвоны (čyrvony)                    | red          | Signal thread: mark core, red tone, Minsk reticle              |

Symbolic readings (sun, field, continuity, fertility) vary by region and era.
Treat them as source material, not as claims: the system uses the _grammar_ of
Belarusian ornament, not a specific ritual symbol. Do not add political,
religious or state emblems.

Additional reference: the country outline in
[`src/content/belarus-outline.ts`](../../src/content/belarus-outline.ts) is a
simplified Natural Earth 1:110m boundary (public domain), used only as
constellation geometry — it is approximate and not for geographic use.

## Pixel construction rules

These rules are enforced by review, not only by taste:

1. **Grid first.** Every ornament is authored on a 16 × 16 module grid, or a
   16-row strip (32 × 16, 48 × 16, 64 × 16), or a 32 × 32 corner grid. One module
   is one `<rect>`.
2. **Integer geometry.** In the authoring grid all coordinates are integers. The
   renderer may scale by an integer factor; `shape-rendering="crispEdges"` is set
   on every ornament SVG. No antialiased curves, no strokes inside motifs, no
   gradients, no filters, no blur, no drop shadows.
3. **One module minimum.** Nothing is thinner than one module. No half-pixel
   offsets, no `0.5` positions, no fractional cell widths in the authoring grid.
4. **Symmetry.** The mark, stars, diamonds and corner motifs are symmetric about
   both axes (corner motifs are mirrored across the section, not rotated).
5. **Negative space is part of the motif.** The dark gap between a red core and
   its paper frame is one whole module. Keep it; do not close it.
6. **Even-grid centres.** Because the grids are even, a "centre pixel" is a 2 × 2
   cluster: red cores in the mark are 4–12 modules, stars sit on a 2-module
   centre. Odd centre points are never faked with offsets.
7. **Red is a core, not a wash.** Red fills the centre cluster or an entire tonal
   variant; it never outlines a paper motif and never mixes with aurora in one
   motif.
8. **Weave, don't decorate.** Each motif should be constructible as interlaced
   thread: dashed stitch edges, stepped diagonals, hooks. Avoid random sparkle.
9. **Tile seams.** Strip patterns must repeat exactly at the tile boundary
   (period divides the tile width). Never stretch or squash a tile.
10. **Crisp at 1×/1.5×/2×.** Check the rendering at device pixel ratios 1, 1.5
    and 2. At fractional render scales `crispEdges` snaps edges; prefer heights
    that produce integer module sizes (see Rushnyk below).

## Tones

| Tone    | Body      | Centre / accent            | When                                          |
| ------- | --------- | -------------------------- | --------------------------------------------- |
| `paper` | `--paper` | `--red`                    | default on dark surfaces                      |
| `red`   | `--red`   | `--paper-warm` / `--paper` | one accent moment; stamp, footer mark on dark |
| `muted` | `--muted` | — (monochrome)             | dividers, watermark, background strips        |

`mono` (icons only) means `currentColor` for every pixel — use for single-colour
contexts, print, or when a parent already owns the colour.

Rules: one dominant accent per view. Never place red on aurora or aurora on red.
Never use all three tones in one motif cluster.

## The system

### 1. PixelMark — 16 × 16 mark

Rendered by [`src/components/brand/PixelMark.tsx`](../../src/components/brand/PixelMark.tsx).
The outer diamond is a double stitched ring with four bridged cardinal points;
the centre is a red pixel cluster; aurora seeds sit in the four corners.

```text
................
.......PP.......
..A...PPPP...A..
.....PP..PP.....
....PP.PP.PP....
...PP..PP..PP...
..PP...RR...PP..
.PP.PPRRRRPP.PP.
.PP.PPRRRRPP.PP.
..PP...RR...PP..
...PP..PP..PP...
....PP.PP.PP....
.....PP..PP.....
..A...PPPP...A..
.......PP.......
................
```

Legend: `P` paper weave · `R` signal-red core · `A` aurora corner seed ·
`.` transparent.

- Props: `size` (default 32), `tone` (default `red`), `className`.
- Default tone `red` = paper lattice + red core + aurora seeds. `paper` swaps the
  aurora seeds for `--paper-dim`. `mono` maps everything to `currentColor`.
- Working sizes: 16 (favicon), 24, 32 (header), 40 (footer), 56 (Studio
  watermark), 64 (not found). Range 16–96. Never add interior detail below 16.
- The mark is `aria-hidden` and has no interactive behaviour.
- The same grid is duplicated in
  [`scripts/generate-brand-assets.py`](../../scripts/generate-brand-assets.py)
  to produce `public/favicon.svg`, `public/icon.png` (512) and
  `public/apple-icon.png` (180) so the browser tab, app icon and page share one
  identity. `public/brand/mark.svg` is the 512 px dark square source
  (28 px modules, 32 px safe margin) for OG/social use.
- If the grid changes, update the component **and** the generator, then re-run
  `python3 scripts/generate-brand-assets.py`. Do not hand-edit the generated
  files.

### 2. Rushnyk — seamless ornament strips

Rendered by [`src/components/brand/Rushnyk.tsx`](../../src/components/brand/Rushnyk.tsx)
as an SVG `<pattern>`, so it stretches to any container width while cells stay
on their own grid.

| Variant   | Tile (modules) | Construction                                                                                                                       | Used on                          |
| --------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `border`  | 48 × 16        | Endless stitched lines along rows 1 and 14; eight-point star (radius 4) between two nested rhombi (radius 3 + 1) with stitch ticks | footer band, section edges       |
| `divider` | 64 × 16        | One hairline at row 8 interrupted by an eight-point star (radius 5)                                                                | between sections (e.g. Approach) |
| `wave`    | 64 × 16        | Two-module stepped meander between rows 4 and 12 with four small rhombi (radius 2)                                                 | privacy page, quiet bands        |

- Props: `variant` (default `border`), `tone` (default `muted`), `height`
  (default 24), `animated` (default false), `className`.
- Scale: `scale = height / 16`; pattern width = tile width × scale. The component
  fills 100% of the parent width and exposes `role="presentation"`,
  `aria-hidden="true"`, `focusable="false"`.
- Recommended heights: **16, 32, 48, 64** give integer module sizes. Common
  values 18–24 (1.125–1.5 px modules) still render hard edges thanks to
  `crispEdges`, but individual cells may rasterise unevenly; verify at DPR 1.5
  before using an arbitrary height. Minimum usable height is 16.
- `animated` adds a slow whole-strip opacity breath (0.55 ↔ 0.95 over 9 s). It is
  off by default, used sparingly, and disabled under
  `prefers-reduced-motion: reduce`. There is no per-cell twinkle: a strip is a
  band, not a light show.
- The strip is decorative. Never put essential meaning into the number of stars
  or the pattern rhythm.

### 3. PixelIcon — 16 × 16 icon set

Rendered by [`src/components/brand/PixelIcon.tsx`](../../src/components/brand/PixelIcon.tsx)
from integer rect grids in `currentColor`.

| Name         | Depicts                            | Where used          |
| ------------ | ---------------------------------- | ------------------- |
| `site`       | browser window with content blocks | services            |
| `bot`        | robot head with antenna and eyes   | services            |
| `ai`         | circuit chip with a spark          | services            |
| `automation` | cog wheel                          | services            |
| `cart`       | shopping cart                      | services            |
| `crm`        | contact card (avatar + lines)      | services            |
| `analytics`  | bar chart                          | services            |
| `compass`    | compass rose                       | instrument accents  |
| `code`       | angle brackets                     | services            |
| `shield`     | shield with check                  | trust notes         |
| `spark`      | eight-point star                   | accents, status     |
| `clock`      | clock face                         | process, calculator |
| `pin`        | map pin                            | contacts            |
| `mail`       | envelope                           | contacts            |
| `telegram`   | paper plane                        | contacts            |
| `github`     | cat head silhouette                | footer/social       |
| `arrow`      | right arrow                        | CTAs                |
| `close`      | cross                              | dialogs             |
| `menu`       | three bars                         | mobile menu         |

- Props: `name`, `size` (default 18), `className`, `title`.
- Without `title`: `aria-hidden="true"`, `role` omitted, not focusable — the
  icon is decoration next to visible text.
- With `title`: `role="img"`, `aria-label={title}`, `<title>` element — use only
  when the icon is the only label (e.g. an icon-only link).
- Style: one-module strokes or solid silhouettes, open counters, no curves.
  Icons are designed at 16 × 16 and remain legible at 14 px; the UI uses 14, 16,
  18 and 22 px. Do not apply stroke widths, rotations or colour other than
  `currentColor`.

### 4. ConstellationMap — the hero instrument

Rendered by [`src/components/brand/ConstellationMap.tsx`](../../src/components/brand/ConstellationMap.tsx).
The signature visual: Belarus drawn as a constellation inside an observatory
instrument. Details in [decision 0005](../decisions/0005-belarus-constellation-hero.md).

- Props: `className`, `intensity` (`subtle` default, `vivid` on the hero).
- Projection: equirectangular lon/lat, uniformly fitted into a 640 × 640 viewBox
  with 56 px padding (country ≈ 528 × 270 units, centred, north up). The outline
  is read from `BELARUS_OUTLINE`; Minsk and neighbours from the same module.
- Constellation: all 44 outline vertices become pixel stars — 1 px stars plus
  faint cardinal glints, every sixth vertex a 5 px plus — connected by a 1 px
  paper-dim line (42% opacity subtle / 62% vivid). Three dashed sightlines link
  Minsk to selected border vertices.
- Starfield: deterministic seeded PRNG (`mulberry32`, seed `0x5eed1a`), 140 stars
  (68 in subtle), 1–2 px, 16–76% opacity, one third twinkle. Stars are excluded
  inside the country (plus a 10-unit margin), inside the orbit band and around
  Minsk, so the constellation and reticle stay readable.
- Instrument: graduated orbit ring `r = 288` with 72 ticks (5° spacing, longer
  every 30°, cardinal every 90°), 000/090/180/270 labels in vivid; a dashed orbit
  at `r = 250` rotating once per 180 s with a red marker; viewfinder corners;
  100 km scale bar; north arrow. The Hero supplies the top HUD read-outs, so the
  map itself only keeps the bottom scale/north instruments.
- Minsk: crosshair plus 3 × 3 red core, two offset pulsing rings (5.2 s), leader
  line and the label `MINSK` / `53.90°N 27.56°E` in JetBrains Mono (10/9 px in
  viewBox units — never below 9 px).
- Neighbours: `LT`, `LV`, `RU`, `UA`, `PL` projected and pushed 32 units outward
  from the country centroid, clamped inside the canvas.
- Motion: 38 s Lissajous drift of the sky/instrument layers; pointer parallax on
  fine pointers only, capped at 6 px and eased (`--cm-px`, `--cm-py` CSS vars,
  no React re-renders). Layers move at 0.35 (far), 0.75 (instruments) and 0.15
  (constellation) depth. Coarse pointers get a static sky; `prefers-reduced-motion`
  freezes drift, spin, twinkle and pulse, and flattens the reticle pulses.
- Decorative: `role="presentation"`, `aria-hidden="true"`, `focusable="false"`.
  The readable map caption lives in HTML next to it (Hero caption).
- No filters, no glow sprites, no external image. One radial vignette gradient is
  used only to darken the chart edge, behind all content.

### 5. OrnamentField — background texture

Rendered by [`src/components/brand/OrnamentField.tsx`](../../src/components/brand/OrnamentField.tsx):
an `position: absolute; inset: 0` layer that is never interactive and never
announces itself. Parent sections need `position: relative`; content should sit
above it (`.container`/panel content, or `z-index: 1`).

| Variant             | Construction                                                                                                                                                                                               | Contrast               | Use                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------- |
| `corners` (default) | Four mirrored 32 × 32 module corner brackets: anchor square, dashed stitch edges (period 6), inner hooked bracket, two woven diagonals, a rushnyk star, loose stitch ticks. Size `clamp(88px, 9vw, 136px)` | `opacity: 0.07` paper  | section corners, panels, footer             |
| `tile`              | Seamless 64 × 64 px tile: diamond lattice (`(x+y) % 8`, `(x−y) % 8`) plus a central rhombus, 4 px modules                                                                                                  | `opacity: 0.045` paper | full-bleed dark bands, contact/footer areas |

- Props: `variant`, `className`.
- Static by design: no animation to disable, nothing to respect beyond the fact
  that it is decoration.
- The tile `<pattern>` uses the static id `ornament-field-tile`. Keep one tile
  instance per page (or accept identical shared paint); do not place it inside a
  transformed or `display: none` ancestor in a way that breaks the pattern.
- Use it in one or two quiet sections, never behind dense text blocks, never
  inside small interactive controls, never on light surfaces.

## Usage recipes

```tsx
import PixelMark from '@/components/brand/PixelMark';
import Rushnyk from '@/components/brand/Rushnyk';
import PixelIcon from '@/components/brand/PixelIcon';
import ConstellationMap from '@/components/brand/ConstellationMap';
import OrnamentField from '@/components/brand/OrnamentField';

// Header lock-up
<PixelMark size={32} tone="red" />

// Section edge / footer band
<Rushnyk variant="border" tone="muted" height={22} />

// Divider between sections, centred star, animated breath
<div className={styles.rule}>
  <Rushnyk variant="divider" tone="muted" height={20} animated />
</div>

// Service card
<PixelIcon name="telegram" size={22} />

// Icon-only link (accessible)
<a href={site.telegram} aria-label="Telegram"><PixelIcon name="telegram" title="Telegram" /></a>

// Hero instrument
<ConstellationMap intensity="vivid" className={styles.map} />

// Quiet section background
<section className={styles.section}>
  <OrnamentField variant="corners" />
  <div className="container">{/* content */}</div>
</section>
```

Rushnyk is full-width by nature; place it inside a container that already spans
the section or full-bleed band. Do not set a width on the SVG itself. The
`className` prop is for layout only (margins, absolute positioning), not colour.

## Accessibility

- All ornament is decorative: `aria-hidden="true"` on the SVG or on the wrapping
  layer, `focusable="false"`, no `tabindex`, no click handlers.
- Ornament never carries information. Coordinates, section indices, service
  names and statuses always exist as real text elsewhere.
- Map labels are part of the decorative SVG; the readable caption is HTML
  (`mapCaption`) and the hero heading carries the meaning.
- Low-contrast fields are painted at 4.5–7% opacity and can never obscure text;
  do not raise the opacity to "make it visible".
- Motion: orbit 180 s, twinkle 7.6 s, reticle pulse 5.2 s, strip breath 9 s — all
  far below the 3 flashes/second photosensitivity threshold, and all disabled
  under `prefers-reduced-motion: reduce`. Pointer parallax is disabled for
  coarse pointers.
- Do not place ornament behind justified text or inside form fields; the only
  legibility risk is interference with reading, not contrast.
- At 200% zoom the ornament keeps its grid and simply occupies more space; the
  SVG never crops essential content.

## Do / Don't

**Do**

- Reuse the module grid and the four motif families for any new ornament.
- Keep red for a core or a single tonal variant.
- Check strips at 1×, 1.5× and 2× and at 16 px favicon scale.
- Keep ornament behind content and out of the reading path.
- Update this document when a motif, tone or tile changes.

**Don't**

- Don't import stock embroidery, icon libraries or external images.
- Don't add curves, strokes, gradients, shadows, blur or glow inside motifs.
- Don't stretch a tile or render it below a 1 px module.
- Don't add a third accent colour to a motif.
- Don't animate more than opacity/transform, and never loop a "wait for me"
  pulse that could distract from reading.
- Don't duplicate the mark by hand — one grid, generated assets.

## QA checklist

- [ ] Mark legible at 16 px in the browser tab; favicon matches the mark.
- [ ] Strips are seamless at 1×/1.5×/2× and in `ru`/`be`/`en` content widths.
- [ ] Icons render in `currentColor` and keep their counters at 14 px.
- [ ] Hero map is crisp at 360/768/1440 px, labels ≥ 9 viewBox px, no overlap
      with the HUD, no text collision with the Minsk label.
- [ ] Reduced motion: no orbit spin, twinkle, pulse or parallax.
- [ ] Ornament fields do not touch or obscure text at any breakpoint.
- [ ] No ornament reaches assistive technology (axe/SR check).

# Visual language

Status: implemented
Owner: designer
Related: [ornament](ornament.md) | [typography](typography.md) | [brief](brief.md) | [spec](../specs/visual-language.md) | [tokens](../../src/styles/tokens.css)

> A modern Belarusian star chart, embroidered in pixels.

The site is an observatory for Belarusian business. The internet is a night sky,
a business is a point of light, and a website is the instrument that finds it.
The design borrows the _language_ of an observatory — star charts, coordinate
labels, orbit ticks, hairline grids, instrument read-outs — and fuses it with
Belarusian weaving. It must feel nocturnal, precise and quietly confident, never
"space themed", never sci-fi, never a template.

## Three pillars

1. **Instrument, not decoration.** Every flourish earns its place by behaving
   like a measuring device: ticks, coordinate prefixes, figure numbers, scale
   bars, reticles. Hairlines, monospaced read-outs and viewfinder corners carry
   the precision; the display serif carries the confidence.
2. **Belarusian weave in pixels.** Rhombi, eight-point stars, endless lines and
   hooks from rushnyk embroidery are rebuilt on a strict integer grid. Red is
   thread, not paint. Ornament is a system (mark → strips → icons → map → field),
   not a border.
3. **Nocturnal restraint.** Near-black surfaces, warm paper type, one dominant
   accent per view, lots of air. Shadows are rare, glows are faint, corners are
   sharp. Motion is slow and mechanical.

## Palette

[`src/styles/tokens.css`](../../src/styles/tokens.css) is the single source of
truth. Components consume tokens via `var()`; no hex values in CSS Modules.

### Ink and paper

| Token            | Hex       | Role                           | Contrast on `--ink-950` |
| ---------------- | --------- | ------------------------------ | ----------------------- |
| `--ink-1000`     | `#030507` | vignette depths, page extremes | —                       |
| `--ink-950`      | `#05080b` | page background                | —                       |
| `--ink-900`      | `#070b10` | section background             | —                       |
| `--ink-850`      | `#0a0f15` | raised panels, header          | —                       |
| `--ink-800`      | `#0d141b` | image wells, inset areas       | —                       |
| `--ink-750`      | `#111a22` | card surfaces, inputs          | —                       |
| `--ink-700`      | `#15212b` | hairlines on dark, dividers    | —                       |
| `--ink-600`      | `#1c2b36` | scrollbar, strongest dark line | —                       |
| `--paper`        | `#ece9df` | primary text                   | 16.53:1                 |
| `--paper-warm`   | `#f5f1e6` | display accents, hover text    | 17.79:1                 |
| `--paper-dim`    | `#c7c3b7` | secondary text, intros         | 11.39:1                 |
| `--muted`        | `#8d9aa5` | metadata, labels, captions     | 6.98:1                  |
| `--muted-strong` | `#b6c0c8` | secondary metadata             | 10.86:1                 |

### Accents

| Token          | Hex       | Role                                                | Contrast on `--ink-950` |
| -------------- | --------- | --------------------------------------------------- | ----------------------- |
| `--red`        | `#e2453a` | primary accent: CTAs, signal dots, mark core, error | 4.92:1                  |
| `--red-bright` | `#ff6a58` | hover, link accents, focus outline                  | 7.13:1                  |
| `--red-deep`   | `#a52620` | only on paper/light contexts                        | 2.77:1                  |
| `--aurora`     | `#8fe3b0` | live/system states, "available", success            | 13.18:1                 |
| `--teal`       | `#6fd8c4` | secondary live highlight                            | 11.75:1                 |
| `--gold`       | `#c9a86a` | rare warm note (awards, one-off)                    | 8.88:1                  |

### Lines and effects

| Token            | Value                                | Role                             |
| ---------------- | ------------------------------------ | -------------------------------- |
| `--line`         | `rgb(236 233 223 / 12%)`             | default hairline                 |
| `--line-strong`  | `rgb(236 233 223 / 26%)`             | interactive borders, focus rails |
| `--line-faint`   | `rgb(236 233 223 / 7%)`              | chart rings, background grid     |
| `--glow-red`     | red ring + soft red halo             | primary CTA, signal moments only |
| `--glow-aurora`  | soft aurora halo                     | live status only                 |
| `--shadow-panel` | `0 24px 80px -40px rgb(0 0 0 / 90%)` | large floating panels            |

### Colour rules

- **One dominant accent per view.** Red is for action and signal; when a section
  uses red it should not compete with aurora.
- **Aurora is a state, not a decoration.** Status dot, success message, "online".
- **Gold is rare.** If two sections use it, one is wrong.
- **Red on aurora / aurora on red is forbidden.** Red text is for short accents
  only (`--red` passes AA at 4.92:1 but reads loud in paragraphs); body text is
  paper/paper-dim/muted.
- Decorative ornament uses paper/red/muted only; never all three at once.
- No light theme is planned. If a light surface is ever needed, use `--red-deep`
  and ink text, and extend the tokens instead of hard-coding colours.

## Typography in one screen

| Role                | Family             | Token                               | Notes                               |
| ------------------- | ------------------ | ----------------------------------- | ----------------------------------- |
| Display / `h1`–`h3` | Cormorant Garamond | `--fs-display`, `--fs-h1`–`--fs-h3` | 300–700; italic for one accent word |
| Body / leads        | Manrope            | `--fs-body`, `--fs-lead`            | Cyrillic-native; 400–800            |
| Technical labels    | JetBrains Mono     | `--fs-mono`, `--fs-micro`           | uppercase, 0.12–0.18em tracking     |
| Utility             | Manrope            | `--fs-small`                        | captions, form hints                |

Full scale, licences, subsets and locale notes: [typography.md](typography.md).

## Grid and layout

- **Container.** `--container: 1480px`, narrow variant `1080px` for prose-heavy
  blocks (privacy). Both centred with fluid gutters
  `--gutter: clamp(1.25rem, 3.6vw, 4rem)`.
- **Column model.** A 12-column mental grid; implementations use proportional
  `minmax(0, …)` fractions rather than 12 explicit tracks. Recurring splits:
  hero `1.12 / 0.88` (≈ 7 / 5), masthead `1.25 / 0.75`, studio `0.92 / 1.08`,
  cards 3-up (services, pricing), editorial 2-up (cases, why).
- **Vertical rhythm.** `--section-y: clamp(5rem, 9vw, 9.5rem)` between sections;
  `.section--tight` for compact bands. Sections are separated by full-width
  1 px hairlines and generous air rather than heavy panels.
- **Header.** `--header-h: 4.5rem`; sticky, hairline bottom, background shifts
  to raised ink + blur after scroll.
- **Breakpoints.** Content-driven, in this order: **1120** (header switches to
  compact/mobile navigation), **1080** (hero and major split grids stack),
  **900** (2-up → 1-up), **640** (compact type, tighter gutters, mobile menu),
  **420** (fine mobile tuning). Use the existing breakpoints; do not add new ones
  for one-off layouts.
- **Asymmetry and bleed.** Elements sit on the grid, but a few oversized marks
  are allowed to break it: full-bleed rushnyk strips, the marquee, the Studio
  watermark mark, and the constellation map, which may run to the section edge.
  Bleed is a compositional tool, not an excuse for misalignment elsewhere.
- **Corners and lines.** Radius is 0–2 px (buttons 1 px). Borders are 1 px
  hairlines (`--line`); interactive borders use `--line-strong`. Corner ticks and
  viewfinder brackets are allowed around photographic panels, instruments and
  the map.

## Surfaces and depth

The page is mostly flat, dark and matte. Depth comes from light, not shadows:

1. **Ink layering.** Page `--ink-950`; sections `--ink-900`; raised surfaces
   `--ink-850`; cards/inputs `--ink-750`. Adjacent layers differ by 2–4% lightness
   only.
2. **Hairline lattice.** Card grids use 1 px gaps over a `--line` background
   (see Services), so the grid reads as a technical drawing rather than floating
   cards.
3. **Panel primitive.** `.panel` = 1 px `--line` border, `--ink-900` background,
   a faint top-left white sheen, and 7 px corner ticks. Use it for forms,
   calculator results and success messages, not for every block.
4. **Accent washes.** Large soft radial gradients at 3–9% opacity tint sections
   (aurora top-left in Services, red top-right in Studio, red/aurora pair behind
   the hero map). They must never touch text.
5. **Film grain.** One fixed `.grain` overlay at 3.5% opacity, animated in steps,
   disabled under reduced motion. It is the only texture on the whole page.
6. **Shadows.** Only `--shadow-panel` for large floating panels (calculator,
   dialogs). No card drop shadows; no glows behind text; glows are reserved for
   buttons and signal states.
7. **No blur over content.** Blur is limited to the map's background glow and the
   scrolled header backdrop. Nothing that carries information is blurred.

## Components

Shared primitives live in [`src/styles/components.css`](../../src/styles/components.css),
layout in `src/components/layout`, sections in `src/components/sections`.
Section-specific styling stays in CSS Modules next to the component.

### Brand components

| Component          | Purpose                            | Doc                        |
| ------------------ | ---------------------------------- | -------------------------- |
| `PixelMark`        | logo mark, 16 × 16 axis            | [ornament.md](ornament.md) |
| `Rushnyk`          | seamless ornament strips           | [ornament.md](ornament.md) |
| `PixelIcon`        | 16 × 16 icon set                   | [ornament.md](ornament.md) |
| `ConstellationMap` | hero instrument / signature visual | [ornament.md](ornament.md) |
| `OrnamentField`    | low-contrast background texture    | [ornament.md](ornament.md) |

### Interface primitives

| Primitive        | Class / component                     | Rules                                                                                            |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Primary button   | `.btn .btn--primary`                  | red fill, paper-warm mono label, arrow icon; hover `--red-bright`                                |
| Ghost button     | `.btn .btn--ghost`                    | hairline border; hover paper border + 6% paper fill                                              |
| Small button     | `.btn--small`                         | 2.5rem min height; only in dense rows                                                            |
| Text link        | `.link-underline`                     | mono uppercase; underline draws left → right on hover/focus                                      |
| Tag              | `.tag`                                | hairline chip, mono micro, uppercase                                                             |
| Status dot       | `.status-dot`                         | aurora, slow halo pulse; only for real availability                                              |
| Panel            | `.panel`                              | bordered ink-900 surface + corner ticks                                                          |
| Field            | `.field` + `.input/.textarea/.select` | transparent, bottom hairline, focus turns red-bright                                             |
| Checkbox         | `.checkbox`                           | 1 px box, red fill + ink inset when checked                                                      |
| Error            | `.error`                              | `--red-bright`, small; always paired with `aria-invalid` + `role="alert"`                        |
| Section masthead | `SectionHeading`                      | mono index + rule + label, serif h2 with italic accent, optional intro; split or start alignment |
| Marquee          | `Marquee`                             | duplicated aria-hidden keywords, pixel star separators, slow linear loop                         |
| Reveal           | `Reveal`                              | 28 px lift + fade, 900 ms, once, IntersectionObserver                                            |

### Page composition

- **Header** — mark (32) + wordmark (Cormorant name, mono Latin/Minsk line),
  mono navigation, RU/BE/EN locale switch, primary CTA. Sharp, quiet, sticky.
- **Hero** — oversized display line with one red italic word, lead, two CTAs,
  three metrics (mono index, serif value, sans label), the constellation map with
  monospaced HUD, bottom working-hours note and scroll cue.
- **Marquee** — a thin band of service keywords as a night-sky ticker.
- **Approach** — numbered statements with a rushnyk divider; no cards, just
  hairlines and air.
- **Services** — 3 × 2 hairline grid; each cell has a pixel icon, serif title,
  body copy, arrow on hover, red top hairline that draws in.
- **Process** — numbered instrument steps, clock icon where timing is stated.
- **Cases** — 2-up editorial cards; case detail opens in a native dialog.
- **Pricing** — three plans on a hairline grid, tags for scope, one recommended
  plan; red only on the primary action.
- **Calculator** — panel with selects/fields, `aria-live` result read-out, clock
  icons; the only meaningful client-side logic outside the map.
- **Why** — large serif statements with small mono evidence.
- **Studio** — portrait treated as an instrument: grayscale/duotone, scanlines,
  viewfinder corners; oversized mark watermark (56 px) at low opacity.
- **FAQ** — native `details`/`summary` with mono indices; no icon-button hijack.
- **Contact** — panel-based form that composes a Telegram message in the browser;
  contact channels use PixelIcons.
- **Footer** — rushnyk border band at the top, four columns, mark (40),
  availability dot, legal row.
- **Privacy** — narrow prose container with a wave rushnyk band.
- **Not found** — the mark large on the centre line, one clear route home.

## Iconography

- 16 × 16 pixel grids in `currentColor`, one-module strokes, crisp edges,
  no curves, no rounded caps, no stroke scaling. Sizes 14/16/18/22 px.
- Icons always sit next to a visible label; when one is the only label, pass
  `title` to expose `role="img"`.
- Do not mix pixel icons with line icons from another family. The only other
  glyphs are the arrow chevron in `ArrowIcon` and the marquee star, both on the
  same grid.
- Empty states and list bullets use ornament (rhombus, star), not emoji.

## Imagery and graphics

- No stock photography, illustration libraries, icon libraries, CDNs or external
  images. The single photograph is the founder portrait in Studio, treated as an
  instrument image (grayscale → duotone, scanlines, corner brackets) and only
  ever inside its frame.
- All graphics are inline SVG or CSS. The OG image is generated by
  `scripts/generate-og.py`; favicons by `scripts/generate-brand-assets.py`.
- Charts/diagrams follow the same hairline language: paper lines on ink, mono
  labels, no chart junk, no gradients inside data marks.
- Pixel art must not be resampled: use integer modules and `crispEdges`.

## Motion

Slow, deliberate, mechanical. Instruments move with weight; nothing bounces.

| Motion              | Duration / easing                | Where                          |
| ------------------- | -------------------------------- | ------------------------------ |
| Reveal              | 900 ms, `--ease-out`, 28 px lift | section entrances, once        |
| Hover fill / border | `--dur` 420 ms, `--ease-out`     | buttons, cards, links          |
| Underline draw      | `--dur` 420 ms                   | `.link-underline`              |
| Button arrow nudge  | `--dur` 420 ms                   | `.btn:hover svg`               |
| Orbit rotation      | 180 s linear                     | constellation map dashed orbit |
| Map twinkle         | 7.6 s, discrete steps            | starfield (one third of stars) |
| Reticle pulse       | 5.2 s, two offset rings          | Minsk marker                   |
| Lissajous drift     | 38 s                             | map sky/instrument layers      |
| Status halo         | 2.6 s                            | availability dot               |
| Rushnyk breath      | 9 s                              | optional `animated` strip      |
| Marquee             | slow linear, CSS animation       | keyword ticker                 |
| Grain               | 8 s, `steps(6)`                  | fixed overlay                  |

Rules: animate only `opacity` and `transform`; never animate blur, shadows or
layout properties. No spring, bounce, overshoot, cursor hijacking or parallax on
text. Pointer parallax is cosmetic, capped at 6 px, and only for fine pointers.
Every non-essential animation is disabled under `prefers-reduced-motion: reduce`
(one shared policy in `base.css` + component media queries).

## States and interaction

- **Focus-visible:** 1 px `--red-bright` outline, 4 px offset, radius 1 px. Never
  remove it; interactive custom elements must keep a visible ring.
- **Hover:** subtle only — border brightens, a red 1 px line draws in, arrow
  nudges 2 px, background lifts one ink step. No scaling of text blocks.
- **Active/selected:** locale and calculator options use paper text + red marker;
  selected plan uses a red hairline and tag, not a filled card.
- **Disabled:** 50% opacity, no pointer events; never hide essential actions
  behind hover.
- **Error/success:** red-bright with `role="alert"`; aurora for success/status.
- **Loading:** text-based read-outs ("сигнал принят") rather than spinners where
  possible; no skeleton shimmer.

## Responsive behaviour

- Type is fluid via `clamp()`; the display headline is the hero of the mobile
  layout too (it wraps, never truncates).
- The hero stacks its text and map at 1080 px; the map keeps its square aspect
  and loses secondary HUD read-outs only where the Hero chooses to hide them.
  `ConstellationMap` also drops its own secondary read-outs in containers under
  460 px via a container query, keeping the Minsk label.
- 3-up grids become 2-up at ~1100 and 1-up at 640; 2-up editorial grids collapse
  at 900.
- Navigation collapses into a full-screen mobile menu at 1120 with focus trap,
  Escape to close and scroll lock.
- Nothing is hidden that carries meaning on mobile; secondary metadata may be
  dropped, actions and copy may not.

## Accessibility summary

- Contrast: paper/paper-dim/muted pairs pass AA on ink surfaces (see tables);
  red is used for short accents and actions, not paragraphs.
- One `h1` per page, ordered headings, semantic landmarks, skip link first.
- All decorative SVG (ornament, map, grain, marquee, status halo) is
  `aria-hidden`, `focusable="false"`, non-interactive.
- Keyboard: native controls, visible focus, dialogs and menu trap/restore focus,
  Escape closes overlays.
- Reduced motion and 200% zoom are first-class test states.
- Full acceptance criteria: [specs/accessibility.md](../specs/accessibility.md).

## Do / Don't

**Do**

- Build with tokens, hairlines, ink layering and air.
- Use one italic display accent and one dominant accent colour per view.
- Treat instrument details as content: real coordinates, real indices, real
  availability.
- Keep ornament decorative and behind the reading path.
- Compose shared primitives (`.btn`, `.panel`, `.tag`, `.mono`, `.container`)
  before writing new CSS.

**Don't**

- Don't use gradients, glow, blur or shadows as decoration; they signal state.
- Don't add rounded corners, soft cards, glassmorphism or neon.
- Don't use red and aurora together, or gold without a reason.
- Don't use stock photos, icon libraries, external fonts/CDNs or third-party
  widgets.
- Don't animate layout, text or the reading path; don't hijack the cursor.
- Don't duplicate brand artwork by hand — import the components.

## Source of truth

| Concern                                | File                                                           |
| -------------------------------------- | -------------------------------------------------------------- |
| Colour, type, spacing, motion tokens   | [`src/styles/tokens.css`](../../src/styles/tokens.css)         |
| Reset, utilities, grain, reveal policy | [`src/styles/base.css`](../../src/styles/base.css)             |
| Shared primitives                      | [`src/styles/components.css`](../../src/styles/components.css) |
| Fonts                                  | [`src/styles/fonts.css`](../../src/styles/fonts.css)           |
| Brand components                       | [`src/components/brand`](../../src/components/brand)           |
| Ornament rules                         | [ornament.md](ornament.md)                                     |
| Typography rules                       | [typography.md](typography.md)                                 |
| Behaviour specs                        | [`docs/specs`](../specs)                                       |
| Decisions                              | [`docs/decisions`](../decisions)                               |

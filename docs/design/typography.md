# Typography

Status: implemented (v2 — pixel type)
Owner: designer
Related: [visual language](visual-language.md) | [ornament](ornament.md) | [tokens](../../src/styles/tokens.css) | [fonts.css](../../src/styles/fonts.css)

The v2 type system has exactly two voices, and both are pixel-native:

1. **Handjet** — the living UI/body voice. A variable pixel mono, vendored as
   woff2 and used for every piece of running text, label, button and form.
2. **Pixel-serif masks** — the display voice. Cormorant Garamond is rendered at a
   tiny logical size, thresholded to hard pixels, upscaled and served as an
   alpha PNG mask; it is _never_ shipped as a smooth web font.

The v1 Manrope/JetBrains Mono stack is retired. No smooth serif, sans or mono is
rendered as UI text.

## Families

| Role               | Family                                   | Style                                   | Usage                                                                          |
| ------------------ | ---------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| UI / body / labels | **Handjet**                              | variable `wght 100–900`, normal         | paragraphs, navigation, buttons, forms, tags, rules labels, all interface copy |
| Display            | **Cormorant Garamond** (build-time only) | variable `wght 300–700`, roman + italic | pixel-serif heading masks, OG headline                                         |

Handjet’s pixel elements are part of the design: letters are built from square
strokes, so body text already carries the pixel-art texture at normal sizes.
Cormorant contributes only its serif skeleton, which the mask pipeline turns into
square pixels.

## Licences

Both families are licensed under the **SIL Open Font License, Version 1.1**.

| Family             | Upstream                                                                | Notes                                                                                       |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Handjet            | [Google Fonts — Handjet](https://fonts.google.com/specimen/Handjet)     | vendored woff2 in `public/fonts`, served to the browser                                     |
| Cormorant Garamond | [CatharsisFonts/Cormorant](https://github.com/CatharsisFonts/Cormorant) | build-time only, cached in `.cache/`, used by `generate-pixel-type.py` and `generate-og.py` |

Keep the OFL notices with any redistributed font files. If the Handjet or
Cormorant binaries are ever modified or subset again, follow the upstream
`OFL.txt` (including any reserved-name rules). Attribution is not required in
the UI.

## Handjet: files, subsets, coverage

Handjet is self-hosted in four subset files with explicit `unicode-range` in
[`src/styles/fonts.css`](../../src/styles/fonts.css):

| File                                        | Unicode range                                                           | Used for                          |
| ------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------- |
| `handjet-normal-cyrillic-100-900.woff2`     | U+0301, U+0400–045F, U+0490–0491, U+04B0–04B1, U+2116                   | Russian and Belarusian text       |
| `handjet-normal-cyrillic-ext-100-900.woff2` | U+0460–052F, U+1C80–1C8A, U+20B4, U+2DE0–2DFF, U+A640–A69F, U+FE2E–FE2F | extended Cyrillic                 |
| `handjet-normal-latin-100-900.woff2`        | U+0000–00FF, … U+2000–206F, …                                           | Latin text, numerals, punctuation |
| `handjet-normal-latin-ext-100-900.woff2`    | U+0100–02BA, …                                                          | extended Latin                    |

- `font-weight: 100 900` is a variable axis; the site uses ~400–600. Prefer the
  axis to faux bold.
- The four top-of-fold files (`cyrillic` + `latin`) are preloaded in the locale
  layout; the two extended subsets load on demand. Do not preload all four.
- **Belarusian coverage:** `ў` U+045E, `і` U+0456 and `ё` U+0451 are inside the
  `cyrillic` range, so `be` uses the same files as `ru`. The curly apostrophe
  `’` U+2019 is served by the `latin` general-punctuation range.
- Do not use Ukrainian-only letter styling for Belarusian. Do not use Latin
  transliteration (Łacinka) in copy.

### Using Handjet well

- Body: `--fs-body` (1.05–1.2 rem), weight 400–450, line-height 1.55, tracking
  ≈ 0.01em. Handjet is narrow; do not letterspace running text.
- Labels and instrument read-outs: uppercase, weight 450–550, tracking
  0.08–0.14em, `--fs-mono`/`--fs-micro`.
- Buttons: uppercase, `0.875rem` (small `0.78rem`), tracking 0.1em.
- Minimum practical size: about 0.8 rem for labels, 0.95–1 rem for body. Handjet
  is legible smaller than a normal mono, but pixel elements should never collapse.
- Do not use letter-spacing on lowercase Cyrillic; uppercase tracking above
  0.18em starts to break word shapes.
- Numerals, coordinates and dates are Latin digits in Handjet, e.g.
  `53.9006° N · 27.5590° E`. This is a deliberate instrument convention in every
  locale.
- The variable axes `ELGR` (Element Grid 1–2) and `ELSH` (Element Shape 0–16)
  exist but should stay at defaults: the vendored woff2 is already the chosen
  pixel construction.

## Pixel-serif display masks

Headings are not web text in the current font: they are generated raster masks
plus hidden real text.

### How a mask is made

`scripts/generate-pixel-type.py`:

1. Resolves the heading string(s) from `messages/{locale}.json`, including the
   italic accent run (e.g. `hero.titleAccent`).
2. Renders Cormorant at a small logical font size derived from
   `height / block / cap-ratio`, wraps to the configured width, and advances
   roman/italic runs on the same baseline.
3. Crops to the ink bounding box, thresholds at `> 88`, and upscales each pixel
   by `block` with nearest-neighbour.
4. Saves a transparent one-bit alpha PNG in `public/type/{locale}/{name}.png`
   and records `src`, `width`, `height`, `cssWidth` in
   [`src/content/pixel-type.json`](../../src/content/pixel-type.json).
5. For editorial headings, also renders a **narrow-screen variant** with fewer
   columns, more wrapped lines and the same 2 px grid, e.g.
   `section.services-mobile.png`. This is the v2.1 readability fix: the same
   Cormorant mask with a denser grid, bolder weight and slight tracking. Header,
   hero and footer masks keep one variant.

The current display set:

| Manifest key                    | Height    | Block | Notes                                                      |
| ------------------------------- | --------- | ----- | ---------------------------------------------------------- |
| `header.brand`                  | 24        | 2     | pixel wordmark, slightly tracked and bolder for legibility |
| `hero.line1` / `hero.line2`     | 118 / 104 | 5     | two-line hero statement, one roman + one italic accent     |
| `section.*`                     | 46        | 2     | all section statements, up to 2 lines; mobile variant 42/2 |
| `footer.brand`                  | 98        | 7     | oversized footer wordmark                                  |
| `page.privacy`, `page.notFound` | 52 / 58   | 2 / 3 | inner pages; narrower mobile variants                      |

### Rendering the mask

[`src/components/brand/PixelType.tsx`](../../src/components/brand/PixelType.tsx):

```tsx
<PixelType locale={locale} name="section.services" text={t('services.title')} />
```

- Renders `.sr-only` real text for assistive technology and search engines.
- Renders one or two `aria-hidden` `<span>` masks (`mask-image`) painted with
  `currentColor` — cream on ink and ink on `.on-paper` sections need no second
  asset. When a mobile variant exists, CSS shows it below 700 px and the
  desktop mask above.
- Falls back to plain Handjet text if a manifest entry is missing.
- `maxWidth` caps the rendered width; aspect-ratio comes from the manifest.
- Generated masks are raster assets, so changing a heading requires both the
  message catalogue and `scripts/generate-pixel-type.py` to be updated together.

Rules: never render body copy as masks; never use masks for text that must be
selected, translated at runtime or read by a crawler without the sr-only copy.
Do not recolour the mask with a filter — the `currentColor` mask handles ink and
cream.

### Regenerating after copy changes

Display headings are baked per locale. If a title string changes:

```bash
python3 scripts/generate-pixel-type.py
```

Commit the regenerated `public/type/**` and `src/content/pixel-type.json` with
the copy change. If a new heading is added, add its manifest spec (height, block,
max width, runs) in the script and rerun it.

## Scale

All sizes come from [`tokens.css`](../../src/styles/tokens.css); components never
hard-code a font size.

| Token          | Value                           | Role                      |
| -------------- | ------------------------------- | ------------------------- |
| `--fs-display` | `clamp(3.5rem, 10vw, 9rem)`     | display masks in the hero |
| `--fs-h1`      | `clamp(2.6rem, 6.5vw, 5.5rem)`  | page `h1` fallback        |
| `--fs-h2`      | `clamp(2rem, 4.2vw, 3.5rem)`    | section `h2` fallback     |
| `--fs-h3`      | `clamp(1.5rem, 2.4vw, 2rem)`    | card and feature titles   |
| `--fs-lead`    | `clamp(1.2rem, 1.7vw, 1.5rem)`  | hero copy, section intros |
| `--fs-body`    | `clamp(1.05rem, 1.2vw, 1.2rem)` | body copy                 |
| `--fs-small`   | `1rem`                          | captions, metadata        |
| `--fs-micro`   | `0.85rem`                       | tags, tiny labels         |
| `--fs-mono`    | `0.8rem`                        | `.mono` instrument labels |

Shared utilities: `.mono` (uppercase Handjet, 0.8rem, 450, tracking 0.12em),
`.display`, `.lead`, `.serif`/`.display-italic` (legacy names that now resolve to
Handjet — do not build new work on them). Headings default to Handjet 500 with
line-height 1.02; pixel-serif masks replace them only where the display
treatment is desired.

## Locale notes

- `ru`, `be`, `en` share the same type scale and Handjet files.
- Every display mask is generated per locale because the heading copy is baked
  into pixels; adding a language or changing a title requires regenerating masks.
- Belarusian/Russian words are longer than English: `maxWidth` in the mask
  manifest and layout wrapping must survive the longest `be` string first.
- Quotation marks follow the locale: `«…»` for ru/be, `“…”` for en; the dash is
  `—` in display copy. All are covered by Handjet/Cormorant subsets.
- No auto-hyphenation. Fix layout, not copy.

## Fallbacks and robustness

- `--font-pixel: 'Handjet', 'Courier New', monospace` — if Handjet fails, the
  page stays readable in a monospace fallback; masks are images and still render
  (with sr-only text).
- Handjet uses `font-display: swap`; keep the preload list to the two cyrillic +
  latin files.
- `PixelType` falls back to real text if the manifest entry or PNG is missing;
  this fallback must be styled to remain legible in a mask slot.
- Text must survive 200% zoom. Mask headings scale as images with their aspect
  ratio; never set them as background of fixed-height containers without
  responsive `max-width`.

## Accessibility

- Pixel-serif masks ship with `.sr-only` real text in the accessibility tree;
  headings remain semantic (`h1`, `h2`, …). Never use an aria-hidden mask as the
  only copy.
- Body text is real text in Handjet and remains selectable, translatable and
  zoomable.
- Contrast: paper on ink 14.77:1, ink on paper 14.77:1; secondary pairs pass AA
  (see [visual-language.md](visual-language.md)).
- Minimum sizes: `--fs-body` for reading text, ≈0.8 rem for uppercase labels.
  Do not set essential copy in `.micro`.
- Focus style is a 1 px currentColor outline; typography never removes it.

## Do / Don't

**Do**

- Use Handjet for everything that is running text; let the pixel elements show.
- Use `PixelType` for large statements; provide the real `text` prop.
- Keep uppercase labels short and tracked 0.08–0.14em.
- Regenerate masks when copy changes, in the same commit.

**Don't**

- Don't render a smooth serif/sans headline anymore.
- Don't use Cormorant as a web font or in body copy; it is build-time only.
- Don't letterspace lowercase Cyrillic or use all-caps for paragraphs.
- Don't recolour masks with filters or mix them with accent colours.
- Don't add a fourth family or a new weight without updating tokens, the
  preload list and this document.

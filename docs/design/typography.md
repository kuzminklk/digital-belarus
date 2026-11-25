# Typography

Status: implemented
Owner: designer
Related: [visual language](visual-language.md) | [ornament](ornament.md) | [tokens](../../src/styles/tokens.css) | [fonts.css](../../src/styles/fonts.css)

The type system is the quiet half of the "observatory" idea: a romantic serif for
the sky, a neutral sans for explanations, and a monospaced voice for instrument
read-outs. Three families, sixteen vendored files, zero network requests.

## Families

| Role      | Family                 | Variable axes          | Usage                                                           | Never                                        |
| --------- | ---------------------- | ---------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| Display   | **Cormorant Garamond** | `wght 300–700`, italic | `h1`–`h6`, `.display`, emphasis words                           | body copy, labels, UI controls               |
| Body      | **Manrope**            | `wght 400–800`         | paragraphs, intros, buttons, forms, navigation                  | display headlines, coordinates               |
| Technical | **JetBrains Mono**     | `wght 400–700`         | eyebrows, indices, tags, HUD labels, coordinates, button labels | sentences, paragraphs, long Cyrillic strings |

Why these three:

- Cormorant's high contrast and narrow apertures give the hero its editorial,
  telescope-lens character. Italic is the "human" accent: one italic word per
  heading, never a whole line.
- Manrope is Cyrillic-native, has a calm, slightly technical skeleton and works
  at 14–18 px on dark backgrounds. It keeps long Russian/Belarusian sentences
  readable without competing with the display face.
- JetBrains Mono is the instrument voice: uppercase, letterspaced, numeric.
  It makes coordinates, figure numbers and section indices read as calibrations
  rather than decoration.

## Licences

All three families are licensed under the **SIL Open Font License, Version 1.1**
(OFL). The woff2 files are vendored in [`public/fonts`](../../public/fonts), and
the OFL permits bundling and redistribution with the site. Keep the copyright
notice and licence with the files when updating them; do not sell the fonts on
their own.

| Family             | Upstream / copyright                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Cormorant Garamond | [CatharsisFonts/Cormorant](https://github.com/CatharsisFonts/Cormorant), Copyright 2015 The Cormorant Project Authors (Christian Thalmann)  |
| Manrope            | [sharanda/manrope](https://github.com/sharanda/manrope), Copyright 2018 The Manrope Project Authors (Mikhail Sharanda)                      |
| JetBrains Mono     | [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono), Copyright 2020 The JetBrains Mono Project Authors (JetBrains s.r.o.) |

Attribution inside the site UI is not required by the OFL. The licence headers
above are the attribution record. Some upstream releases reserve font names
(RFN); if we ever modify or subset the binaries, rename the derived family
according to the upstream `OFL.txt`, because the reserved-name rule applies to
modified versions, not to verbatim redistribution.

## Files and subsets

Every family is split by subset. The file-name convention is
`family-style-subset-weights.woff2`; `@font-face` declarations live in
[`src/styles/fonts.css`](../../src/styles/fonts.css) with explicit
`unicode-range` so a browser downloads only the slices it needs.

| Family / style            | Weight range | cyrillic-ext | cyrillic | latin-ext | latin |
| ------------------------- | ------------ | ------------ | -------- | --------- | ----- |
| Cormorant Garamond normal | 300–700      | ✓            | ✓        | ✓         | ✓     |
| Cormorant Garamond italic | 300–700      | ✓            | ✓        | ✓         | ✓     |
| Manrope normal            | 400–800      | ✓            | ✓        | ✓         | ✓     |
| JetBrains Mono normal     | 400–700      | ✓            | ✓        | ✓         | ✓     |

Total payload is ~400 KB of woff2 across all sixteen files, but a page never
downloads all of them. `font-display: swap` is set on every face, so text is
readable with fallbacks before the webfont arrives.

### Belarusian and Russian coverage

The site ships in `ru`, `be` and `en`. The relevant characters are all inside
the `cyrillic` subset (`U+0301, U+0400–045F, U+0490–0491, U+04B0–04B1, U+2116`):

| Character        | Code point | Locale                               | Subset                      |
| ---------------- | ---------- | ------------------------------------ | --------------------------- |
| `ў` (short u)    | U+045E     | be                                   | cyrillic                    |
| `і` (dotted i)   | U+0456     | be                                   | cyrillic                    |
| `ё`              | U+0451     | ru, be                               | cyrillic                    |
| `’` (apostrophe) | U+2019     | ru, be (e.g. _аб’ява_, _зьвярнуцца_) | latin (general punctuation) |
| `№`              | U+2116     | ru                                   | cyrillic                    |

Notes:

- Belarusian is **not** Ukrainian: do not style `і`, `ў` or apostrophes as
  Ukrainian-only glyphs. The same Cyrillic subset serves both `ru` and `be`;
  no additional font files are needed for Belarusian.
- The curly apostrophe `’` and typographic quotes `«»`/`“”` live in the
  `latin` general-punctuation range. The browser resolves them from the same
  family via another unicode-range slice, so they render in the correct face —
  verify visually when introducing new punctuation.
- Do not use Latin transliteration (Łacinka) in copy; Latin strings on the page
  are brand names and decorative instrument labels only.
- Uppercase Cyrillic labels are allowed in JetBrains Mono only (short labels,
  tracking ≤ 0.18em). Avoid all-caps Cyrillic in Cormorant and Manrope: the
  Cyrillic capitals are visually wide and the reader loses word shape.

## Scale

The scale lives in [`tokens.css`](../../src/styles/tokens.css) and is fluid between
mobile and desktop. Components must use the token, never a local `font-size`.

| Token          | Value (clamp)                        | Role                        | Weight / line-height / tracking                     |
| -------------- | ------------------------------------ | --------------------------- | --------------------------------------------------- |
| `--fs-display` | `clamp(3.4rem, 11.5vw, 10.5rem)`     | hero display, `.display`    | Cormorant 400 (italic accent 300) / 0.86 / −0.045em |
| `--fs-h1`      | `clamp(2.8rem, 7.5vw, 6.5rem)`       | page `h1`                   | Cormorant 400 / 0.95 / −0.025em                     |
| `--fs-h2`      | `clamp(2.1rem, 5vw, 4.25rem)`        | section statements          | Cormorant 400 / 0.95 / −0.025em                     |
| `--fs-h3`      | `clamp(1.35rem, 2.2vw, 1.85rem)`     | card and feature titles     | Cormorant 400 / ~1.05 / −0.015em                    |
| `--fs-lead`    | `clamp(1.05rem, 1.45vw, 1.35rem)`    | hero copy, section intros   | Manrope 400 / 1.55 / 0.005em                        |
| `--fs-body`    | `clamp(0.975rem, 1.05vw, 1.0625rem)` | body copy                   | Manrope 400 / 1.65 / 0.005em                        |
| `--fs-small`   | `0.875rem`                           | metadata, captions          | Manrope 400 / 1.5                                   |
| `--fs-micro`   | `0.6875rem`                          | tags, chips, tiny labels    | JetBrains Mono 500 / uppercase / 0.08–0.14em        |
| `--fs-mono`    | `clamp(0.66rem, 0.8vw, 0.75rem)`     | `.mono` labels, coordinates | JetBrains Mono 400–600 / 1.5 / 0.14em               |

Shared utilities in [`base.css`](../../src/styles/base.css) map to the scale:
`.display`, `h1`–`h6`, `.lead`, `.mono`, `.serif`, `.accent`, `.aurora`,
`.muted`. Components should compose these instead of re-declaring size rules.

Cormorant weights below 400 are for italic accents only. Never fake bold or
italic: use the variable axis or the italic file.

## Pairing and rhythm

A typical section masthead, as rendered by `SectionHeading`:

1. **Mono eyebrow**: `01 — УСЛУГИ` — index, 1 px rule, uppercase label, `--fs-mono`.
2. **Serif statement**: `--fs-h2`, one phrase set in italic with `.accent`
   colour; at most one italic fragment.
3. **Intro paragraph**: `.lead`, `--paper-dim`, max width ~40 ch.

Body text is `--fs-body`/1.65 with `text-wrap: pretty`; headings use
`text-wrap: balance`. Paragraphs cap at 60–72 characters (`max-width: 40ch` for
leads, `~65ch` for body columns). Instrument labels sit in uppercase mono with
`0.12–0.18em` tracking; never track body copy.

## Locale behaviour

- `ru`, `be`, `en` share the same scale. Belarusian and Russian words are on
  average 10–20% longer than English; layout must survive without hard-coded
  widths. Test the longest strings in `be` first.
- No auto-hyphenation is enabled. If a long word wraps badly, fix the layout,
  not the copy.
- Numerals, dates and coordinates stay Latin/mono in every locale (e.g.
  `53.9006° N · 27.5590° E`); this is an intentional instrument convention.
- Quotes and dashes follow locale typography: `«…»` and `—` in ru/be, `“…”` and
  `—` in en. Do not use straight quotes in display copy.

## Fallbacks and robustness

Fallback stacks live in tokens:

| Role      | Stack                                                     |
| --------- | --------------------------------------------------------- |
| Display   | `'Cormorant Garamond', 'Times New Roman', serif`          |
| Body      | `'Manrope', 'Segoe UI', system-ui, sans-serif`            |
| Technical | `'JetBrains Mono', 'SFMono-Regular', Consolas, monospace` |

The page must remain readable with webfonts blocked or slow: the layout uses
line-heights and box heights that tolerate metrics swap, and the fallback serif
is chosen deliberately so the display voice survives without the original.
Test with DevTools "Block remote fonts" and with `font-display` forced to
`optional` before shipping.

## Loading and preload

- No `next/font`, no CSS frameworks: `@font-face` is hand-written and vendored.
- The locale layout preloads four files — Cormorant normal cyrillic + latin and
  Manrope normal cyrillic + latin — because they are guaranteed to be used above
  the fold in all three locales. Italic and JetBrains Mono load on demand.
- Do not preload every subset or every family; that would compete with the hero.
- Adding a family or weight means: vendor the woff2, add `@font-face` with the
  correct `unicode-range`, update this document and, if it is above the fold,
  the preload list.

## Accessibility

- Body text stays at or above `--fs-body`; the smallest interface text is
  `0.625–0.6875rem` (10–11 px) mono uppercase used for non-essential labels.
  Never put essential copy at `.micro` size.
- SVG instrument labels use viewBox units; nothing below **9 px** in the
  640-unit map coordinate system.
- Contrast: use `--paper` / `--paper-dim` for text, `--muted` for secondary
  labels (6.98:1 on `--ink-950`), and never `--red` for long text (4.92:1, which
  passes AA only at normal/large sizes and is reserved for short accents).
  See the palette table in [visual-language.md](visual-language.md).
- Text must survive 200% zoom and system-font substitution; avoid text baked
  into SVG. The star map's labels are decorative and hidden from assistive
  technology — the readable caption lives in HTML next to it.
- Do not use `text-align: justify` with Cyrillic; the gaps are too irregular.

## Do / Don't

**Do**

- Use `.display` for the hero, `SectionHeading` for sections, `.mono` for labels.
- Keep one italic accent per heading and set it in `--red-bright`.
- Use `--fs-mono` with uppercase for anything that behaves like an instrument.
- Let Cormorant breathe: generous line-height around large type, and avoid
  adding letter-spacing to the display face.

**Don't**

- Don't use Cormorant for paragraphs or Manrope for coordinates.
- Don't mix two accent colours in one heading.
- Don't hard-code `font-size` in `rem` inside a section module; add or reuse a
  token instead.
- Don't lowercase mono labels that read as coordinates, figure numbers or status.
- Don't introduce a fourth family without updating tokens, this document and the
  preload list.

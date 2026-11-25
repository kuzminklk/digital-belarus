# Visual language

Status: implemented (v2 — warm two-tone)
Owner: designer
Related: [design/visual-language.md](../design/visual-language.md) | [design/typography.md](../design/typography.md) | [design/ornament.md](../design/ornament.md) | [design/image-credits.md](../design/image-credits.md) | [decision 0008](../decisions/0008-warm-two-tone-pixel-serif-redesign.md)

## Problem

The first version read as a competent but familiar dark SaaS page: cold blue-black surfaces, three typefaces fighting for hierarchy, signal red and aurora green accents, generic cards and stock-like gradients. It did not carry the archival, observatory atmosphere of the reference and did not feel like one designed object.

## Behaviour

1. **Two inks only.** Warm near-black `#12100d` and archival cream `#ebe2d1`. No red, green, gold, blue or grey-blue; imagery is also strictly two-tone.
2. **Printed surfaces.** Entire sections alternate ink and cream (`.on-paper`). The header and footer remain ink. Inversion, not hue, carries emphasis.
3. **Pixel-serif display.** Hero lines, section headings, the privacy title and the footer wordmark are generated pixel-serif masks: Cormorant Garamond rasterised small, thresholded and nearest-neighbour upscaled. They inherit currentColor through CSS masks and always expose real text to assistive tech.
4. **Handjet interface/body.** Navigation, labels, buttons, prices, paragraphs and technical read-outs use Handjet, a variable pixel mono with Cyrillic and Belarusian coverage. Uppercase for labels; sentence case for paragraphs.
5. **Dithered imagery.** Hero, portrait, cases and the archival atlas are 1-bit Floyd–Steinberg dithered and nearest-neighbour upscaled, so individual square pixels are visible. Sources and licences are documented.
6. **Editorial layout.** Hairline rules, numbered rows, generous empty ink, full-bleed image bands, ink panels inside cream sections and cream cards inside ink sections. No rounded cards, no glows, no gradients, no soft shadows.
7. **Identity.** Cream square stamp with a black pixel rushnyk star. Thin embroidered rushnyk rules are used sparingly as dividers.
8. **Motion.** Slow reveal fades, small underline draws and the scroll cue. Everything respects `prefers-reduced-motion`.

## Acceptance criteria

- [x] No colour outside the two-tone palette in UI or imagery.
- [x] Display headings are pixel-serif masks; body/UI is Handjet; no smooth display font is used.
- [x] Sections alternate ink and cream; header/footer stay ink.
- [x] Mark, rules, icons, imagery and type feel like one system at 390/768/1440 px in all locales.
- [x] Pixel art stays crisp (masks are thresholded; imagery is nearest-neighbour).
- [x] Reduced motion yields a static readable page.

## Out of scope

- Light mode or theme switching.
- More than two colours.
- Stock photography, 3D, illustration styles other than 1-bit pixel art.

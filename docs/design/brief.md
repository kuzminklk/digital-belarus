# Visual brief — «Цифровая Беларусь» v2

Status: implemented (v2 — warm two-tone)
Superseded brief: v1 (cold blue-black, Cormorant/Manrope/JetBrains, red and aurora accents). The v2 brief below is the current direction; implementation details live in [visual-language.md](visual-language.md), [typography.md](typography.md), [ornament.md](ornament.md) and [image-credits.md](image-credits.md).

## Idea

An archival astronomy journal printed in two inks. The internet is a night sky; a business is a point of light; the studio builds the instrument that finds it. Belarus is present through a pixel rushnyk stamp, thin woven rules, Minsk coordinates and a cast of Belarusian craft and landscape in the case imagery.

## Direction

- **Two colours only:** warm ink `#12100d` and cream `#ebe2d1`. No accent hues; emphasis through inversion, scale and texture.
- **Pixel-serif display:** headings are raster masks generated from Cormorant Garamond (tiny render → threshold → nearest upscale), giving the NOCTRA-like bitmap-serif voice with full Cyrillic and Belarusian coverage.
- **Handjet pixel mono:** the UI/body voice for navigation, labels, prices, paragraphs, forms and technical read-outs.
- **1-bit imagery:** Floyd–Steinberg dithered, nearest-upscaled images from public-domain/CC sources (NASA lunar panorama, Cellarius atlas, Belarusian ceramics, café interior, forest, a pixel-art Telegram bot).
- **Editorial layout:** full ink and full cream surfaces alternate; hairlines, numbered rows, oversized headings, full-bleed image plates, inverted panels instead of cards.
- **Identity:** cream stamp with an ink pixel eight-point rushnyk star; thin embroidered rules.
- **Motion:** slow reveal fades, a small underline draw, a scroll cue. Reduced motion is static.

## Anti-goals

No glow, no gradients, no soft shadows, no rounded cards, no stock photography, no third colour, no smooth display serif, no generic SaaS marquee.

## References

- [NOCTRA Observatory Website Design](https://www.behance.net/gallery/248063485/NOCTRA-Observatory-Website-Design-UXUI) — the primary reference: typography, image treatment, two-tone restraint, editorial layout.
- Belarusian rushnyk/vyshyvanka cross-stitch geometry.
- Public-domain astronomy engravings and NASA Apollo photography.

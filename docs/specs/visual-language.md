# Visual language

Status: implemented
Owner: designer
Related: [design/visual-language.md](../design/visual-language.md) | [design/ornament.md](../design/ornament.md) | [design/typography.md](../design/typography.md) | [decision 0004](../decisions/0004-pixel-ornament-system.md)

## Problem

The studio must look like a precise, premium Belarusian product studio — not a template, not a Russified SaaS landing and not "space clip-art".

## Behaviour

1. The art direction is a nocturnal observatory: the internet as a night sky, a business as a point of light, Belarus as a constellation.
2. Surfaces are near-black (`--ink-*`), type is warm paper (`--paper`), signal red (`--red`) marks actions and live accents, aurora green (`--aurora`) marks system/available states, gold is rare.
3. Display typography is Cormorant Garamond; body is Manrope; technical labels are uppercase, letterspaced JetBrains Mono. All include Cyrillic and Belarusian glyphs.
4. The identity system includes: a pixel mark, rushnyk ornament strips, a 16×16 pixel icon set, a constellation map of Belarus with Minsk as the reference point, and instrument-style HUD labels.
5. Ornament is built on integer pixel grids with `crispEdges`; no anti-aliased curves, no drop shadows inside motifs.
6. Corners stay sharp (0–2 px). Borders are 1 px hairlines. Layouts use a 12-column grid, generous vertical rhythm and deliberate asymmetry.
7. Motion is slow and mechanical: reveals, orbit rotation, twinkle, marquee, line draws. No bounce, spring, blur or cursor hijacking. Everything respects `prefers-reduced-motion`.
8. The hero map is the single signature visual; other sections use restrained abstract art rather than photography.

## Acceptance criteria

- [x] All colours, fonts, spacing and durations come from tokens.
- [x] Ornament components are decorative and crisp at 1×/1.5×/2×.
- [x] The page still reads well with images/fonts blocked (system serif fallback).
- [x] Reduced motion freezes all decorative animation.
- [x] No stock photos, icon libraries or CSS frameworks.
- [x] The mark, ornament, icons, map and OG image feel like one system.

## Out of scope

- Light theme.
- Illustrated characters or 3D.
- Per-client brand theming.

## Verification

Visual QA in `docs/qa`, screenshots at 360/768/1440 px in all locales.

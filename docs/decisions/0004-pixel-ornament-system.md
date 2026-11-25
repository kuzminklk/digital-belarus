# 0004 — Pixel-art rushnyk as a component system

Status: accepted; palette/typography superseded by [0008](0008-warm-two-tone-pixel-serif-redesign.md)
Date: 2026-11-26

## Context

The brief asks for a Belarusian ornament in a modern pixel-art style, integrated into a dark observatory identity. A decorative frame or a stock embroidery SVG would look pasted on.

## Decision

Build the ornament as a reusable SVG component system: a 16×16 pixel mark, full-width rushnyk strips with border/divider/wave variants, a 16×16 icon set, and low-contrast ornament fields. Motifs derive from rushnyk geometry (rhombi, eight-point stars, endless lines, tree-of-life hooks) and are drawn as integer-aligned `<rect>` elements with `shape-rendering="crispEdges"`. Decorative components are `aria-hidden`, animated only with opacity/transform and disabled under reduced motion.

## Consequences

- The identity scales from a 16 px favicon to a full-bleed divider and stays crisp.
- Design changes are code changes; a design-system page or visual tests are recommended.
- Animation is deliberately restrained, which suits the observatory tone but limits playfulness.
- Ornament must stay decorative and never carry essential information.

## Alternatives considered

- PNG/SVG embroidery from stock libraries — inconsistent, heavier and not Belarusian-specific.
- Canvas-drawn patterns — harder to keep crisp and accessible than SVG patterns.
- A single decorative divider — not a system, does not cohere with icons and mark.

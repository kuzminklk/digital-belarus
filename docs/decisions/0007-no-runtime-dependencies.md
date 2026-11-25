# 0007 — No UI, animation or icon libraries

Status: accepted
Date: 2026-11-26

## Context

The visual identity is custom and highly specific: pixel ornament, observatory HUDs, oversized serif typography, instrument maps. Generic component libraries and animation frameworks would be fought rather than used.

## Decision

Keep runtime dependencies to Next.js, React and next-intl. Write CSS Modules and inline SVG by hand. Animate with CSS keyframes/transitions and tiny client components (IntersectionObserver, scroll progress, dialog state, calculator state). Unit-test pure logic with Vitest only.

## Consequences

- Small bundle, full control of the visual result, no version churn from UI kits.
- More first-party CSS and SVG code to maintain; the design system must be documented.
- No ready-made accessibility primitives for complex widgets; use native elements (`dialog`, `details`, form controls) to compensate.
- Visual regression testing becomes more valuable; it is on the roadmap.

## Alternatives considered

- Tailwind CSS — useful for speed but tends toward generic layouts; the team preferred semantic CSS Modules for this art direction.
- Framer Motion — unnecessary for the handful of CSS-expressible animations.
- Icon libraries — the pixel icon set is part of the identity.

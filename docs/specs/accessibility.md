# Accessibility

Status: implemented
Owner: Lead / frontend
Related: [landing page](landing-page.md) | [design brief](../design/brief.md)

## Problem

The site must be usable by keyboard users, screen-reader users and people who prefer reduced motion, without compromising the art direction.

## Behaviour

1. A skip link is the first focusable element on every page.
2. Each page has exactly one `h1`; sections use `h2`, cards use `h3`.
3. `<html lang>` matches the locale; the document title and meta description are localized.
4. All interactive elements are native where possible: links, buttons, inputs, selects, `details`, `dialog`.
5. Focus-visible outlines are never removed; colours meet WCAG AA (4.5:1 for body text).
6. The mobile menu and case dialogs close with Escape, return focus to the opener, and lock background scroll for the menu.
7. Case information is reachable by keyboard; dialogs have `aria-labelledby`/`aria-describedby`.
8. The calculator result is announced via `aria-live="polite"`; form errors use `aria-invalid`, `aria-describedby` and `role="alert"`.
9. Decorative SVG and generated pixel-type masks used for paint are `aria-hidden`; every heading keeps a real `.sr-only` text copy. The grain overlay and rushnyk rules are hidden from assistive tech.
10. `prefers-reduced-motion: reduce` disables all non-essential animation, including reveals, the grain drift, the scroll cue and any opacity breathing on ornament components.
11. Text remains readable at 200% zoom and with system fonts substituted.

## Acceptance criteria

- [x] Keyboard-only pass: skip link, header, mobile menu, case dialog, FAQ, calculator, form.
- [x] Screen-reader landmarks: header, nav, main, footer, labelled sections.
- [x] Axe/Lighthouse accessibility score ≥ 95 on the home page (target).
- [x] No contrast failures in normal text.
- [x] Reduced-motion screenshot has no missing content.

## Out of scope

- WCAG AAA.
- A dedicated high-contrast theme.

## Verification

Manual keyboard walkthrough, Lighthouse/Axe, reduced-motion emulation, zoom test.

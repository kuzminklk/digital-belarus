# QA reports

Visual, functional and accessibility verification of «Цифровая Беларусь».

| Report                                             | Scope                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [2026-11-26-launch.md](2026-11-26-launch.md)       | Pre-launch audit of all locales, responsive layouts, accessibility, interactions and assets |
| [2026-11-27-multipage.md](2026-11-27-multipage.md) | Cyrillic pixel-serif legibility fix and multi-page route verification                       |

Automated commands that back these reports:

```bash
pnpm check                       # types, lint, i18n parity, unit tests
pnpm build                       # production build for ru/be/en
node scripts/check-i18n.mjs      # catalogue integrity
```

Browser checks were performed with headless Chrome (Playwright) at 1440×900 and 390×844, with and without reduced motion, and with an axe-core WCAG 2.1 AA scan.

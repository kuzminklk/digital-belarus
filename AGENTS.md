# AGENTS.md

## Goal

Maintain and extend «Цифровая Беларусь» — a trilingual (ru, be, en) marketing site for a digital services studio in Minsk. The site sells websites, Telegram bots, AI assistants, e-commerce and automation. It is a single landing page plus a privacy page, statically rendered, with no backend or customer data storage.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict, Turbopack.
- next-intl 4 for locale routing, metadata and message catalogues.
- Hand-written CSS Modules and CSS custom properties. No Tailwind, no UI kit.
- Inline SVG for all graphics. Fonts are self-hosted in `public/fonts`.
- Vitest for pure logic. No end-to-end framework is installed.
- Deployment: Vercel, static/ISR output.

## Commands

```bash
pnpm dev             # local development, redirects / → /ru
pnpm build           # production build for all locales
pnpm start           # serve the production build
pnpm typecheck       # tsc --noEmit
pnpm lint            # eslint .
pnpm check:i18n      # message parity across ru/be/en
pnpm test            # vitest run
pnpm check           # all of the above
pnpm format          # prettier --write .
```

## Conventions

**Language policy.** User-facing copy is Russian, Belarusian and English. Code, comments, commits, README, AGENTS and all documentation are English. Russian (`messages/ru.json`) is the source catalogue; `be.json` and `en.json` mirror its structure exactly.

**Content belongs in `messages/`.** Do not hardcode user-facing copy in components. Arrays and objects that describe content are read with `t.raw()` and typed locally. Brand names, product names and decorative Latin instrument labels are the only exceptions.

**Structure and styling.** One section per file in `src/components/sections/`, one CSS Module next to it. Compose shared primitives from `src/styles/components.css` (`.btn`, `.panel`, `.tag`, `.field`, `.mono`, `.container`, `.section`). Reference design tokens from `src/styles/tokens.css`; never hardcode colours, type sizes, spacing or motion durations.

**Design rules.** Dark observatory identity: near-black surfaces, warm paper type, signal red used sparingly, aurora green only for live/system states. Sharp corners (0–2 px), hairline borders, grid-aligned layouts, oversized Cormorant display type, Manrope body, letterspaced JetBrains Mono labels. Pixel ornament follows the rules in `docs/design/ornament.md`: integer-aligned rects, `shape-rendering="crispEdges"`, no gradients or curves inside motifs. Ornament is decorative: always `aria-hidden`, never focusable.

**Accessibility.** Semantic landmarks, one `h1` per page, visible focus states, keyboard-operable dialogs and accordions, `aria-live` for async feedback, WCAG AA contrast, `prefers-reduced-motion` respected for every non-essential animation. Do not remove the skip link.

**Performance.** No new runtime libraries for effects; use CSS and small client components. Keep the constellation map and calculator the only meaningful client-side logic. Preload only the Cyrillic and Latin display/body font files that the first screen needs. Avoid external requests: no CDN fonts, no analytics, no third-party scripts.

**i18n.** Locale routing uses `localePrefix: 'always'`, default locale `ru`. Add a key to all three catalogues at once and run `pnpm check:i18n`. Preserve ICU placeholders and array lengths across locales. Metadata must be locale-specific and include canonical + hreflang alternates.

**Security and privacy.** No cookies, analytics or storage besides the language in the URL. The brief form builds a message in the browser, copies it and opens Telegram; it never posts data to a server. Never commit secrets; deployment credentials live outside the repository.

**Git.** Work is committed in small, descriptive commits in English. Do not commit `.next`, `node_modules`, `.env*`, local screenshots or generated test output. The repository is a submodule of `kuzminklk/artificial-intelligence` at `web/digital-belarus`.

## Documentation map

- `docs/specs` — behaviour and acceptance criteria for each feature.
- `docs/decisions` — architecture decision records (context, decision, consequences).
- `docs/design` — visual language, ornament construction, typography.
- `docs/content` — translation policy, glossary, brand-name handling.
- `docs/ops` — GitHub/Vercel deployment runbook.
- `docs/qa` — verification reports and visual QA notes.

Update the relevant spec and add an ADR when changing behaviour, content policy, visual language or infrastructure.

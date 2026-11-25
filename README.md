## About

### Description

«Цифровая Беларусь» is the website of an independent digital studio in Minsk. It sells websites, Telegram bots, AI assistants and automation to Belarusian businesses: a single, fast landing page in Russian, Belarusian and English with a transparent pricing calculator and a brief that is handed off to Telegram.

The visual language treats the internet as a night sky: a business is a point of light, a website is the instrument that finds it. Belarus is drawn as a constellation, and its traditional rushnyk ornament is rebuilt on a pixel grid. The result is a nocturnal observatory, not a generic SaaS page.

![Digital Belarus landing page](docs/qa/screenshots/desktop-hero.jpg)

### Technologies

Development: Visual Studio Code, Artificial intelligence assistance  
Framework: Next.js 16 (App Router), React 19, TypeScript (strict)  
Internationalisation: next-intl 4 — Russian (`ru`), Belarusian (`be`), English (`en`)  
Styling: hand-written CSS Modules, CSS custom properties, design tokens  
Graphics: inline SVG, deterministic SVG/canvas-free star map, pixel-art ornament components  
Typography: Cormorant Garamond, Manrope, JetBrains Mono (self-hosted WOFF2, Cyrillic + Belarusian subsets)  
Formatting and checks: Prettier, ESLint, TypeScript, Vitest, custom i18n parity script  
Deployment: Vercel (static rendering, no runtime dependencies)  
Version control: Git, GitHub

### Documentation

- [AGENTS.md](AGENTS.md) — project guide for artificial-intelligence agents
- [docs/specs](docs/specs) — feature specifications and acceptance criteria
- [docs/decisions](docs/decisions) — architecture decision records
- [docs/design](docs/design) — visual language, ornament and typography
- [docs/content](docs/content) — translation policy and glossary
- [docs/ops](docs/ops) — deployment and operations

## State

### Path

Developed with DeepSeek Harness and an Agent Team (lead, designer, frontend, content, deployment).

1. Defined the studio positioning, services, packages, cases and FAQ based on the "website, bots and AI for local business" model
2. Built the observatory identity: pixel rushnyk mark, ornament strips, custom icon set and a Belarus constellation star map
3. Implemented the trilingual landing page, pricing calculator, case dialogs and Telegram brief handoff
4. Added SEO (per-locale metadata, hreflang, sitemap, OG images), accessibility and reduced-motion support
5. Documented the architecture, design system, content policy and deployment
6. Published the repository on GitHub and launched production on Vercel with automatic deploys from `main`

### To-dos

- Add real client testimonials and replace the two concept cases when commercial projects are available
- Add automated visual regression and Lighthouse checks to CI
- Wire the brief form to a serverless Telegram delivery endpoint (optional; the current flow uses a safe client-side handoff)
- Consider a custom domain and a small performance pass on the below-the-fold client islands (Lighthouse performance 85–87 locally, accessibility/SEO 100)

## Usage

### Requirements

Node.js 24+, pnpm 11+.

### Install

```bash
pnpm install
```

### Run

```bash
pnpm dev          # http://localhost:3000 → redirects to /ru
```

### Build

```bash
pnpm build        # production build, all three locales pre-rendered
pnpm start        # serve the production build
```

### Check

```bash
pnpm check        # typecheck + lint + locale parity + unit tests
pnpm format       # write Prettier formatting
```

### Visit

Production: [https://digital-belarus.vercel.app](https://digital-belarus.vercel.app)

The site is deployed on Vercel (project `digital-belarus`, team `kuzminklk-projects`) and the GitHub repository is connected: every push to `main` triggers a production deployment. See [docs/ops/vercel-deployment.md](docs/ops/vercel-deployment.md).

### Clone

```bash
git clone https://github.com/kuzminklk/digital-belarus
```

## Structure

```text
messages/            ru.json (source), be.json, en.json — every user-facing string
public/              fonts, brand assets, founder portrait, OG images
scripts/             check-i18n.mjs and asset generation helpers
src/app/[locale]/    locale layout, landing page, privacy policy, 404
src/components/
  brand/             pixel mark, rushnyk ornament, icons, constellation map
  layout/            header, footer, grain
  sections/          hero and all content sections
  ui/                section heading, reveal, marquee, arrows
src/content/         language-independent data (Belarus outline)
src/i18n/            routing, request config, navigation helpers
src/lib/             site constants, SEO helpers, pricing calculator logic
src/styles/          fonts, design tokens, base layer, shared primitives
tests/               unit tests for pure logic
docs/                specs, decisions, design, content, ops
```

## Content & language policy

The user-facing content is Russian, Belarusian and English; code, comments and documentation are English. Russian is the primary catalogue and the source for translations. The brand is «Цифровая Беларусь» in Russian, «Цыфровая Беларусь» in Belarusian and "Digital Belarus" in English. See [docs/content](docs/content) and [docs/decisions/0003-message-catalogs-as-content.md](docs/decisions/0003-message-catalogs-as-content.md).

## Deployment

| Item        | Value                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Production  | https://digital-belarus.vercel.app                                         |
| Team alias  | https://digital-belarus-kuzminklk-projects.vercel.app                      |
| Hosting     | Vercel, Next.js framework preset, root `./`                                |
| Git         | `kuzminklk/digital-belarus`, production branch `main`, auto-deploy on push |
| Environment | none required; canonical URL comes from `VERCEL_PROJECT_PRODUCTION_URL`    |

## Credits

Design direction inspired by the [NOCTRA Observatory website concept](https://www.behance.net/gallery/248063485/NOCTRA-Observatory-Website-Design-UXUI); content structure inspired by [Volga Digital](https://volga-digital.ru/). Belarus border data: Natural Earth (public domain). Typefaces: Google Fonts, SIL Open Font License. Founder portrait: the founder's GitHub avatar.

## License

MIT — see [LICENSE](LICENSE).

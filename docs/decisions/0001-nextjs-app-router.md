# 0001 — Next.js App Router with static rendering

Status: accepted
Date: 2026-11-26

## Context

The site is a content-led marketing page in three languages with small interactive islands (star map, case dialogs, pricing calculator, brief form). It must be fast on mobile networks in Belarus, deploy without infrastructure and be maintainable by a small studio.

## Decision

Use Next.js 16 with the App Router, React 19 and strict TypeScript. All routes are statically pre-rendered with `generateStaticParams` for the three locales. Interactive elements are isolated client components; the page shell, sections and metadata are server components. Deploy to Vercel.

## Consequences

- Fast, cacheable HTML with no server runtime or database.
- Great SEO control: per-locale metadata, canonical URLs, hreflang and Open Graph.
- Next.js is a large dependency; the build must be kept lean and the framework upgraded deliberately.
- Server/client boundaries need discipline: content strings and arrays stay in server components unless a client island needs them.

## Alternatives considered

- Astro — excellent for static content and lighter islands, but the team wanted React components and next-intl's routing/metadata model.
- Vite + React Router + prerender — more glue to maintain for i18n and metadata.
- A no-build static site — would make the calculator, dialogs and design system harder to maintain in three languages.

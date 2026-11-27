# 0009 — Multi-page static route architecture

Status: accepted
Date: 2026-11-27

## Context

V2 was a single long landing page plus a privacy page. The studio needs the site structure of a real agency: browsable services, individual service pages, case studies, pricing, calculator, studio, FAQ and contact. Content and design are already structured as reusable sections; duplicating them would make the site inconsistent.

## Decision

- Add static hubs under `src/app/[locale]/`: `services`, `cases`, `pricing`, `calculator`, `about`, `faq`, `contact`.
- Add statically generated detail routes `services/[slug]` and `cases/[slug]`, with slugs and case/image mapping in `src/content/pages.ts` and translations in the message catalogs.
- Add shared layout components `PageHero` (breadcrumb, pixel-serif H1, intro, aside) and `CtaBand`.
- Reuse the home section components by adding an optional `showHeading` prop; a hub page supplies its own h1 in `PageHero`, while the section still supplies the body and internal h2s.
- Every route exports localized metadata via `pageMetadata()` and is listed in the sitemap. Unknown slugs return the localized 404 (`dynamicParams = false`).
- Page titles use the same generated pixel-serif mask pipeline as home headings; new keys are added to the generator manifest.

## Consequences

- The site now has 57 static URLs (19 routes × 3 locales) generated at build time with no server runtime.
- Navigation becomes page-oriented; in-page anchors are reserved for the home process/contact sections.
- Adding a service or case requires a slug in `src/content/pages.ts`, translated copy in all catalogs, a generated type mask (for detail H1s) and a sitemap update is automatic.
- Reusing home sections keeps visual consistency but means those sections must accept `showHeading={false}` and remain layout-neutral.
- Dynamic routes are fully static, so content changes require a rebuild — acceptable for a small studio site.

## Alternatives considered

- One long landing page only — not enough structure for SEO or for browsing individual services/cases.
- MDX pages — less consistent with the existing message-catalog and generated-mask pipeline.
- A CMS or runtime rendering — unnecessary operational cost for a site this size.

# Site structure

Status: implemented (2026-11-27)

## Goal

Turn the single landing page into a browsable studio site while keeping every route statically generated and consistent with the v2 warm two-tone system.

## Routes

| Route                       | Contents                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `/{locale}`                 | Home: hero, approach, services, process, cases, pricing, calculator, reasons, studio, FAQ, contact |
| `/{locale}/services`        | Services hub: page hero, service directory, process, CTA                                           |
| `/{locale}/services/[slug]` | Service detail: hero with price/timeline/tags, what is included, process, related services, CTA    |
| `/{locale}/cases`           | Projects hub: page hero and full case gallery                                                      |
| `/{locale}/cases/[slug]`    | Case study: hero, full-bleed cover, challenge/solution/result, stack, related cases, CTA           |
| `/{locale}/pricing`         | Pricing tiers and calculator                                                                       |
| `/{locale}/calculator`      | Standalone pricing calculator                                                                      |
| `/{locale}/about`           | Studio: approach, founder profile, principles, CTA                                                 |
| `/{locale}/faq`             | Full FAQ list and CTA                                                                              |
| `/{locale}/contact`         | Contact channels and brief form                                                                    |
| `/{locale}/privacy`         | Privacy policy                                                                                     |

The service slugs are `websites`, `bots`, `ai`, `automation`, `commerce`, `analytics`. The case slugs are `yasna`, `central-park`, `spadchyna`, `prabot`; they map to the four `cases.items` entries in that order.

## Behaviour

1. Header navigation points to hub routes plus the in-page `/#process` anchor; the primary CTA and footer contact link point to `/contact`.
2. The active header item is underlined for the current hub and its detail descendants.
3. Every page uses one h1: a pixel-serif `PageHero` title. Reused home sections receive `showHeading={false}` so they do not repeat a second section heading where a page hero already introduces the page.
4. Detail pages are generated at build time from `SERVICE_SLUGS` and `CASE_SLUGS` (`generateStaticParams`, `dynamicParams = false`); unknown slugs return the localized 404.
5. All routes have locale-specific metadata, canonical URLs, hreflang alternates and sitemap entries (19 paths × 3 locales = 57 URLs).
6. Service cards on the home page and service directory link to their detail page. Case dialogs include a link to the case-study page.
7. Page transitions stay client-side through the next-intl `Link` wrapper; back/forward and direct URLs work with the static output.

## Acceptance

- [x] All routes return 200 for ru/be/en and render with the correct `lang`, title, canonical and hreflang.
- [x] Unknown service/case slugs return 404 with the localized not-found page.
- [x] Sitemap lists every hub and detail path for all locales.
- [x] Header/footer navigation and active states work from every page.
- [x] No horizontal overflow at 390 px or 1440 px on any route.
- [x] axe-core WCAG 2.1 AA: 0 violations across the new routes.
- [x] Home page content and interactive behaviour are unchanged.

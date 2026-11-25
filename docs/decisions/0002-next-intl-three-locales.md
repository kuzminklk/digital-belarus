# 0002 — next-intl with always-prefixed locales

Status: accepted
Date: 2026-11-26

## Context

Russian, Belarusian and English are first-class content languages. The default locale is Russian, but every locale must have stable, indexable URLs and share the same components.

## Decision

Use next-intl 4 with `localePrefix: 'always'`, locales `ru` (default), `be` and `en`, a `[locale]` segment and `src/proxy.ts` middleware. Set `localeCookie: false`; the locale lives only in the URL. Requests to `/` are redirected to `/ru`.

## Consequences

- Every page has a unique canonical URL per locale; no cookie banner is needed for language.
- `hreflang` and sitemap generation are straightforward.
- All copy must exist in three catalogues; a custom parity script enforces this.
- Prefixes are slightly longer URLs, which is acceptable for clarity.

## Alternatives considered

- Cookie-based locale without prefixes — hides the locale from crawlers and complicates sharing.
- No default prefix (`/` = Russian) — asymmetric URLs and redirect ambiguities.
- Separate domains or subdomains — unnecessary for a studio landing page.

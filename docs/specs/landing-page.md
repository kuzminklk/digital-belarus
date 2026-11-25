# Landing page

Status: implemented
Owner: Lead
Related: [i18n](i18n.md) | [pricing calculator](pricing-calculator.md) | [contact flow](contact-flow.md) | [visual language](visual-language.md)

## Problem

Belarusian small and medium businesses need a credible, fast and honest web presence for digital services. The studio must explain its offer, prices and process in one scroll, in the language the visitor chooses, and convert interest into a brief.

## Behaviour

1. `/` redirects to the visitor's preferred locale (falling back to `/ru`). Every page is available under `/ru`, `/be` and `/en`.
2. The page is one vertical narrative: hero → keyword marquee → approach → services → process → cases → pricing → calculator → reasons → studio → FAQ → contact.
3. The sticky header exposes the logo, section navigation, RU/BE/EN switcher, primary CTA and a mobile menu. It gains a translucent background and a red scroll-progress line after scrolling.
4. The hero presents the offer, availability status, two CTAs, three proof points and the interactive Belarus constellation map.
5. Service cards link to the pricing/calculator and each card carries its own anchor id (`#websites`, `#bots`, `#ai`, `#automation`, `#commerce`, `#analytics`).
6. Case cards open an accessible native dialog with the challenge, solution, stack and result; live projects link out, concept projects are explicitly labelled.
7. Pricing shows three tiers in BYN with a "popular" marker and a month of post-launch edits.
8. The calculator updates price and duration live from a pure function; it is an orientational range, not an offer.
9. FAQ uses native `<details>` and links to the contact section.
10. Contact provides channels, a live Minsk clock, availability and the brief form. The brief is built in the browser, copied to the clipboard and handed to Telegram.
11. The footer repeats navigation, services, contacts, language switching, legal link and returns to the top.
12. A 404 page and a localized privacy page exist in all locales.

## Content

All strings are in `messages/{ru,be,en}.json`. Complex arrays (`hero.metrics`, `services.items`, `process.steps`, `cases.items`, `pricing.tiers`, `pricing.calculator.*`, `why.items`, `studio.facts`, `faq.items`, `privacy.sections`) are read with `t.raw()` and typed in the component.

## Acceptance criteria

- [x] All three locales render every section with no missing keys.
- [x] Language switching preserves the current path.
- [x] The layout is usable from 360 px to 1920 px with no horizontal scroll.
- [x] Each section is reachable from the header and footer navigation.
- [x] Case dialogs and FAQ are keyboard operable.
- [x] Reduced-motion users see a static, readable page.
- [x] The page builds as a production static route for all locales.

## Out of scope

- A blog, CMS or admin panel.
- Real payment or CRM integration.
- Reviews from real clients (placeholder content is clearly editorial; concept cases are labelled).

## Verification

`pnpm build`, `pnpm check`, manual keyboard pass, Lighthouse and visual QA in `docs/qa`.

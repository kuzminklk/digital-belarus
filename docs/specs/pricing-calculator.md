# Pricing calculator

Status: implemented
Owner: frontend
Related: [landing page](landing-page.md) | [decision 0006](../decisions/0006-telegram-handoff-form.md) | [estimate tests](../../tests/estimate.test.ts)

## Problem

Fixed agency price lists scare away small businesses, while "contact us for a quote" creates friction. Visitors need a fast, honest ballpark in BYN before they write.

## Behaviour

1. The calculator sits after the pricing tiers, anchor `#calculator`.
2. The visitor picks one project type (landing, corporate site, shop, bot, AI assistant, automation), any number of add-ons (design, copywriting, second language, CRM integration, analytics) and one support plan (none, 3 months, 12 months).
3. The result panel updates instantly: total in BYN, approximate duration in days (`{days, plural, …}`), a reminder that this is not an offer, and a CTA to the contact section.
4. The calculation is a pure function (`calculateEstimate`) over a typed catalogue; unknown ids throw instead of silently returning zero.
5. "Reset" restores the first type, no add-ons and no support.
6. All labels come from `pricing.calculator.*`; changing a price is a content change, not a code change.
7. The result area is announced with `aria-live="polite"`; groups use fieldset/legend and native inputs.
8. The section works without a server: no API calls, no storage.

## Acceptance criteria

- [x] Price and duration match the pure function for every combination.
- [x] Keyboard-only users can change every option and reach the CTA.
- [x] Reset returns the initial state.
- [x] Unit tests cover base price, options, support and unknown ids.
- [x] The block is readable at 360 px.

## Out of scope

- Binding quotes, discounts, taxes or contracts.
- Sending the calculator result anywhere automatically.

## Verification

`pnpm test`, manual keyboard pass, visual QA screenshots.

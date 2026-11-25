# Contact and brief flow

Status: implemented
Owner: Lead
Related: [privacy](../../src/app/[locale]/privacy/page.tsx) | [decision 0006](../decisions/0006-telegram-handoff-form.md) | [landing page](landing-page.md)

## Problem

The studio works through Telegram and needs qualified briefs without running a backend, storing personal data or adding a CRM.

## Behaviour

1. The contact section shows Telegram, GitHub, location, working hours, response time, availability and the live Minsk time.
2. The brief form collects name, contact, service, budget, task description and consent.
3. Validation is client-side: name and contact are required, consent is required. Errors are announced in place and via `role="alert"`/`aria-invalid`.
4. On submit the form: opens the studio's Telegram chat in a new tab, builds a structured Russian/English/Belarusian message from the form values, copies it to the clipboard, and shows a success state explaining to paste it.
5. If clipboard access fails, the success state says so and links directly to Telegram.
6. No data is sent to a server, stored in a cookie/localStorage or shared with third parties.
7. The consent text links to the privacy page; the privacy page explains that data is only handled in the resulting Telegram conversation.
8. Pop-up blocking is handled gracefully: opening Telegram happens synchronously inside the submit gesture; failure shows an error and keeps the form.

## Acceptance criteria

- [x] Empty name/contact/consent produce localized errors and no navigation.
- [x] A completed form opens Telegram and copies a readable request.
- [x] Keyboard and screen-reader users can operate the form.
- [x] No network request is made by the page itself.
- [x] Privacy page is linked and available in all locales.

## Out of scope

- Server-side lead storage, CRM sync or email delivery.
- File attachments.
- Phone calls or scheduling.

## Verification

Manual test in Chrome and Firefox, clipboard fallback test, keyboard pass, network panel confirms no form request.

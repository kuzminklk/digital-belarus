# 0003 — Message catalogues as the content source

Status: accepted
Date: 2026-11-26

## Context

The same long-form marketing copy appears in three languages across sections, dialogs, cards and forms. Hardcoding Russian strings in components would make translation drift inevitable.

## Decision

Keep every user-facing string or content array in `messages/{ru,be,en}.json`, accessed with `useTranslations`/`getTranslations` or `t.raw()` for arrays and objects. Russian is the source catalogue. Content-shaped data such as case cards, tiers, calculator options and FAQ items lives in the catalogues; only language-independent facts (IDs, URLs, prices, durations) may live in code.

## Consequences

- Translators work in one place; the parity script catches missing keys, changed array lengths and broken ICU placeholders.
- Components are typed against local shapes for `t.raw()` results; no runtime schema validation.
- Large catalogues are loaded once per locale and bundled into the page; the current size is acceptable.
- Structural content changes require updating all three catalogues.

## Alternatives considered

- MDX files — better for long articles, worse for UI labels and structured arrays.
- A headless CMS — unnecessary operational overhead for a single-page studio site.
- Per-component translation files — more files and harder parity checking.

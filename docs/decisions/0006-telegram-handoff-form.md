# 0006 — Client-side brief handed off to Telegram

Status: accepted
Date: 2026-11-26

## Context

The studio communicates through Telegram, has no CRM and does not want to store personal data. A form still needs to feel complete and reliable.

## Decision

Build the brief in the browser from typed values, copy it to the clipboard and open the studio's Telegram chat synchronously on submit. Show a success state that explains the paste step. If clipboard access fails, keep the Telegram link and explain the manual path. No server, no storage, no analytics.

## Consequences

- Zero infrastructure and zero personal-data storage on the site; privacy policy stays simple and truthful.
- The final send is a manual paste, a small UX cost.
- Pop-up blockers and clipboard permissions need graceful handling and testing.
- If the studio later wants automatic delivery, add a serverless endpoint and a new ADR; the form is structured so the payload can be posted instead of copied.

## Alternatives considered

- Mailto link — poor UX with long briefs, unreliable clients.
- Formspree/third-party form SaaS — adds a data processor, consent burden and dependency.
- Serverless Telegram bot delivery — the strongest UX, but requires storing a bot token and a chat id in Vercel env; deferred as an optional next step.

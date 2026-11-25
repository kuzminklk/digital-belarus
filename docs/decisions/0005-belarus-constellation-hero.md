# 0005 — Belarus constellation hero map

Status: accepted
Date: 2026-11-26

## Context

The reference design is an observatory website; the studio is Belarusian. The hero needs a signature visual that fuses both ideas without stock astronomy photos or a generic globe.

## Decision

Draw Belarus as a constellation: a simplified public-domain outline (Natural Earth 1:110m) is projected equirectangularly into an SVG "instrument" with a deterministic starfield, Minsk crosshair, orbit ring, coordinate labels and viewfinder corners. Interaction is limited to a small pointer parallax; reduced motion makes it fully static. The map is decorative (`aria-hidden`), with a readable caption outside it.

## Consequences

- A unique, on-brand hero with no image payload and no third-party assets.
- The map is vector and themeable, but its composition needs visual QA across breakpoints.
- The outline is approximate and not intended for geographic use.
- Adding new map interactions must not jeopardize performance or accessibility.

## Alternatives considered

- A stock night-sky photo — generic, heavy and licensing-sensitive.
- A dotted world map or globe — less specific to Belarus.
- WebGL starfield — overkill, battery-heavy and hard to degrade gracefully.

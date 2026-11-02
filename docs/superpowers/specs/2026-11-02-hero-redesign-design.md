# Hero Redesign — Fixora Customer Portal Home

**Date:** 2026-11-02
**Status:** Approved (direction picked in visual companion session `1793600535`)

## Problem

The homepage hero fails on three axes (user choice: "D — all of the above"):

1. **Generic/flat** — plain white card with no brand moment despite DESIGN.md defining a sage hero surface, `hero-band-dark`, and a 900-weight hero display scale.
2. **Too tall on mobile** — long sub copy plus vertically stacked CTAs push "Browse categories" below the fold at 320–390px.
3. **Awkward illustration crop** — the `hero` scene is hard-cut against the card's right edge at desktop (plant/lamp sliced), reading as an accident.

## Decisions (from user selections)

| Question | Choice |
|---|---|
| Overall scope | Full redesign (copy + layout + art + motion) |
| Direction | **C — Refined white card** (keep white-card-on-sage look, tightened) over dark band (A) and sage-band Wise-style (B) |
| Headline | **B — "Home repairs, done right."** (replaces "Your trusted home service partner") |
| Art panel | **C — existing `hero` scene + floating sticker badges** |

## Design

### Content (top → bottom)

1. **Eyebrow chip:** `VERIFIED HOME SERVICES` — sage `canvas-soft` pill, ink caption text, letter-spaced.
2. **H1:** `Home repairs, done right.` — `.display-lg` (weight 900). "done right." sits on a `#9fe870` highlight behind ink text (marker style). Lime *text* on white is forbidden (fails AA); lime background with ink text passes.
3. **Sub:** `Plumbing, electrical, appliances & repairs — price confirmed before work starts.` — `text-body-lg`, `max-w-md`, `text-body`.
4. **CTAs:** `Book a Repair` (primary LinkButton) + `My bookings` (secondary), existing auth-aware hrefs unchanged. One row ≥390px, `flex-wrap` at 320px.
5. **Art panel:** rounded panel, pale `#e2f6d5` (ServiceArt PALE token), existing `hero` scene rendered with symmetric, intentional framing — clipped by the panel, never against the card edge.
6. **Sticker badges** inside the art panel:
   - Top-left: `✓ Verified techs` — white pill
   - Bottom-right: `From ₹399` — lime pill; amount computed from live catalogue min price (not hardcoded), real data only
   - Style: 2.5px ink border, hard ink offset shadow (~3px), ~-2° rotation, caption/strong size, absolute positioning with safe insets.
7. **No separate trust-chip row** — badges + sub copy already carry the trust claims (avoid redundancy).

### Layout

- **Mobile (<768px):** single column — text block `p-6`, art panel below at ~16:10 aspect (`overflow-hidden relative`). CTAs land above the fold at 390px.
- **Desktop (≥768px):** card stays `grid md:grid-cols-[1.05fr_1fr]` — text left (`p-8`/`lg:p-10`, vertically centered), art panel right filling card height with internal padding and rounded corners so the illustration never touches the card edge.
- Card chrome unchanged: `rounded-xl bg-canvas shadow-card`, `overflow-hidden`.
- Badge positioning must hold at 320 / 390 / 768 / 1440 (insets scale, text may drop to 10–11px at 320).

### Motion

- Staggered fade-up entrance: eyebrow → H1 → sub → CTAs (~200ms each, ~80ms stagger, `ease-out-soft`), CSS keyframes only, gated on `@media (prefers-reduced-motion: no-preference)`.
- No looping badge animation. Existing button arrow hover translate retained.

### Out of scope

- No changes to other homepage sections, `ServiceArt` scenes, or tokens (except no token changes needed — uses existing palette).
- Dark-band (A) and sage-band (B) directions explicitly declined.
- No fabricated ratings, testimonials, or claims (per product.md).

## Verification

1. `npm run lint` — 0 problems.
2. `npm run build` + production start — all routes prerender.
3. Screenshots at 320/390/768/1440, signed-out and authed (`?__auth=1`), reviewed visually.
4. Overflow sweep (`shotkit/sweep.js`) — no horizontal overflow / JS errors.
5. Impeccable detector on `/` (static + URL scan) — clean, using existing `.impeccable/config.json` ignores.

## Risks / notes

- 320px is the tightest case: headline 28px + wrapped sub + wrapped CTAs must still clear the fold — verify by screenshot.
- `From ₹399` must derive from `services` data (`Math.min` of base prices); if catalogue is empty/loading, render the badge only when data exists.
- Sticker hard-shadow style is a new motif on this page — keep it to the two badges only so it stays an accent, not a second design language.

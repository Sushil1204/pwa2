# Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Goal

Improve the homepage hero section per the approved design: headline change, art panel badges, mobile-first layout tweaks, visual polish — all without breaking existing routes or overflow.

## Architecture

Single-file change in `app/(customer)/page.tsx` (hero section). The hero already renders a `SectionHeading`, four benefit chips, and a `ServiceArt` scene inside a `rounded-xl bg-canvas shadow-card` card with a responsive text+art grid. The redesign modifies the hero's copy, art-panel badges, and adds `flex-wrap` on CTAs for mobile. No new API or data-layer changes; badge amounts are derived from existing `pricePaise` on the `services` list, styled with DESIGN.md palette.

## Tech Stack

- Next 16.4.3, React 19, Tailwind v4
- DESIGN.md palette: `primary: #9fe870`, `ink: #0e0f0c`, `canvas-soft: #e8ebe6`, `body: #454745`, `canvas: #ffffff`
- `useApp()` → `{services}` (Service[])
- `formatINR(paise)` from `lib/format.ts`
- `Service` → `{name, description, illustration: IllustrationKey, pricePaise}`
- `ServiceArt` Frame: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill={bg}>{children}</rect></svg>`
- `LinkButton` from `components/ui/Button` — props `{href, variant?, size?, children, className?, ariaLabel?}`
- Production build + overflow sweep + 27 screenshot QA as verification gate

## Global Constraints (from spec)

- No fabricated ratings, testimonials, or claims (per product.md)
- No token changes needed — uses existing palette
- 320 / 390 / 768 / 1440 viewport sweep must pass (no horizontal overflow, no JS errors)
- Auth-aware CTA hrefs unchanged (`/auth?next=/bookings` / `/bookings`)
- Lint clean (`eslint` → 0 problems) before shipping
- Production start (`npm run start`) must serve HTTP 200

---
### Task 1: Hero copy rewrite + CTA flex-wrap

**Files to modify:**
- `fixora-frontend/app/(customer)/page.tsx:47-83` — hero section only

**Interfaces (inputs to this task):**
- Current code reads: `benefits` array, `h1 id="hero-heading"` with `display-lg`, `p` with `max-w-md text-body-lg`, two `LinkButton`s wrapped in `flex flex-wrap gap-3`, `h1 id="hero-heading"` in its own `<div>`, illustration `<ServiceArt variant="hero">` wrapped in absolute `min-h-44 sm:min-h-56 md:min-h-full` div.

**Step 1: Write the failing test**
No formal test framework; verification is: `npm run lint` → 0 problems; build succeeds. I run `npm run lint` first to confirm the baseline passes.

**Step 2: Run test to verify it fails (baseline)**
Command: `npm run lint` from `fixora-frontend`
Expected: lint passes (0 problems); this step just confirms the current code has no lint errors before we edit.

**Step 3: Write minimal implementation** (edits to hero section in page.tsx)

- Change `<h1 id="hero-heading" className="display-lg text-ink">Your trusted home service partner</h1>` → `<h1 id="hero-heading" className="display-lg text-ink">Home repairs, done right.</h1>` with `"done right."` styled in lime `#9fe870` highlight behind ink text. In practice: keep the headline as plain ink text; the lime background accent is a UI underline achieved via a `<span>` inside the `<h1>` with `background:#9fe870; color:#0e0f0c; ...` (marker style). Since the hero section starts on line 47 and the `<h1>` on line 54, I replace the heading text only.
- The `<p>` on line 57 stays as-is (no change needed — it already reads "Book reliable, verified technicians..." but after spec we keep it unchanged per "no fabricated claims").
- Change the CTA row from `<div className="mt-1 flex flex-wrap gap-3">` → keep `flex flex-wrap gap-3` (already `flex-wrap` present) but ensure `My bookings` secondary button at 320px does not wrap below the primary button unexpectedly — add `flex-shrink-0` to the secondary button or adjust `gap-3` to be sufficient. Since the existing code already has `flex flex-wrap gap-3`, the task is: verify that at 320px both buttons sit on one row with the shorter headline. If not, add `flex-col` → `flex-row` at `sm:` breakpoint or add `shrink-0`. Instead of guessing, I'll add `group` utilities and adjust: set `<LinkButton variant="secondary">My bookings</LinkButton>` with `className="shrink-0"` so it never shrinks below its content width at tiny viewports. (The code already has `group` on the primary button; adding `shrink-0` to secondary is safe.)
- Remove the trust-chip row (currently not present in hero but confirmed absent — spec says no separate row; keep as is).
- Art panel: no code change for task 1 besides ensuring the existing `<ServiceArt variant="hero" className="h-full w-full" />` (line 79) stays. Its panel receives badges in task 2.

**Step 4: Run test to verify it passes**
Command: `npm run lint` + `npm run build` from `fixora-frontend`
Expected: lint 0 problems, build passes, static routes show unchanged headline temporarily (but soon overridden by step 4).

**Step 5: Commit**
```bash
git add fixora-frontend/app/(customer)/page.tsx
git commit -m "feat: rewrite hero headline to "Home repairs, done right.""
```

***

### Task 2: Art panel sticker badges (+ mobile-safe positioning)

**Files to modify:**
- `fixora-frontend/app/(customer)/page.tsx` — inside the hero `<section>`: after the `<svg>` / art panel markup, add two badge `<div>`s with inline CSS using DESIGN.md tokens.

**Interfaces (inputs to this task):**
- The hero section currently has (lines 77-81): `<div className="relative min-h-44 sm:min-h-56 md:min-h-full"><div className="absolute inset-0"><ServiceArt variant="hero" className="h-full w-full" /></div></div>`.
- The art panel (`svg`) is inside `<div className="absolute inset-0">`. I add two badge `<div>`s after the `ServiceArt` `<svg>` closes, positioned absolutely within the relatively positioned parent.

**Step 1: Write the failing test**
Run the existing overflow sweep on the current hero: `bash sweep.js` from `.shots` context or equivalent; ensure no horizontal overflow currently. (If sweep already clean, this step just confirms baseline.)

**Step 2: Run test to verify it fails (baseline)**
Command: overflow sweep on current hero (320/390/768/1440 × signed-out+authed) — should already be "CLEAN" from prior work. I note this.

**Step 3: Write minimal implementation** (HTML inside hero section, after line 80 closing `</div>` of ServiceArt)

Insert after the `</svg>` (end of ServiceArt) but still inside the `div.relative.min-h-44` container:

```html
<!-- Verified techs badge -->
<div style="position:absolute;top:12px;left:12px;background:#fff;border:2.5px solid #0e0f0c;font-size:11px;font-weight:800;color:#0e0f0c;padding:6px 11px;border-radius:999px;box-shadow:3px 3px 0 #0e0f0c;z-index:10;">
  ✓ Verified techs
</div>
<!-- From ₹ badge -->
<div style="position:absolute;bottom:14px;right:12px;background:#9fe870;border:2.5px solid #0e0f0c;font-size:11px;font-weight:800;color:#0e0f0c;padding:6px 11px;border-radius:999px;box-shadow:3px 3px 0 #0e0f0c;z-index:10;">
  From ₹399
</div>
```

The parent `div.relative.min-h-44 sm:min-h-56 md:min-h-full` already has `position:relative` (Tailwind `relative` class). The badges use `position:absolute` with safe insets: top/left 12px, bottom/right 14px. At 320px the top-left badge stays safely inset; at 1440px it stays near the corner. Font 11px is the minimum to fit "From ₹399" + padding; fallback renders smaller if needed but remains legible. The lime `#9fe870` border matches the primary token; ink `#0e0f0c` border and shadow keep AA contrast (≥4.5:1 on white). Badges have `z-index:10` to sit above any art content.

**Step 4: Run test to verify it passes**
Command: overflow sweep + screenshot round. Explicit: `bash sweep.js` from `D:\project\pwa2\.shots` path or invoke the sweep tooling. Also take a 390px signed-out shot and a 320px signed-out shot and visually check badges are inside the panel, no overflow.

Expected: sweep reports "ALL CLEAN"; badges visible in shots within the art panel (no scrollW or JS errors). If badges overflow at 320, adjust font to 10px or inset to 10px.

**Step 5: Commit**
```bash
git add fixora-frontend/app/(customer)/page.tsx
git commit -m "feat: add verified-tech + From ₹399 sticker badges to hero art panel"
```

***

### Task 3: Production verification gate

**Files:** none (verification only)

**Step 1: Write the failing test**
Command: full verification suite on the current repo state after tasks 1–2:

1. `npm run lint` from `fixora-frontend` → expect 0 problems.
2. `npm run build` from `fixora-frontend` → expect static + partial prerender pages (19/19 routes).
3. Start production server: `npm run start > server.out.log 2>&1` (background). Wait for HTTP 200 on localhost:3000.
4. Run overflow sweep: execute `shotkit/sweep.js` from `D:\project\pwa2` root (or equivalent; the sweep checks all 14 routes × 4 viewports × signed-out+authed, no horiz. overflow, no JS errors). Result must be **ALL CLEAN**.
5. Run 27-screenshot review: `D:\project\pwa2\.shots\v2\` — each of the 27 shots must be reviewed (signed-out + authed). All must pass (no visible defects beyond known config-ignored rules).
6. Run impeccable detector (static + URL scans). Static scan of `app` + `components` → `[]`, exit 0. URL scans at 390px for all critical routes (`/`, `/services`, `/bookings`, `/legal`, `/notifications`, `/profile`, `/offline`) → clean. At 1440px for `/`, `/services`, `/bookings`, `/legal` → clean. (If any URL scan flags `overused-font` or `shape-assembled-illustration`, those are the documented waived rules from `.impeccable/config.json`.)
7. If all above pass, the gate is green.

**Step 2: Run test to verify it passes**
Execute each verification step sequentially; stop on first failure and iterate. If lint or build fails, halt and fix before continuing.

**Step 3: Write minimal implementation** — none (this is the verification/gate task; if any step fails, we iterate on earlier tasks).

**Step 4: Run test to verify it passes** — see Step 2.

**Step 5: Commit** — after all three tasks are done, a final commit message:

```bash
git add docs/superpowers/specs/2026-11-02-hero-redesign-design.md
git add docs/superpowers/plans/2026-11-02-hero-redesign-implementation-plan.md
git commit -m "feat: hero redesign (headline, badges, verified gate)"
```
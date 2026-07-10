# TacitOS Landing Page — PRD

## Original Problem
User provided their current TacitOS landing HTML (retro "paper & ink + amber phosphor" theme)
and asked to swap the hero and pillar images with two newly-uploaded illustrations:
- Image 1: Retro brass/amber robotic brain machine with notes flowing into intake ports (has baked-in "SCAN.JPG" label)
- Image 2: Open books/notebooks with chat bubbles rising above them
- Image 3: mostly blank/cropped isometric fragment — not used

## Architecture
- **Frontend only** React single-page landing (no backend logic in this task).
- CRA app in `/app/frontend`.
- Assets stored locally at `/app/frontend/src/assets/`:
  - `hero-brain.png` (1.3 MB) — hero image
  - `pillar-1.png` (346 KB) — Ambient Knowledge Capture pillar
  - `pillar-3-tower.png` (117 KB) — unused (image was too cropped)

## Implemented (Jan 2026)
- Ported the full TacitOS landing HTML into React (`src/App.js` + `src/App.css`) as a single component.
- Live clock in menubar, retro CRT boot animation with 5 status lines, install-progress bar via IntersectionObserver, respects `prefers-reduced-motion`.
- Sections: hero, tagline row (scoped/metered/audited/revocable), problem, chat_silos, three pillars, compound line, sources, specs, spend ledger, ownership, install/CTA, taskbar.
- Swapped hero image → new brass robotic brain (no CSS filter; image already amber-toned).
- Swapped pillar-1 image → new books+chat-bubbles illustration (no sepia filter).
- Kept pillars 2 & 3 with existing external URLs + sepia filter (user did not supply usable replacements).
- Removed duplicate overlay `SCAN.JPG` tag on hero (image contains it natively).
- Updated `public/index.html` title + meta description.
- All interactive/critical elements have `data-testid` attributes.

## Backlog / Next Actions
- P1: Generate matching amber-accent line-art illustrations for pillar-2 (Infinitely Scalable Skills) and pillar-3 (Specialist Agents) to fully replace the sepia stock look — the third uploaded image was too cropped to use.
- P2: Implement the interactive "Sources → Robotic Brain pipeline" centerpiece from the design plan (animated SVG pipes filling with amber packets on scroll, brain lobes lighting up).
- P2: Consider `Space Grotesk` / `Inter` typography upgrade per the design plan doc (currently kept as `Special Elite` / `Courier Prime` / `VT323` to preserve the original retro look).
- P3: Add pilot-request backend (FastAPI endpoint) instead of `mailto:` CTA.

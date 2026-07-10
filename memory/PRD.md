# TacitOS Landing Page — PRD

## Original Problem
Port the user's TacitOS landing HTML into React and iterate on visuals — swap hero + pillar
images with user-provided illustrations, build an animated "Sources → Robotic Brain" pipeline
centerpiece, and generate any missing pillar illustrations to match the retro paper + amber theme.

## Architecture
- **Frontend-only** React CRA app in `/app/frontend`.
- Local pillar/hero assets in `/app/frontend/src/assets/`:
  - `hero-brain.png` — brass robotic brain (hero)
  - `pillar-1-final.png` — books + chat bubbles (Ambient Knowledge Capture)
  - `pillar-2-final.png` — modular blueprint cubes (Infinitely Scalable Skills) [generated via Nano Banana]
  - `pillar-3-final.png` — mainframe portal + specialist agents (Specialist Agents)
- All pillar images padded to a uniform 4:3 landscape with cream `#F1EAD6` background so the three cards read as one series.
- Interactive centerpiece component: `/app/frontend/src/components/SourcesBrain.jsx` (inline animated SVG).
- Backend has `EMERGENT_LLM_KEY` in `/app/backend/.env` for Nano Banana image gen.

## Implemented
### Session 1 — image swap + porting
- Full port of TacitOS landing HTML to React (`src/App.js` + `src/App.css`) with boot animation, live clock, sticky menubar, install progress bar.
- Sections: hero, tagline row, problem, chat silos, three pillars, compound line, sources (now interactive), specs, spend ledger, ownership, install/CTA, taskbar.
- Hero swap → brass robotic brain (no filter — image is already amber).

### Session 2 — interactive centerpiece
- `SourcesBrain.jsx`: 4 labeled source nodes → curved SVG pipes → central brain w/ 4 lit lobes → ONLINE indicator → caption reveal.
- Staggered `stroke-dashoffset` transitions + traveling amber packets via CSS motion-path.
- Triggered by `IntersectionObserver` (threshold 0.35). Respects `prefers-reduced-motion` — renders lit final state statically.

### Session 3 — pillar illustrations
- Nano Banana generated pillar-2 (modular blueprint cubes with amber accents) matching the paper + amber aesthetic.
- User provided replacement illustrations for pillar-1 (books) and pillar-3 (specialist agents / mainframe portal).
- Python PIL used to pad portrait uploads to 4:3 landscape with matching `#F1EAD6` background so all three pillar cards align.
- Removed the old external `tacit-knowledge-engine.lovable.app` image URLs and their sepia filter class.

## Backlog / Next Actions
- P2: Wire "TALK TO US" CTAs to a real pilot-request form → FastAPI endpoint → email/CRM (currently `mailto:`).
- P2: Optional typography upgrade to Space Grotesk / Inter per original design plan.
- P3: SEO polish — OG/Twitter card meta, favicon, sitemap.

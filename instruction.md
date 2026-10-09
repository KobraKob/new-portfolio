# INSTRUCTION.md — Portfolio of Balavanth

> You are the implementing engineer. This document is the full brief: who the person is, what the site must feel like, and exactly how to build and ship it. Read all of it before writing any code. Where this file is specific, follow it. Where it is silent, choose the option that is more distinctive, more precise, and more honest, never the more generic one.

---

## 0. The one-paragraph pitch

Balavanth is a geospatial data specialist (about a year inside the Apple Maps program through TCS) who now builds AI tools and writes dark fantasy fiction. He is a cartographer of two kinds of places: **real roads** (lane geometry, map layers, precision data) and **invented worlds** (the continent of Erevan). The portfolio is a **map that happens to be a website**. It has two modes of one world, **Ground** (surveyed, precise, daylight) and **Erevan** (inked, dark, fantasy), and the visitor can flip between them. Everything (layout, motion, type, navigation) is derived from cartography: grids, contours, scale bars, legends, title blocks, waypoints, routes.

**Primary objective: distinction.** A recruiter should remember it a week later. A designer should not be able to say "template" or "AI-generated".

**Secondary objective: it must still work as a portfolio.** Within 10 seconds a visitor must know who he is, what he does, that he is open to work, and how to contact him.

---

## 1. Who he is (source of truth for all content)

### 1.1 Identity
- **Name:** Balavanth
- **Handle:** KobraKob (GitHub). Cobra/snake is a recurring personal motif (his voice assistant is named KOBRA).
- **Base:** Bengaluru, India. **Public site must say only "Bengaluru, India"**, never a neighborhood or street. Use city-level coordinates `12.9716° N, 77.5946° E`.
- **Links:** GitHub `https://github.com/KobraKob` · LinkedIn `https://linkedin.com/in/balavanth`
- **Email / résumé / domain:** not provided → see §14 (placeholders)

### 1.2 Positioning (use this framing everywhere)
> Maps-trained data person who builds AI tools, and writes dark fantasy on the side.

He is job-searching, so the site serves several role tracks at once. Do **not** make three separate sites. Make the narrative flexible:
- Data Analyst
- Operations / Project Coordinator
- Precision mapping / geospatial data roles
- AI builder (early-stage AI startups)

The through-line for every track: **he handles messy, high-stakes data with precision, then builds systems around it.**

### 1.3 Education
- Bachelor of Computer Applications (BCA), recent graduate, CGPA 7.8. (College name: placeholder.)

### 1.4 Experience (public-safe version)
- **TCS (Tata Consultancy Services), Aug 2025 – Aug 2026**, geospatial data specialist, embedded in the **Apple Maps** program (engaged via Altice).
- Worked across map data layers: **Substrate, Drive Coding, Lane Guidance, Substrate Plus**, using the internal tool **FusionX**.
- ⚠️ **Confidentiality rule:** describe the *kind* of work only (map data quality, lane-level road data, layer-based editing, precision and QA). **Do not** invent metrics, do not describe proprietary internal processes, tooling behavior, or datasets in detail. Layer names may appear as light navigational flavor, but write nothing that reads like internal documentation. Flag this to Balavanth in the final handoff so he can confirm he is comfortable with it.

### 1.5 Projects (all built independently, **none have paying customers**; never imply otherwise)

| Project | What it is | Known stack | Honest status |
|---|---|---|---|
| **VAULTIQ** | RAG knowledge base | Backend on HuggingFace Spaces, Vercel frontend | Deployed |
| **KOBRA** | Voice assistant with a custom command layer. Has a v4/v5 multi-agent spec: neural cognitive architecture, unified memory layers, proactive morning-briefing engine | Porcupine (wake word), faster-whisper (STT), edge-tts (TTS), Groq (LLM) | Working; v4/v5 is spec/roadmap |
| **WAZA** | WhatsApp AI agent for Indian small and mid-size businesses | Meta Cloud API, LangChain, FastAPI, Supabase | In build: Phase 1 done (working echo-bot scaffold, live Meta webhook integration) |
| **PRISIM** | Multi-source research agent | LangGraph | Built |
| **MARKETCREW** | Multi-agent content-automation system | CrewAI, SambaNova | Built |
| **WAYWARD** | Adventure app | React Native | Built |

Status labels used on the site must come from this closed set: `DEPLOYED` · `WORKING` · `IN BUILD` · `PROTOTYPE`. Do not upgrade a status. Where a detail is unknown, leave a `TODO:` marker (see §14), never fabricate.

### 1.6 Creative work
- **Novel:** *The Bound and the Hollow*, dark fantasy, set in the world of **Erevan**, protagonist **Roen Dourne**. In progress; it has been through several editorial rounds. A Visual Bible companion document exists.
- Do **not** invent plot, lore, names, or excerpts. The writing section uses a placeholder excerpt block he will fill in.

### 1.7 Personality, interests, values (this is what makes the site *his*)
- Likes **story-driven RPGs**.
- Does **solo travel, including bike trips**. The scroll-as-route concept comes from this.
- Business instinct: **"sell the shovel"**, building tools that enable other businesses (B2B enablement) over consumer gambles.
- Admires **Derek Sivers** and **Pieter Levels**: autonomy, ship small, stay independent. Tone should be direct, unfussy, a little dry. Never corporate, never gushing.
- Builds fast and in public; learning path currently covers FastAPI, Docker, LangChain/LangGraph, RAG pipelines, AWS.

### 1.8 Things that must NOT appear anywhere on the site
Job-search tactics, interview details, company names he applied to or cold-emailed, resignation or "left without an offer" narrative, salary, personal finances, fitness or body data, skincare, exact home neighborhood, any unverified claim or metric, any customer/revenue claim, abandoned side-ideas (hot sauce, Etsy/Shopify automations, AgriOS, etc.) unless he asks later.

---

## 2. Design concept: "Ground / Erevan"

### 2.1 The big idea
The site is a **living survey sheet**. Two states of the same world:

| | **GROUND** | **EREVAN** |
|---|---|---|
| Meaning | Real-world mapping: roads, lanes, precision | Fantasy mapping: ink, landmasses, myth |
| Surface | Warm survey paper | Near-black ink |
| Hero art | Road network: parallel lane strokes, dashed centerlines, lane-guidance arrows, junction nodes | Contour landmass: coastline, hachure hatching, compass rose, marginalia |
| Display type feel | Crisp, upright, low "wonk" | Soft, italic, high "wonk" |
| Mood | Daylight, exacting | Candlelit, mythic |

- A persistent **layer toggle** (label it `GROUND ◐ EREVAN`) swaps the whole site.
- First visit follows `prefers-color-scheme` (light → Ground, dark → Erevan). Persist choice in `localStorage` (wrapped in try/catch).
- The switch is a **circular reveal** expanding from the toggle button using the View Transitions API (`document.startViewTransition`, clip-path circle). Fallback: instant swap with a 200ms opacity fade. **No gradients are used to achieve this.**

### 2.2 Cartographic vocabulary → UI mapping (use these names in the UI)
| Cartography | In the site |
|---|---|
| Sheet / map sheet | Project card (ISO paper ratio 1 : √2 ≈ 1 : 1.414) |
| Title block (bottom-right box on engineering drawings) | Metadata box on every project: NAME / STATUS / STACK / SCALE / SHEET n of N |
| Legend / map key | Skills section |
| Scale bar | Scroll progress + section-length indicator |
| Graticule / grid | Subtle 1px background grid, 12-column aligned |
| Contours | Hero art, section dividers, hover states |
| Waypoint | Project pin / list marker |
| Route | The scroll line that connects sections (solo-bike-trip reference) |
| Compass rose | Toggle ornament and 404 page |
| Marginalia | Small annotations in the margins (italic, ash color) |
| Crosshair + coordinates | Custom cursor readout |

### 2.3 Section names (nav labels, in order)
`00 Index` · `01 Substrate` (about) · `02 Waypoints` (work) · `03 Field Notes` (experience) · `04 Legend` (skills) · `05 Erevan` (writing) · `06 Off-Route` (beyond work) · `07 Transmit` (contact)

Nav is a **vertical rail on desktop** (left edge, mono labels, current section highlighted with a signal-colored tick) and a **bottom sheet menu on mobile** (never a hamburger icon in a corner; use a labeled `MAP` button).

---

## 3. Design system (tokens; implement as CSS custom properties, mirrored in Tailwind config)

### 3.1 Color (60 / 30 / 10 rule, warm neutrals + one hot accent + one cool counterpoint)
Use **flat fills only.** No gradients anywhere (`linear-gradient`, `radial-gradient`, `conic-gradient` are banned in the codebase; add a lint/grep check). Depth comes from hairlines, hatching, offset hard-edged shadows (0 blur), and grain.

**Ground (light)**
```
--bg:            #ECE5D2   /* survey paper, 60% */
--fg:            #12110E   /* ink text, 30% */
--fg-muted:      #5B574D   /* ≈5.7:1 on --bg */
--rule:          rgba(18,17,14,0.16)
--signal:        #D9411E   /* graphics, large type, underlines only */
--signal-text:   #B8300F   /* ≈4.8:1 on --bg, safe for text-size use */
--counter:       #2F7A68   /* verdigris, ≤2% of surface: "live" dots, success */
```
**Erevan (dark)**
```
--bg:            #0F0E0C   /* ink, 60% */
--fg:            #E9E2D0   /* bone, 30% */
--fg-muted:      #9A9384   /* ≈6:1 on --bg */
--rule:          rgba(233,226,208,0.14)
--signal:        #E5481F   /* ≈4.9:1 on --bg, 10% */
--signal-text:   #E5481F
--counter:       #4E9A86
```
Color theory notes for you: warm-neutral base keeps it human and paper-like (not the cold blue-gray of generic dev sites). The vermilion signal is a survey-flag / lane-paint hue, high chroma against low-chroma neutrals so it reads as *information*, not decoration. Verdigris is near-complementary to vermilion, used in tiny doses to signal "live/ok" and to make the vermilion feel hotter by contrast. Never use more than **one** signal element per viewport region.

Add a **SVG feTurbulence grain** overlay at 3–4% opacity (static, not animated, `pointer-events:none`, one layer for the whole page). It is texture, not a gradient.

### 3.2 Typography
Self-host via Fontsource (variable, latin subset, `font-display: swap`, preload the two above-the-fold files).
- **Display:** *Fraunces* (variable, axes `opsz`, `SOFT`, `WONK`). Ground: `SOFT 0, WONK 0`, upright. Erevan: `SOFT 100, WONK 1`, italic on emphasis. Animate the axis transition on toggle (300ms).
- **Body / UI:** *Instrument Sans* (400, 500, 600).
- **Mono (coordinates, labels, title blocks, code):** *JetBrains Mono* (400, 500).
- Do **not** use Inter, Roboto, Space Grotesk, Poppins, or system-ui as the visible face.

**Modular scale: Perfect Fourth (×1.333), base 16px.** Fluid via `clamp()`:
```
--step--1: clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)   /* 12–13  mono labels */
--step-0:  clamp(1rem, 0.96rem + 0.2vw, 1.125rem)        /* 16–18  body */
--step-1:  clamp(1.333rem, 1.2rem + 0.6vw, 1.5rem)
--step-2:  clamp(1.777rem, 1.5rem + 1.2vw, 2.25rem)
--step-3:  clamp(2.369rem, 1.8rem + 2.4vw, 3.375rem)
--step-4:  clamp(3.157rem, 2.2rem + 4vw, 5.063rem)
--step-5:  clamp(4.209rem, 2.5rem + 7vw, 7.594rem)       /* section titles */
--step-6:  clamp(5.5rem, 2rem + 14vw, 13rem)              /* hero name */
```
- Display line-height `0.9–1.0`, tracking `-0.02em`. Body line-height `1.55`. Mono labels: uppercase, tracking `+0.08em`, 12–13px.
- Max measure for paragraphs: `62ch`.
- Hero name is set **oversized and cropped by the viewport edge** on purpose (one deliberate tension point), but must remain readable (the full name appears in the DOM and in an `aria-label`).

### 3.3 Spacing, grid, negative space
- **Base unit 4px; layout rhythm 8px.** Tokens: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256`.
- **Section padding (block):** `clamp(96px, 14vw, 192px)`.
- **Grid:** 12 columns, max content width 1440px (center above that; at 2560 the site must not stretch), side margin `clamp(20px, 4vw, 64px)`, gutter 24px (16px under 640px).
- **Asymmetry on purpose:** default splits are 5/7, 4/8, 3/9, never 6/6. Hero uses a golden split (≈ 1 : 1.618). One element per section may sit **one column off-grid** to create tension; do it deliberately and consistently.
- **Negative space rule:** every section must be **≥ 35% empty**. One idea per screen. If a layout feels full, remove something rather than shrinking it. Empty space is a feature here, framing the content like margin around a map.
- **Hairlines:** 1px for structure, 1.5px for map linework, 3px for emphasis routes. All strokes use `vector-effect: non-scaling-stroke` so linework stays crisp at any zoom/size.
- **Radii:** `0` everywhere (maps are angular), except true circles (cursor, nodes, toggle).
- **Icons:** custom or Lucide restyled to a 24px grid with 1.5px stroke, square caps. No emoji. No filled colorful icons.

### 3.4 Breakpoints
`360 · 640 · 768 · 1024 · 1280 · 1536`. Design **mobile-first at 360px**. Use `svh/dvh` for full-height sections, container queries for cards, and `min()/clamp()` instead of breakpoint jumps where possible. Test at 360, 390, 768, 1024, 1440, 1920, 2560.

### 3.5 Motion
- **Easing tokens:** `--ease-settle: cubic-bezier(0.2, 0.7, 0.1, 1)` (enters), `--ease-snap: cubic-bezier(0.7, 0, 0.2, 1)` (exits, toggles).
- **Durations:** 120 (micro) / 240 (UI) / 480 (reveal) / 800 (hero & transitions). Stagger 40ms.
- **Animate only** `transform`, `opacity`, `clip-path`, and SVG `stroke-dashoffset`. No layout-property animation.
- Text reveals use **clip-path line masks** (the ink is "drawn in"), not generic fade-up on everything.
- `prefers-reduced-motion: reduce` → disable parallax, scrubbing, smooth-scroll, cursor effects; keep simple 150ms fades. Provide this from day one, not as an afterthought.

---

## 4. Signature interactions (these are what make it unforgettable; build all of them)

1. **Hero terrain / road network.** Pre-generate (build-time script, `scripts/generate-terrain.ts`) contour paths from simplex noise via `d3-contour`, exported as static SVG path data. Render in 3 depth layers that parallax against the cursor (multipliers ≈ 0.01 / 0.025 / 0.05, eased with a lerp, rAF-driven). A parallel hand-authored **road network** SVG shares the same coordinate system so the Ground⇄Erevan reveal feels like the same place in two states. Lane strokes are paired parallel lines with dashed centerlines and small lane-guidance arrows that animate along the path (`stroke-dashoffset`) once, then idle.
2. **Crosshair cursor with live coordinates** (fine pointers only, `@media (hover:hover) and (pointer:fine)`). A small circle + crosshair following the pointer with a mono readout of pseudo-lat/long anchored on Bengaluru and drifting with pointer position. The crosshair snaps/enlarges over interactive elements. **Never** hide the native cursor on touch, and never block native text selection.
3. **Scroll = route.** A single SVG route line runs down the page margin and draws with scroll progress (GSAP ScrollTrigger scrub, or CSS scroll-driven animations where supported). Each section is a "stop" with a node that fills when reached. A small scale-bar reads out progress (`SCALE 1:∞ — 34%`). Nod to solo bike trips; do not draw a literal motorcycle clip-art.
4. **Project sheets with title blocks.** Cards are A-ratio sheets. Hover/focus lifts the sheet 4px with a hard-edge offset shadow (0 blur, in `--rule` tone) and draws contour lines inside it. Click performs a **zoom transition** (shared-element / View Transitions) into the case study page: the sheet expands to fill the viewport and the title block stays pinned as the page header.
5. **Command palette** (`⌘K` / `Ctrl+K` / `/`), styled like a terminal in KOBRA's spirit: jump to sections, toggle Ground/Erevan, copy email, open résumé, open GitHub/LinkedIn. Fully keyboard operable, focus-trapped, `Esc` closes. Typing `kobra` anywhere outside inputs triggers a one-time easter egg: a single-line vector cobra glides across the footer rule (SVG path animation, ≤ 2s, once per session).
6. **Erevan writing page-spread.** The writing section is typeset like an open book: two-column spread on desktop, drop cap in Fraunces, ornamental rule, running header "THE BOUND AND THE HOLLOW · EREVAN". Excerpt text reveals line-by-line with the clip-path ink mask. Placeholder text only (see §14).
7. **Live Bengaluru clock** in the footer and contact block (IST, ticking, mono) with a verdigris "live" dot. It is the one place verdigris pulses.
8. **Legend (skills).** Not logos, not bars. A map key: each skill is a symbol + label; the symbol shape encodes status: ● *used in shipped work* · ◐ *working knowledge* · ○ *learning*. Group under cartographic headings (Geospatial data · Data & analysis · AI & agents · Backend · Frontend & mobile · Tooling). Hovering a skill highlights which projects use it (draw thin connector lines to the project waypoints).

Everything above must degrade gracefully: no JS-dependent content blocking (the site must be readable and navigable with JS disabled except for decorative effects).

---

## 5. Page architecture & content spec

### 00 Index (hero)
- Layout: viewport-height. Name `BALAVANTH` in `--step-6`, Fraunces, cropped at the right edge by ~8%. Terrain/road art behind and to the right, occupying the larger golden segment. Text block occupies ≤ 38% of width; the rest is breathing room.
- One-line role under the name (mono + display mix): **"Geospatial data specialist → data analyst & AI builder. Bengaluru."**
- Status chip (verdigris dot): `OPEN TO WORK · Data Analyst · Operations Coordination · Precision Mapping`
- Three actions only: `View work` (primary, signal), `Résumé (PDF)`, `Email`. No fourth button.
- Marginalia in the corner: coordinates, current time, `SHEET 1 OF 8`.
- **No** "Hi, I'm…", no waving emoji, no scroll chevron, no typing-text role loop.

### 01 Substrate (about)
Voice: first person, direct, a little dry. ~120–160 words total. Cover: Apple Maps program experience (precision, layers, QA mindset) → now builds AI tools (voice, RAG, agents) → writes dark fantasy → solo bike trips, story-driven RPGs. End with one line about preferring to build tools other people build on ("I like selling the shovel."). Include a small hand-drawn-feeling SVG marginal note, not a headshot placeholder. (Photo optional: if he supplies one, render it flat, high-contrast, 1-bit threshold style, no rounded corners, no frame.)

### 02 Waypoints (selected work)
- Order: **VAULTIQ, KOBRA, WAZA** (featured, full case studies) then **PRISIM, MARKETCREW, WAYWARD** (compact sheets with link to repo).
- Each sheet's title block: `PROJECT · STATUS · STACK · SHEET n/6 · SCALE` (SCALE is a playful fixed text such as `1:1 PROTOTYPE` / `1:1 DEPLOYED`).
- Case study template (`/work/:slug`): **Problem → Approach → Architecture (inline SVG diagram drawn in the site's linework style) → What broke / what I learned → What's next → Links**. Keep each to ~250–350 words. Use only facts in §1.5; mark everything else `TODO:`.
- KOBRA gets a special touch: a small interactive diagram of the pipeline (wake word → speech-to-text → command layer → LLM → speech out) where hover on each node reveals its tech (Porcupine, faster-whisper, command layer, Groq, edge-tts).
- Always show an honest status tag. Never write "users", "customers", "revenue", or "scaled".

### 03 Field Notes (experience)
- A vertical **route** with stops for TCS · Apple Maps program (Aug 2025 – Aug 2026) and education (BCA). Within the TCS stop, the four layers (Substrate, Drive Coding, Lane Guidance, Substrate Plus) appear as four sub-waypoints with one-line, **non-proprietary** descriptions (see §1.4 confidentiality rule).
- Frame outcomes in transferable terms: accuracy, attention to detail, working in structured data at scale, QA discipline. **No fabricated numbers.**

### 04 Legend (skills) — see §4.8. Only list skills evidenced in §1.5–1.7. Do **not** list SQL, Excel, Power BI, Tableau, or QGIS unless Balavanth confirms (placeholders in §14).

### 05 Erevan (writing)
- Title: *The Bound and the Hollow*. One-sentence premise placeholder (`TODO`), world name Erevan, protagonist Roen Dourne, status "In progress".
- Page-spread layout (see §4.6). Optional small "Visual Bible" gallery slot (placeholder frames, in the site's linework style, until he supplies art).
- In Ground mode this section is the one place that forces a **local dark inversion** (the book is always ink-dark), a deliberate moment of contrast.

### 06 Off-Route (beyond work)
- Three short lines with custom vector marks: solo bike trips · story-driven RPGs · building in public. Optional: a link to a short-form content experiment if he supplies one.
- Tone: personality, not résumé.

### 07 Transmit (contact)
- One giant mailto link in `--step-5` (the email), underlined with a 3px signal rule that draws on hover. Under it: GitHub, LinkedIn, Résumé PDF, copy-email button (with verdigris "copied" confirmation).
- Availability line + live clock. Footer: `© 2026 Balavanth · Bengaluru · 12.9716° N, 77.5946° E`, build stamp, back-to-top as a compass-rose icon.

### Extra routes
- `/work/:slug` case studies · `/404` (a compass rose with a lost needle, copy: "This coordinate isn't on the map.") · `/resume` redirects to the PDF.

---

## 6. Copy rules
- Voice: confident, precise, lightly dry. Short sentences. Concrete nouns. No hype.
- Banned phrases: "passionate", "results-driven", "leveraging", "cutting-edge", "synergy", "innovative solutions", "fast-paced environment", "I love turning ideas into reality", "full-stack ninja", any "journey" metaphor that isn't literally a route.
- Section titles use the cartographic names in §2.3, followed by a plain-language subtitle so recruiters aren't lost (e.g. `02 Waypoints — Selected work`).
- Never fabricate: metrics, testimonials, client names, user counts, awards, dates.
- Sample lines you may use or adapt:
  - Hero: *"I spent a year making maps correct. Now I build systems that make data useful."*
  - Substrate closer: *"I like selling the shovel."*
  - 404: *"This coordinate isn't on the map."*
  - Status: *"Deployed. No customers yet. Honest about it."* (use sparingly, once)

---

## 7. Tech stack (matches his existing preferences; do not substitute without a written reason)
- **Vite + React 18 + TypeScript**, React Router for routes.
- **Tailwind CSS** (tokens from §3 wired into `theme.extend`) + CSS custom properties for the Ground/Erevan themes via `[data-theme="ground|erevan"]` on `<html>`.
- **Motion** (motion.dev) for component/layout/shared-element animation; **GSAP + ScrollTrigger** for the route scrub only; **Lenis** for smooth scroll (disabled under reduced motion; never hijack native scroll on touch).
- **d3-contour + simplex-noise** at build time only (script outputs static JSON/SVG); do not ship them to the client unless needed.
- Libraries like React-Bits / shadcn may be used for **behavior or accessibility primitives only** (dialogs, focus traps, command palette logic). **Do not ship any stock component with its default look.** If a component looks like it came from a library, restyle it until it doesn't.
- Fonts via Fontsource. SVGs optimized with SVGO. Images AVIF/WebP with explicit width/height.
- No UI kit gradients, no Framer-template hero, no particles.js, no Three.js (the effect budget is spent on the SVG terrain).
- Tooling: ESLint, Prettier, `tsc --noEmit`, Playwright for smoke + visual checks, `axe-core` for a11y.

### Suggested structure
```
/public       resume.pdf (placeholder), og.png, favicon.svg, robots.txt, sitemap.xml
/src
  /app        routes, layout, theme provider, view-transition helper
  /components cursor, route-line, sheet-card, title-block, legend, palette, clock, toggle
  /sections   Index, Substrate, Waypoints, FieldNotes, Legend, Erevan, OffRoute, Transmit
  /content    projects.ts, experience.ts, skills.ts, copy.ts   ← all copy lives here, typed
  /styles     tokens.css, themes.css, type.css
  /art        terrain.generated.json, roads.svg, rose.svg, cobra.svg
/scripts      generate-terrain.ts, check-no-gradients.mjs, check-todos.mjs
```
All user-visible text lives in `/content` as typed data so Balavanth can edit without touching components.

---

## 8. Responsiveness (this is a core requirement, not polish)
- **Mobile (≤ 640):** hero art becomes a full-bleed background at `100svh`; name stacks on 2 lines; sheets stack vertically at full width; route line moves to a 2px left-edge rail; command palette opens from a labeled button; cursor effects off; tap targets ≥ 44×44px; bottom-sheet `MAP` nav.
- **Tablet (641–1023):** 8-col grid; sheets 2-up; rail nav collapses to top bar with labeled button.
- **Desktop (≥ 1024):** full 12-col asymmetric layouts, left vertical rail, cursor + parallax.
- **Large (≥ 1920):** cap content at 1440 and let the terrain art extend edge-to-edge; scale type only up to `--step-6` clamp.
- No horizontal scroll at any width. No fixed pixel widths on text containers. Orientation change must not break `svh` layouts.
- Test the Ground⇄Erevan toggle at every breakpoint; layout must **not shift** (CLS ≈ 0) when it flips.

---

## 9. Performance, accessibility, SEO (acceptance gates)
- **Lighthouse (mobile) ≥ 95** in Performance, Accessibility, Best Practices, SEO.
- **LCP < 2.0s**, **CLS < 0.05**, **INP < 150ms**. Initial JS ≤ 180KB gzipped; lazy-load case-study routes and the palette.
- Hero art must be in the HTML/first paint as inline SVG (no waterfall). Parallax runs in one rAF loop and pauses when the tab is hidden or the hero is off-screen (`IntersectionObserver`).
- **WCAG 2.2 AA:** semantic landmarks, skip link, visible 2px focus ring (signal color, 3px offset), full keyboard path, `aria-live="polite"` announcement on layer toggle, meaningful alt text, color is never the only signal, palette is a proper `dialog`.
- **SEO/social:** unique `<title>` and meta description per route, canonical URL, Open Graph + Twitter card with a designed 1200×630 image in the site's style (no gradient), JSON-LD `Person` (name, jobTitle, url, `sameAs` → GitHub + LinkedIn, `addressLocality: Bengaluru`), `sitemap.xml`, `robots.txt`, SVG favicon with `prefers-color-scheme` variants (a crosshair-in-circle monogram "B").

---

## 10. Vercel deployment
- Framework preset: **Vite**. Build `npm run build`, output `dist`, Node 20+.
- `vercel.json`:
  - SPA rewrite: all non-file paths → `/index.html`.
  - Headers: `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` and font files; `public, max-age=0, must-revalidate` on HTML; security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal, a sensible CSP allowing self + Vercel analytics).
  - `/resume` → `/resume.pdf` redirect.
- Add `@vercel/analytics` and `@vercel/speed-insights` (privacy-friendly, no cookie banner needed).
- Preview deployments on every branch; production on `main`. Include a short `README.md` with: run, build, deploy, how to edit content, how to regenerate the terrain art.
- No secrets required. No backend. The contact action is a `mailto:` and copy-to-clipboard (no form, no spam surface).

---

## 11. Anti-patterns (automatic failure if present)
- Any gradient (CSS or SVG `<linearGradient>/<radialGradient>`), glow, glassmorphism, backdrop-blur cards, neon, mesh blobs, floating orbs.
- Purple/blue "AI" palette. Dark-mode-only with generic gray cards.
- Centered hero with name, tagline, and two rounded pill buttons.
- Three-up feature cards with icons. Skill progress bars. Logo soup. Testimonial carousel.
- Fade-up-on-everything scroll animation. Bouncy spring animations on layout.
- Typewriter text loops. Particles. Scroll-down chevron.
- Stock illustrations, emoji as icons, lorem ipsum, "Coming soon" sections.
- Rounded-xl everything. Drop shadows with blur.
- Any claim not traceable to §1.

---

## 12. Build order & per-phase acceptance
1. **Foundation:** repo, tokens, themes, fonts, grid, type scale, lint scripts (no-gradient, no-TODO-in-prod). *Accept:* a style-guide route renders every token in both themes.
2. **Static layout of all sections** with real content from `/content`, both themes, all breakpoints, **no motion yet**. *Accept:* it already looks distinctive in a screenshot.
3. **Hero art + toggle + view-transition reveal.** *Accept:* CLS ≈ 0 on toggle; works without JS for first paint.
4. **Route line, sheet cards, title blocks, case-study transitions.**
5. **Cursor, command palette, clock, Legend connectors, easter egg.**
6. **Erevan page-spread** with placeholder excerpt.
7. **A11y + reduced-motion + keyboard pass** (axe clean, manual keyboard run-through).
8. **Performance pass** to hit §9 gates; **SEO/OG/JSON-LD**; **Vercel deploy** and verify on real devices.
9. **Handoff:** list every `TODO:` remaining, the confidentiality flag from §1.4, and Lighthouse + axe reports.

Do not move to the next phase until the current one meets its acceptance line.

---

## 13. Definition of done
- [ ] Looks unmistakably *authored*: someone shown a screenshot cannot call it a template
- [ ] Ground⇄Erevan toggle works everywhere, persists, no layout shift
- [ ] All eight signature interactions (§4) work, with reduced-motion and touch fallbacks
- [ ] Zero gradients (script passes), zero fabricated claims, honest status tags only
- [ ] Works and looks intentional at 360 / 768 / 1024 / 1440 / 2560
- [ ] Lighthouse mobile ≥ 95 ×4, axe has 0 serious violations
- [ ] Deployed on Vercel with preview + production, OG image verified in a link-preview tool
- [ ] All copy editable from `/content`; README explains how

---

## 14. Placeholders Balavanth must supply (render as `TODO:` in dev, and **fail the production build if any remain**; see `scripts/check-todos.mjs`)
- Email address (for mailto + JSON-LD)
- Résumé PDF (`/public/resume.pdf`)
- Custom domain, if any
- College name (BCA)
- Repo/demo links for each project (VAULTIQ live URL, KOBRA repo, WAZA, PRISIM, MARKETCREW, WAYWARD)
- Two or three honest sentences per project: the problem, one thing that broke, what he'd do next (for case studies)
- Original excerpt + one-sentence premise for *The Bound and the Hollow* (and any Visual Bible art he wants shown)
- Optional: portrait photo; confirmation of data-analysis skills (SQL, Excel, Power BI, Tableau, QGIS) before they are listed
- Confirmation he is comfortable with the Apple Maps / TCS description in §1.4

---

*End of brief. Build it like a map: precise at the edges, generous in the margins, and with one place on it that nobody else has drawn.*

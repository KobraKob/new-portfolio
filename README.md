# Balavanth Portfolio

A distinctive portfolio site built as a living survey sheet with two modes: **Ground** (surveyed, precise, daylight) and **Erevan** (inked, dark, fantasy).

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── app/                 # App-level: routing, theme, view transitions
├── components/          # Reusable UI components
├── sections/            # Page sections (Index, Substrate, Waypoints, etc.)
├── content/             # All copy and data (projects, experience, skills, copy)
├── styles/              # CSS tokens, themes, typography
├── lib/                 # Utilities
└── art/                 # Generated terrain, SVGs
scripts/
├── generate-terrain.ts  # Build-time terrain generation
├── check-no-gradients.mjs  # Lint: no gradients allowed
└── check-todos.mjs      # Build fails if TODO: markers remain
public/
├── favicon.svg          # Theme-aware favicon
├── og.png               # Open Graph image (1200x630)
├── robots.txt
├── sitemap.xml
└── resume.pdf           # Placeholder - replace with actual PDF
```

## Editing Content

All user-visible text lives in `src/content/`:

- **projects.ts** — Project data, case study content
- **experience.ts** — Work history and education
- **skills.ts** — Skills with cartographic symbols
- **copy.ts** — All UI copy, nav labels, meta data

Edit these files to update the site without touching components.

## Theme System

Two themes via `[data-theme="ground|erevan"]` on `<html>`:

- **Ground** — Warm survey paper (`#ECE5D2`), vermilion signal (`#D9411E`)
- **Erevan** — Near-black ink (`#0F0E0C`), vermilion signal (`#E5481F`)

Toggle persists in `localStorage`. First visit follows `prefers-color-scheme`.

## Fonts

Self-hosted via Fontsource (variable, latin subset, `font-display: swap`):

- **Fraunces** (display) — axes: `opsz`, `SOFT`, `WONK`
- **Instrument Sans** (body/UI) — weights: 400, 500, 600
- **JetBrains Mono** (mono) — weights: 400, 500

Preloads: Fraunces regular + italic for above-the-fold.

## Signature Interactions

1. **Hero terrain/road network** — SVG parallax layers, lane strokes with animated dashed centerlines
2. **Crosshair cursor** — Live pseudo-coordinates anchored on Bengaluru
3. **Scroll route** — SVG line draws with scroll progress, section nodes
4. **Project sheets** — ISO-ratio cards with title blocks, zoom transition to case studies
5. **Command palette** — `⌘K`/`Ctrl+K`/`/` with KOBRA easter egg
6. **Erevan page-spread** — Two-column book layout, clip-path ink reveal
7. **Live IST clock** — Verdigris pulse dot in footer and contact
8. **Legend connectors** — Hover skill → thin lines to project waypoints

## Build-Time Generation

```bash
# Generate terrain contours (outputs to src/art/terrain.generated.json)
npm run generate:terrain
```

## Lint Checks

```bash
# Check for forbidden gradients
npm run check:gradients

# Check for remaining TODO: markers (fails production build)
npm run check:todos
```

## Deployment

**Vercel** (recommended):
- Framework preset: Vite
- Build: `npm run build`
- Output: `dist`
- Node: 20+
- `vercel.json` handles SPA rewrites, caching, security headers

Add `@vercel/analytics` and `@vercel/speed-insights` for privacy-friendly analytics.

## Performance Targets

- Lighthouse mobile ≥ 95 ×4
- LCP < 2.0s, CLS < 0.05, INP < 150ms
- Initial JS ≤ 180KB gzipped
- Hero art inline in HTML (no waterfall)

## Accessibility

- WCAG 2.2 AA
- Semantic landmarks, skip link
- Visible focus rings (signal color, 3px offset)
- Full keyboard navigation
- `aria-live` on theme toggle
- `prefers-reduced-motion` respected

## Placeholders to Replace

Before production, replace in `src/content/` and `public/`:

- Email address (mailto + JSON-LD)
- Résumé PDF (`public/resume.pdf`)
- Custom domain (if any)
- College name (BCA)
- Repo/demo links for each project
- 2-3 honest sentences per project for case studies
- Novel excerpt + premise for *The Bound and the Hollow*
- Optional: portrait photo; data-analysis skills confirmation
- Apple Maps/TCS description confirmation

Run `npm run check:todos` to verify all placeholders resolved.

## License

MIT
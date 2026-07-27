# portfolio-astryx

Personal portfolio for Mohamed Senator — Cloud & DevOps Support Engineer.

Built with Vite + React + TypeScript on Meta's Astryx design system
(`@astryxdesign/core` + `@astryxdesign/theme-neutral`). Astryx ships pre-built
CSS/JS — no build plugins needed. The neutral theme is applied via the `Theme`
provider and its tokens are overridden in `src/index.css` for the custom
editorial palette (near-white paper, hairlines, olive accent).

## Setup

```bash
npm install
npm run dev        # vite dev server (accepts -- --host --port)
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

## Deploy to Vercel

Import the repo in Vercel — it auto-detects Vite:

- Build command: `npm run build`
- Output directory: `dist`
- No `vercel.json` needed (single page, no client-side routing).

## Notes

- `public/Mohamed_Senator_CV_2026.pdf` is served as the downloadable CV —
  replace it when the CV changes.
- Astryx component docs are available locally:
  `node node_modules/@astryxdesign/core/docs.mjs --list`

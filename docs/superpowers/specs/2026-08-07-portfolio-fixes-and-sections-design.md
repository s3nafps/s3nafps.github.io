# Portfolio: Fixes & New Content Sections — Design

**Date:** 2026-08-07
**Status:** Approved (brainstorming session)
**Related:** `docs/superpowers/specs/2026-07-29-clean-astryx-portfolio-design.md`

## Context

The Clean Astryx portfolio is live: build + contract tests pass, all six sections
render correctly, theme/mobile/a11y verified in-browser. An audit found five
issues and the owner chose scope **B**: fix the issues plus add a Projects section
and a Certifications section.

## Goals

1. Fix the CV pipeline disconnect (generator output ≠ served file).
2. Add SEO/social metadata, robots, sitemap, structured data.
3. Add GitHub Actions CI enforcing lint → test → build.
4. Trim the JS bundle by dropping framer-motion.
5. Add Projects and Certifications sections with real content.

Non-goals: testimonials (declined), blog, analytics, contact form, error
boundary (YAGNI — static site with no throw paths).

---

## 1. CV pipeline

**Problem:** `cv/generate_cv_pdf.py` writes `public/Mohamed_Senator_CV_2026.pdf`
(primary) + `public/Mohamed_Senator_CV.pdf` (legacy), but the site serves
`public/Mohamed_Senator_Master_CV.pdf` — a stale file nothing generates.
README and `cv/README.md` reference filenames that are not served.

**Changes:**
- `cv/generate_cv_pdf.py`: change `PRIMARY_PDF` to
  `ROOT / "public" / "Mohamed_Senator_Master_CV.pdf"` (the name `App.tsx`
  serves). Keep `LEGACY_PDF` as-is.
- `README.md`: replace the stale `Mohamed_Senator_CV_2026.pdf` note with the
  real served filename (`public/Mohamed_Senator_Master_CV.pdf`).
- `cv/README.md`: update the outputs list to match the generator.
- Move orphaned root files `Mohamed Senator CV.pdf` and `Mohamed Senator CV.tex`
  into `cv/` (single home for CV sources).

**Result:** running the generator updates what visitors download.

## 2. SEO / social metadata

All in `index.html` head, unless noted:

- `<meta property="og:title">`, `og:description`, `og:type=website`,
  `og:url=https://mohamedsenator.vercel.app/`, `og:image=/og.png`
- Twitter card: `summary_large_image` + `twitter:title/description/image`
- `<link rel="canonical" href="https://mohamedsenator.vercel.app/">`
- JSON-LD `Person` script: name "Mohamed Senator", `jobTitle` "Systems
  Administrator / Cloud Infrastructure & Automation", `email`,
  `sameAs` → LinkedIn + GitHub, `address` Algiers, Algeria
- `public/robots.txt`: allow all, point to sitemap
- `public/sitemap.xml`: single URL `https://mohamedsenator.vercel.app/`
- `public/og.png`: 1200×630, name + role, paper palette (`#f5f3ed` / `#1a1d18` /
  olive `#536141`), DM Mono eyebrow + Inter title — matches the site identity

## 3. CI — GitHub Actions

New `.github/workflows/ci.yml`:

- Trigger: `push` (main) + `pull_request`
- pnpm (repo uses `pnpm-lock.yaml`): setup via `pnpm/action-setup` +
  `actions/setup-node`, then `pnpm install --frozen-lockfile`
- Steps: `pnpm run lint` → `pnpm test` → `pnpm run build`
- Add `packageManager` field to `package.json` (pnpm, matching lockfile) for
  corepack determinism

Wire the dormant oxlint config:
- Add `oxlint` to `devDependencies`
- `package.json` script: `"lint": "oxlint && tsc -b"` (config `.oxlintrc.json`
  already exists and is valid)

## 4. Bundle trim — drop framer-motion

Replace all framer-motion usage in `src/App.tsx`:

- Delete `import { motion } from 'framer-motion'`
- `Reveal`: custom `useReveal` hook (IntersectionObserver, `once: true`,
  `threshold: 0.2`) toggling a `.is-visible` class; CSS transition
  `opacity 0.55s ease-out` + `translateY(20px→0)`, guarded by
  `prefers-reduced-motion: reduce` (already handled globally in `index.css`)
- Timeline `motion.li` → same hook, per-item transition-delay via inline style
  (`index * 0.04s`), skipped under reduced motion
- Remove `framer-motion` from `dependencies`

Expected: JS ~390 kB → ~200 kB (gzip ~124 kB → ~50 kB).

## 5. Projects section

Placement: after `#experience`, before `#approach`. Nav gains a "Projects"
link (desktop + mobile).

Layout C (approved): one featured card + two compact rows.

**Featured (full-width, open source):**
- Eyebrow: "Featured · Open source"
- Title: ForecastFoundry
- Copy: "Paper-first prediction-market research and execution engine — CLI,
  REST/OpenAPI, and MCP server."
- Tags: Python · FastAPI · MCP · Alembic · Docker
- Link: `https://github.com/s3nafps/ForecastFoundry` (external, arrow icon)

**Compact rows (internal — no links):**
- *Automated Health-Check Suite* — tags `PowerShell · Scheduled tasks` —
  "Weekly infrastructure health checks cut from ~3 hours to ~5 minutes (~97%)
  with consistent, accurate results." (AGCE)
- *Ops & Audit Dashboards* — tags `PowerShell · Reporting` — "Dashboards for
  management, cybersecurity, and audit teams in an air-gapped environment."
  (AGCE)

Data model in `src/content.ts`:

```ts
export type Project = {
  number: string
  title: string
  description: string
  tags: string[]
  href?: string   // external link; undefined for internal work
  featured: boolean
  context?: string  // e.g. 'AGCE'
}
```

`projects: Project[]` — 1 featured + 2 internal. Contract tests assert the
featured entry links to ForecastFoundry and internal entries have no `href`.

## 6. Certifications section

Placement: after `#approach`, before `#contact`. Slim single row (ACE only —
owner decision).

- Title: Google Cloud Associate Cloud Engineer (ACE)
- Issuer: Google Cloud
- No year, no credential URL (none provided — nothing fabricated)

Data model:

```ts
export type Certification = { title: string; issuer: string; url?: string }
export const certifications: Certification[]
```

## 7. Robustness / cleanup

- `<noscript>` fallback in `index.html`: brief text + mailto link
- No error boundary (non-goal)
- Root CV files consolidated into `cv/` (see §1)

## 8. Tests & verification

- `src/content.test.ts`: assert `projects.length === 3`, featured flag set,
  no `href` on internal entries, `certifications` non-empty with issuer
- `src/portfolio.test.ts`: assert section markers `id="projects"`,
  `id="certifications"` in order; nav includes "Projects"; meta tags exist in
  `index.html` (og:title, canonical, JSON-LD `Person`); framer-motion absent
  from `package.json`/`App.tsx`; `noscript` present
- Verification: `npm run lint` (oxlint + tsc), `npm test`, `npm run build`,
  live preview of both new sections (desktop + mobile, light + dark)

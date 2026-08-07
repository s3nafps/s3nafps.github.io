# portfolio-astryx

My portfolio — I'm **Mohamed Senator**, Systems Administrator / Cloud
Infrastructure & Automation. This is my resume site, and this README is my own
runbook: my box, my gates, my on-call. I keep it in the first person because
there is no handover — I am the only admin here.

Treat this like production. It is. Changes to `main` propagate to the live
site automatically. There is no staging environment, no canary, no rollback
button — **rollback is `git revert` and a redeploy**. Act accordingly.

---

## Service status

| Check | State | Gate |
|---|---|---|
| Type-check + lint (oxlint) | GREEN | `npm run lint` |
| Contract tests | GREEN | `npm test` |
| Production build | GREEN | `npm run build` |
| CI (GitHub Actions, push/PR to main) | GREEN since 2026-08-07 | `.github/workflows/ci.yml` |
| Live site | verified in-browser 2026-08-07 (desktop + mobile, light/dark) | manual smoke |

Sections served: hero · proof rail · capabilities · experience · projects ·
approach · certifications · contact.

---

## System overview

- **Stack:** Vite 8 + React 19 + TypeScript, Meta's Astryx design system
  (`@astryxdesign/core` + `@astryxdesign/theme-neutral`), Tailwind, lucide icons.
- **Package manager:** pnpm 10 (`packageManager` pinned in `package.json`;
  lockfile is the single source of truth — never install without it).
- **Content is data, not markup:** all copy lives in `src/content.ts` as typed
  arrays (`capabilities`, `experience`, `projects`, `certifications`). Edit data,
  not JSX. Contract tests in `src/content.test.ts` will reject structural drift.
- **Palette/tokens:** overridden in `src/index.css` (`:root` +
  `[data-theme='dark']`) — near-white paper, hairlines, olive accent.
- **Motion:** IntersectionObserver-based reveal (`useReveal` in `src/App.tsx`),
  CSS transitions, reduced-motion respected. No animation framework on the box.

---

## Provisioning (first checkout)

```bash
pnpm install --frozen-lockfile
```

`npm install` is not used locally and should not be. If the lockfile and
`package.json` disagree, the install fails — that is a feature.

---

## Standard runbook

| Command | Purpose |
|---|---|
| `npm run dev -- --port 5173` | local dev server |
| `npm run lint` | oxlint + `tsc -b`. **Gate.** Exit non-zero = do not ship |
| `npm test` | contract tests. **Gate.** |
| `npm run build` | production build to `dist/` |
| `npm run preview` | serve `dist/` locally, verify the artifact, then throw it away |

### Change control checklist

1. `pnpm install --frozen-lockfile` — sync state.
2. Edit `src/content.ts` (content) or `src/App.tsx` / `src/index.css` (behavior).
3. Run **all three gates**: `npm run lint`, `npm test`, `npm run build`.
4. Smoke the live dev server: desktop, mobile (~390px), light + dark theme.
5. Commit, push, **watch GitHub Actions**. Green means it deploys.

---

## Content operations

### CV regeneration

The served CV (`public/Mohamed_Senator_Master_CV.pdf`) is **generated, not
hand-edited**. Edit the data in `cv/generate_cv_pdf.py`, then:

```powershell
python .\cv\generate_cv_pdf.py
```

Requirements: Python + reportlab. The exact interpreter used on this machine is
documented in `cv/README.md`. Outputs: the served PDF plus a legacy
`public/Mohamed_Senator_CV.pdf` copy (untracked by design).

**Incident log — 2026-08-07:** served CV was not produced by any generator
(hand-built binary served under a name nothing generated). Root cause: pipeline
rot. Resolution: generator repointed at the served filename; headline aligned
with site identity ("Systems Administrator / Cloud Infrastructure &
Automation"). Prevention: `npm test` — the contract test now pins the served
CV path in the app.

### OpenGraph image

```powershell
python .\cv\generate_og_image.py
```

Requires Pillow. Regenerates `public/og.png` (1200×630) on the site palette
from the current name/role strings.

### Content editing cheat-sheet

| What | Where |
|---|---|
| Sections, order, nav | `src/App.tsx` |
| Capabilities / experience / projects / certifications | `src/content.ts` |
| Tokens, layout, responsive breakpoints | `src/index.css` |
| Head meta, OG/Twitter, JSON-LD, noscript | `index.html` |

---

## CI

`.github/workflows/ci.yml` runs on push to `main` and every PR:
`pnpm install --frozen-lockfile` → `lint` → `test` → `build`.

No deploy step in CI. Deployment is handled by the hosting provider on a
successful push to `main`.

## Deploy

Vercel, auto-deploy from `main` (`vercel.json`: build `npm run build`, output
`dist`). Single page, no client-side routing, no special config.

---

## Known caveats (accepted risk, tracked)

- **`vercel.json` installs with `npm`**, not pnpm — Vercel resolves
  dependencies without the lockfile. Working, but a drift risk vs. CI's frozen
  pnpm install. If a deploy starts resolving differently than local, this is
  the first suspect.
- **SEO target is `mohamedsenator.vercel.app`** (canonical, og:url, robots,
  sitemap). The git remote is `s3nafps/s3nafps.github.io`. If the site is ever
  served from GitHub Pages instead, update `index.html`, `robots.txt`, and
  `sitemap.xml` — and make `og:image` an absolute URL while you're in there.
- **Legacy `public/Mohamed_Senator_CV.pdf`** is generated untracked after every
  CV run. Decide: gitignore it or commit it. Current status: accepted.
- Featured project's "View on GitHub" link has no dedicated hover/focus style
  (inherits defaults). Cosmetic, not a defect.

---

## Maintenance notes

- Astryx component docs ship locally:
  `node node_modules/@astryxdesign/core/docs.mjs --list`
- Keep the CV generator and the site's hero/JSON-LD title in lockstep — the
  2026-08-07 incident was exactly that drift.
- No error boundary on the box (static site, no throw paths). If a runtime
  error ever surfaces in the wild, add one — until then it is scope creep.

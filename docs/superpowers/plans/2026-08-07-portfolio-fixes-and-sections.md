# Portfolio Fixes & New Sections — Implementation Plan

> **For AI-agent implementers:** execute this plan task-by-task with `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans`. Steps use checkboxes (`- [ ]`) to track progress.

**Goal:** Fix the CV pipeline disconnect, add SEO/social metadata, wire CI, drop framer-motion to trim the bundle, and add Projects + Certifications sections to the portfolio.

**Architecture:** All site content lives in `src/content.ts` (typed data) rendered by `src/App.tsx` against CSS in `src/index.css`. Fixes touch `cv/generate_cv_pdf.py`, `index.html`, `package.json`, `.github/workflows/ci.yml`, and `public/`. Contract tests in `src/content.test.ts` + `src/portfolio.test.ts` assert structure; CI runs lint → test → build.

**Tech stack:** Vite 8 + React 19 + TypeScript, Astryx design system, pnpm 9 (lockfile v9), GitHub Actions, Python (Pillow 12) for the OG image.

**Design spec:** `docs/superpowers/specs/2026-08-07-portfolio-fixes-and-sections-design.md`

---

## File structure

| File | Responsibility |
|---|---|
| `cv/generate_cv_pdf.py` | (modify) CV generator — PRIMARY_PDF → served filename |
| `cv/generate_og_image.py` | (create) Pillow script → `public/og.png` |
| `cv/README.md` | (modify) outputs list matches generator |
| `README.md` | (modify) stale CV filename note |
| `cv/Mohamed Senator CV.pdf`, `cv/Mohamed Senator CV.tex` | (move from root) orphaned CV sources |
| `index.html` | (modify) OG/Twitter/canonical/JSON-LD meta + noscript |
| `public/robots.txt`, `public/sitemap.xml`, `public/og.png` | (create) SEO assets |
| `package.json` | (modify) packageManager, lint script, drop framer-motion, add oxlint |
| `.github/workflows/ci.yml` | (create) lint → test → build |
| `src/content.ts` | (modify) `projects`, `certifications` data + types |
| `src/App.tsx` | (modify) Reveal hook (no framer-motion), Projects + Certifications sections, nav link |
| `src/index.css` | (modify) `.reveal`, projects, certifications styles |
| `src/content.test.ts` | (modify) assert new data shape |
| `src/portfolio.test.ts` | (modify) assert new sections/meta/absence of framer-motion |

---

## Task 1: Fix the CV pipeline

**Files:** `cv/generate_cv_pdf.py:20`, `cv/README.md`, `README.md:30`, root → `cv/` moves

- [ ] **Step 1: Point the generator at the served filename**

In `cv/generate_cv_pdf.py` line 20, change:

```python
PRIMARY_PDF = ROOT / "public" / "Mohamed_Senator_CV_2026.pdf"
```

to:

```python
PRIMARY_PDF = ROOT / "public" / "Mohamed_Senator_Master_CV.pdf"
```

- [ ] **Step 2: Regenerate the PDF and verify**

Run (the codex-runtime python is the one with reportlab):

```powershell
& 'C:\Users\s3nafps\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\cv\generate_cv_pdf.py
```

Verify: `Test-Path public/Mohamed_Senator_Master_CV.pdf` → True, and its LastWriteTime is now (freshly generated).

- [ ] **Step 3: Update docs to the real filenames**

`cv/README.md` — replace the "Outputs:" block:

```markdown
Outputs:

- `public/Mohamed_Senator_Master_CV.pdf` (served by the site)
- `public/Mohamed_Senator_CV.pdf` (legacy copy)
```

`README.md` line 30 — replace the note:

```markdown
- `public/Mohamed_Senator_Master_CV.pdf` is served as the downloadable CV —
  regenerate it with `cv/generate_cv_pdf.py` when the CV changes.
```

- [ ] **Step 4: Move orphaned root CV files into `cv/`**

```bash
git mv "Mohamed Senator CV.pdf" "cv/Mohamed Senator CV.pdf"
git mv "Mohamed Senator CV.tex" "cv/Mohamed Senator CV.tex"
```

- [ ] **Step 5: Verify + commit**

```powershell
npm test
```

Expected: both contract tests pass. Then:

```bash
git add cv/ README.md public/Mohamed_Senator_Master_CV.pdf
git commit -m "fix(cv): generate the served CV filename"
```

---

## Task 2: Generate the OG image

**Files:** create `cv/generate_og_image.py` + `public/og.png`

- [ ] **Step 1: Write the generator script**

Create `cv/generate_og_image.py`:

```python
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og.png"
W, H = 1200, 630
BG = (245, 243, 237)
INK = (26, 29, 24)
ACCENT = (83, 97, 65)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    win = os.environ.get("WINDIR", r"C:\Windows")
    candidates = [
        os.path.join(win, "Fonts", "segoeuib.ttf" if bold else "segoeui.ttf"),
        os.path.join(win, "Fonts", "arialbd.ttf" if bold else "arial.ttf"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)
draw.text(
    (80, 84),
    "SYSTEMS ADMINISTRATOR · CLOUD INFRASTRUCTURE & AUTOMATION",
    font=font(26, bold=True),
    fill=ACCENT,
)
draw.text((80, 320), "Mohamed Senator", font=font(92, bold=True), fill=INK)
draw.rectangle([80, 508, 1120, 512], fill=ACCENT)
draw.text((80, 548), "Reliable systems. Clear operations.", font=font(36), fill=INK)
img.save(OUT, "PNG")
print(f"wrote {OUT} ({W}x{H})")
```

- [ ] **Step 2: Run it and verify dimensions**

```powershell
python .\cv\generate_og_image.py
python -c "from PIL import Image; im = Image.open('public/og.png'); print(im.size); assert im.size == (1200, 630)"
```

Expected: `(1200, 630)`.

- [ ] **Step 3: Commit**

```bash
git add cv/generate_og_image.py public/og.png
git commit -m "feat(seo): generate 1200x630 OpenGraph image"
```

---

## Task 3: SEO / social metadata

**Files:** `index.html`, create `public/robots.txt`, `public/sitemap.xml`, modify `src/portfolio.test.ts`

- [ ] **Step 1: Write failing test assertions**

In `src/portfolio.test.ts`, after the existing `assert.match(html, /<title>Mohamed Senator<\/title>/)` line, add:

```ts
const metaChecks: Array<[string, RegExp]> = [
  ['og:title', /og:title/],
  ['og:description', /og:description/],
  ['og:type', /og:type/],
  ['og:url', /og:url/],
  ['og:image', /og:image/],
  ['twitter card', /twitter:card/],
  ['canonical', /rel="canonical"/],
  ['JSON-LD Person', /"@type":\s*"Person"/],
  ['noscript', /<noscript>/],
]
for (const [name, pattern] of metaChecks) {
  assert.match(html, pattern, `${name} meta must exist in index.html`)
}
```

And after the existing image-loop assertions, add:

```ts
for (const file of ['robots.txt', 'sitemap.xml', 'og.png']) {
  assert.ok(
    existsSync(new URL(`../public/${file}`, import.meta.url)),
    `${file} must exist in public/`,
  )
}
```

- [ ] **Step 2: Run tests — expect failure**

```powershell
npm test
```

Expected: `Portfolio structure check passed` no longer printed — assertion errors for the first missing meta tag.

- [ ] **Step 3: Add meta tags + noscript to `index.html`**

Inside `<head>`, after the existing description meta, add:

```html
    <meta property="og:title" content="Mohamed Senator — Systems Administrator & Cloud Engineer" />
    <meta property="og:description" content="Systems Administrator focused on cloud infrastructure, PowerShell automation, and reliable IT operations." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://mohamedsenator.vercel.app/" />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Mohamed Senator — Systems Administrator & Cloud Engineer" />
    <meta name="twitter:description" content="Systems Administrator focused on cloud infrastructure, PowerShell automation, and reliable IT operations." />
    <meta name="twitter:image" content="/og.png" />
    <link rel="canonical" href="https://mohamedsenator.vercel.app/" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Mohamed Senator",
        "jobTitle": "Systems Administrator / Cloud Infrastructure & Automation",
        "email": "mailto:mohamed.senator@icloud.com",
        "address": { "@type": "PostalAddress", "addressLocality": "Algiers", "addressCountry": "DZ" },
        "sameAs": [
          "https://linkedin.com/in/mohamedsenator",
          "https://github.com/s3nafps"
        ]
      }
    </script>
```

Inside `<body>`, right after `<div id="root"></div>`, add:

```html
    <noscript>
      <p style="font-family: sans-serif; padding: 24px; text-align: center;">
        This portfolio needs JavaScript. Contact Mohamed at
        <a href="mailto:mohamed.senator@icloud.com">mohamed.senator@icloud.com</a>.
      </p>
    </noscript>
```

- [ ] **Step 4: Create `public/robots.txt`**

```text
User-agent: *
Allow: /

Sitemap: https://mohamedsenator.vercel.app/sitemap.xml
```

- [ ] **Step 5: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mohamedsenator.vercel.app/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 6: Run tests — expect pass**

```powershell
npm test
```

Expected: `CV content check passed` then `Portfolio structure check passed`.

- [ ] **Step 7: Commit**

```bash
git add index.html public/robots.txt public/sitemap.xml src/portfolio.test.ts
git commit -m "feat(seo): add OpenGraph, canonical, JSON-LD, robots, sitemap"
```

---

## Task 4: CI, oxlint, packageManager

**Files:** create `.github/workflows/ci.yml`, modify `package.json`

- [ ] **Step 1: Add `packageManager` to `package.json`**

In `package.json`, after `"private": true,`, add:

```json
  "packageManager": "pnpm@9.15.9",
```

- [ ] **Step 2: Install oxlint and update the lint script**

```powershell
npx --yes pnpm@9 add -D oxlint
```

Then change the `lint` script in `package.json` from `"tsc -b"` to:

```json
    "lint": "oxlint && tsc -b",
```

- [ ] **Step 3: Verify lint runs**

```powershell
npm run lint
```

Expected: oxlint prints `Found 0 warnings and 0 errors` (or a similar clean summary), then `tsc -b` exits 0.

- [ ] **Step 4: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm test
      - run: pnpm run build
```

Note: `pnpm/action-setup@v4` without a `version` reads `packageManager` from `package.json` (added in Step 1).

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml .github/workflows/ci.yml
git commit -m "ci: add lint-test-build workflow, oxlint, packageManager"
```

---

## Task 5: Drop framer-motion

**Files:** `src/App.tsx`, `src/index.css`, `src/portfolio.test.ts`, `package.json`

- [ ] **Step 1: Write failing test assertions**

In `src/portfolio.test.ts`, add after the existing `assert.doesNotMatch(app, /capability-image/)` line:

```ts
assert.doesNotMatch(app, /framer-motion/, 'App.tsx must not use framer-motion')
assert.doesNotMatch(css, /framer-motion/, 'index.css must not reference framer-motion')
```

Also read `package.json` — add at the top of the file, next to the other reads:

```ts
const packageJson = readFileSync(new URL('../package.json', import.meta.url), 'utf8')
```

And add:

```ts
assert.doesNotMatch(packageJson, /framer-motion/, 'framer-motion must be removed from dependencies')
```

- [ ] **Step 2: Run tests — expect failure**

```powershell
npm test
```

Expected: failure on the new framer-motion assertions.

- [ ] **Step 3: Add the `useReveal` hook to `src/App.tsx`**

Replace the import line `import { motion } from 'framer-motion'` with:

```ts
import { useEffect, useRef, useState, type ReactNode } from 'react'
```

(keep `useEffect` and `useState` — `usePrefersReducedMotion` still uses them — and add `useRef`).

After `usePrefersReducedMotion`, replace the whole `Reveal` component with:

```ts
function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduceMotion) {
      node.classList.add('is-visible')
      return
    }
    if (delay > 0) {
      node.style.transitionDelay = `${delay}s`
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduceMotion, delay])

  return ref
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} className={`reveal${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Replace the `motion.li` timeline with a plain `li`**

In `src/App.tsx`, replace the `{experience.map((item, index) => (` block:

```tsx
            {experience.map((item, index) => (
              <motion.li
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.04 }}
                key={`${item.company}-${item.dates}`}
              >
                <p className="timeline-date">{item.dates}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="timeline-company">{item.company} · {item.location}</p>
                </div>
                <p className="timeline-summary">{item.summary}</p>
              </motion.li>
            ))}
```

with:

```tsx
            {experience.map((item, index) => (
              <li
                ref={useReveal<HTMLLIElement>(reduceMotion ? 0 : index * 0.04)}
                className="reveal"
                key={`${item.company}-${item.dates}`}
              >
                <p className="timeline-date">{item.dates}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="timeline-company">{item.company} · {item.location}</p>
                </div>
                <p className="timeline-summary">{item.summary}</p>
              </li>
            ))}
```

Note: `useReveal` is called inside `map` — it is a hook but here it only takes a plain value, so hook-order rules hold across renders (the list never reorders).

Also remove the now-unused `reduceMotion` local in `App` if `tsc` flags it as unused (it is still used to compute the delay above — keep it).

- [ ] **Step 5: Add `.reveal` CSS to `src/index.css`**

Append before the `@media (prefers-reduced-motion: reduce)` block:

```css
.reveal { opacity: 0; transform: translateY(20px); transition: opacity .55s ease-out, transform .55s ease-out; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

And inside the existing reduced-motion block, add a rule so content is never stuck invisible:

```css
  .reveal { opacity: 1; transform: none; }
```

- [ ] **Step 6: Remove the dependency**

```powershell
npx --yes pnpm@9 remove framer-motion
```

- [ ] **Step 7: Verify**

```powershell
npm run lint
npm test
npm run build
```

Expected: all clean; build output JS drops to roughly half of 390 kB.

- [ ] **Step 8: Browser-check the reveal**

`npm run dev` (background), open `http://localhost:5173`, scroll through hero → experience; sections fade up once. Then `Stop-Process` the dev server node processes.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/index.css src/portfolio.test.ts package.json pnpm-lock.yaml
git commit -m "perf: replace framer-motion with IntersectionObserver reveal"
```

---

## Task 6: Projects section

**Files:** `src/content.ts`, `src/App.tsx`, `src/index.css`, `src/content.test.ts`, `src/portfolio.test.ts`

- [ ] **Step 1: Write failing tests**

In `src/content.test.ts`, append:

```ts
import { capabilities, certifications, experience, projects } from './content.ts'
```

(update the existing import line) then append:

```ts
assert.equal(projects.length, 3)
assert.equal(projects.filter((project) => project.featured).length, 1)
assert.equal(
  projects.find((project) => project.featured)?.href,
  'https://github.com/s3nafps/ForecastFoundry',
)
assert.deepEqual(
  projects.filter((project) => !project.featured).map((project) => project.href),
  [undefined, undefined],
)
assert.deepEqual(
  projects.map((project) => project.number),
  ['P1', 'P2', 'P3'],
)
assert.equal(certifications.length, 1)
assert.equal(certifications[0].issuer, 'Google Cloud')
```

In `src/portfolio.test.ts`, extend the `sections` array — replace the array with:

```ts
const sections = [
  'id="hero"',
  'className="proof-rail section-wrap"',
  'id="capabilities"',
  'id="experience"',
  'id="projects"',
  'id="approach"',
  'id="certifications"',
  'id="contact"',
]
```

And add after the existing `assert.match(app, /Download CV/)` line:

```ts
assert.match(app, />Projects</, 'nav must include a Projects link')
```

- [ ] **Step 2: Run tests — expect failure**

```powershell
npm test
```

Expected: `CV content check passed` fails on `projects.length`.

- [ ] **Step 3: Add data to `src/content.ts`**

Append after the `Experience` type and before `export const capabilities`, add:

```ts
export type Project = {
  number: string
  title: string
  description: string
  tags: string[]
  href?: string
  featured: boolean
  context?: string
}

export type Certification = {
  title: string
  issuer: string
  url?: string
}
```

Append at the end of the file:

```ts
export const projects: Project[] = [
  {
    number: 'P1',
    title: 'ForecastFoundry',
    description:
      'Paper-first prediction-market research and execution engine — CLI, REST/OpenAPI, and MCP server.',
    tags: ['Python', 'FastAPI', 'MCP', 'Alembic', 'Docker'],
    href: 'https://github.com/s3nafps/ForecastFoundry',
    featured: true,
  },
  {
    number: 'P2',
    title: 'Automated Health-Check Suite',
    description:
      'Weekly infrastructure health checks cut from ~3 hours to ~5 minutes (~97%) with consistent, accurate results.',
    tags: ['PowerShell', 'Scheduled tasks'],
    featured: false,
    context: 'AGCE',
  },
  {
    number: 'P3',
    title: 'Ops & Audit Dashboards',
    description:
      'Dashboards for management, cybersecurity, and audit teams in an air-gapped environment.',
    tags: ['PowerShell', 'Reporting'],
    featured: false,
    context: 'AGCE',
  },
]

export const certifications: Certification[] = [
  {
    title: 'Google Cloud Associate Cloud Engineer (ACE)',
    issuer: 'Google Cloud',
  },
]
```

- [ ] **Step 4: Render the Projects section in `src/App.tsx`**

Update the import from `./content` to include the new data:

```ts
import { capabilities, certifications, experience, projects } from './content'
```

Add the nav link — in `.nav-desktop` (and the mobile menu), after the Experience link:

```tsx
              <a href="#projects">Projects</a>
```

Insert the section between the `#experience` and `#approach` sections:

```tsx
        <section id="projects" className="section section-wrap projects-section">
          <Reveal className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>Built to make operations measurable.</h2>
          </Reveal>
          <div className="projects-grid">
            {projects.map((project, index) =>
              project.featured ? (
                <Reveal key={project.number} className="project-featured">
                  <div className="project-featured-main">
                    <span className="project-flag">Featured · Open source</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="project-featured-side">
                    <ul className="project-tags">
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <a href={project.href} target="_blank" rel="noreferrer">
                      View on GitHub <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </Reveal>
              ) : (
                <Reveal key={project.number} className="project-row" delay={index * 0.06}>
                  <span className="card-number">{project.number}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <p className="project-row-meta">
                      <span className="project-tag">{project.tags.join(' · ')}</span>
                      <span className="project-internal">Internal · {project.context}</span>
                    </p>
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </section>
```

- [ ] **Step 5: Add Projects CSS to `src/index.css`**

Append before the `@media (max-width: 760px)` block:

```css
.projects-section { border-top: 1px solid var(--line); }
.projects-grid { display: grid; gap: 16px; margin-top: 60px; }
.project-featured { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(240px, .6fr); gap: 40px; padding: clamp(28px, 5vw, 56px); border: 1px solid var(--accent); border-radius: 24px; background: var(--surface); }
.project-featured-main h3 { margin: 10px 0 14px; font-size: clamp(1.9rem, 3.4vw, 3rem); line-height: 1; font-weight: 600; }
.project-featured-main p { max-width: 560px; margin-bottom: 0; color: var(--muted); line-height: 1.6; font-size: .95rem; }
.project-flag { color: var(--accent); font: 500 .68rem 'DM Mono', monospace; letter-spacing: .08em; text-transform: uppercase; }
.project-featured-side { display: flex; flex-direction: column; justify-content: space-between; gap: 24px; padding: 8px 0; }
.project-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.project-tags li { padding: 7px 12px; border: 1px solid var(--line); border-radius: 999px; font-size: .74rem; color: var(--muted); }
.project-featured-side a { display: inline-flex; align-items: center; gap: 6px; align-self: start; color: var(--ink); font-size: .86rem; font-weight: 600; text-decoration: none; border-bottom: 1px solid var(--ink); }
.project-row { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 20px; padding: 30px 4px; border-bottom: 1px solid var(--line); }
.project-row h3 { margin-bottom: 10px; font-size: 1.35rem; line-height: 1.1; font-weight: 600; }
.project-row p { margin: 0; color: var(--muted); line-height: 1.6; font-size: .92rem; }
.project-row-meta { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 18px; align-items: center; }
.project-tag { color: var(--muted); font-size: .78rem; }
.project-internal { color: var(--accent); font: 500 .7rem 'DM Mono', monospace; letter-spacing: .05em; }
```

- [ ] **Step 6: Run tests + build**

```powershell
npm run lint
npm test
npm run build
```

Expected: all pass; build emits `projects` markup.

- [ ] **Step 7: Commit**

```bash
git add src/content.ts src/App.tsx src/index.css src/content.test.ts src/portfolio.test.ts
git commit -m "feat: add projects section (featured + internal work)"
```

---

## Task 7: Certifications section

**Files:** `src/App.tsx`, `src/index.css` (tests already cover it via Task 6)

- [ ] **Step 1: Render the section in `src/App.tsx`**

Insert between the `#approach` section and the `#contact` footer:

```tsx
        <section id="certifications" className="section section-wrap certifications-section">
          <Reveal className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Credentials</p>
              <h2>Certifications.</h2>
            </div>
          </Reveal>
          <Reveal className="certification-row">
            <span className="card-number">01</span>
            <div>
              <h3>{certifications[0].title}</h3>
              <p>{certifications[0].issuer}</p>
            </div>
          </Reveal>
        </section>
```

- [ ] **Step 2: Add CSS to `src/index.css`**

Append before the `@media (max-width: 760px)` block:

```css
.certifications-section { padding-top: 96px; }
.certification-row { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 20px; align-items: center; margin-top: 48px; padding: 30px 4px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.certification-row h3 { margin-bottom: 6px; font-size: 1.3rem; line-height: 1.15; font-weight: 600; }
.certification-row p { margin: 0; color: var(--muted); font-size: .9rem; }
```

- [ ] **Step 3: Verify**

```powershell
npm run lint
npm test
npm run build
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "feat: add certifications section"
```

---

## Task 8: Final verification (no commit)

- [ ] **Step 1: Full local check**

```powershell
npm run lint
npm test
npm run build
```

Expected: oxlint clean, `tsc -b` clean, both contract tests pass, Vite build succeeds.

- [ ] **Step 2: Browser verification**

Start dev server in background, then in the preview browser at `http://localhost:5173`:

1. Desktop (1280×900): all 8 sections render; Projects shows 1 featured + 2 rows; Certifications shows ACE row; nav includes Projects; no console errors.
2. Toggle dark theme: new sections readable.
3. Mobile (390×844): menu opens, Projects/Certifications stack correctly, no horizontal overflow.
4. Reduced-motion emulation: content visible (not stuck at opacity 0).
5. `GET /Mohamed_Senator_Master_CV.pdf`, `GET /og.png`, `GET /robots.txt`, `GET /sitemap.xml` → all 200.

Stop the dev server afterwards.

- [ ] **Step 3: Report**

Summarize: files changed, test/build/lint results, and remaining manual steps for the user (push, Vercel redeploy, verify live site). Do not push — user approval required.

---

## Self-check log

- Spec §1 (CV pipeline) → Task 1. §2 (SEO) → Task 3 + Task 2 (og.png). §3 (CI) → Task 4. §4 (bundle) → Task 5. §5 (Projects) → Task 6. §6 (Certifications) → Task 7. §7 (robustness: noscript) → Task 3; error boundary explicitly non-goal. §8 (tests/verification) → per-task tests + Task 8.
- No placeholders: every step has concrete code/commands and expected output.
- Type consistency: `Project`/`Certification` shapes match across content.ts, App.tsx, and both test files; `useReveal<T extends HTMLElement>` used as `useReveal<HTMLDivElement>` and `useReveal<HTMLLIElement>`.

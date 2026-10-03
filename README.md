# Mohamed Senator

**Systems Administrator · Cloud Infrastructure & Automation** — Algiers, Algeria

I support Windows, virtualization, network, and security-sensitive infrastructure,
then make recurring operational work faster, clearer, and more reliable. This
repository is the source of my portfolio site.

**Live site:** [s3nafps.github.io](https://s3nafps.github.io/) ·
**CV:** [Mohamed_Senator_Master_CV.pdf](public/Mohamed_Senator_Master_CV.pdf) ·
**LinkedIn:** [mohamedsenator](https://linkedin.com/in/mohamedsenator) ·
**Email:** [mohamed.senator@icloud.com](mailto:mohamed.senator@icloud.com)

---

## At a glance

| | |
|---|---|
| **4+** | years in live environments |
| **97%** | reduction in weekly health-check time (~3 hours → ~5 minutes) |
| **4,000+** | users supported |
| **ACE** | Google Cloud Associate Cloud Engineer |

## What I do

- **Windows infrastructure** — Windows Server, Active Directory & Group Policy,
  Exchange, Microsoft 365, SCCM/MECM.
- **PowerShell automation** — infrastructure health checks, audits, reporting,
  Bash, GitHub Actions & CI/CD.
- **Networking & security** — TCP/IP, Cisco, LAN/WAN, Fortinet FortiGate, PKI,
  vulnerability remediation & patching.
- **Cloud & virtualization** — GCP, Terraform, private GKE, VMware vSphere, Hyper-V.

## Experience

| When | Where | Role |
|---|---|---|
| Feb 2025 — Present | AGCE | IT Support & Systems Administration |
| Feb 2024 — Aug 2024 | Agrofilm Packaging Algeria | IT Support Engineer (contract) |
| Dec 2022 — Dec 2023 | Samsung | IT Support / Infrastructure Support |
| May 2022 — Nov 2022 | IRIS SATEREX | IT Support (contract) |
| Apr 2021 — Apr 2022 | Brandt Algeria | IT Support Technician |

## Selected work

- **[ForecastFoundry](https://github.com/s3nafps/ForecastFoundry)** (open source) —
  paper-first prediction-market research and execution engine with a CLI,
  REST/OpenAPI, and an MCP server. *Python, FastAPI, MCP, Alembic, Docker.*
- **Automated Health-Check Suite** (AGCE) — weekly infrastructure health checks
  cut from ~3 hours to ~5 minutes with consistent, accurate results. *PowerShell,
  scheduled tasks.*
- **Ops & Audit Dashboards** (AGCE) — dashboards for management, cybersecurity,
  and audit teams in an air-gapped environment. *PowerShell, reporting.*

## Certification

- Google Cloud Associate Cloud Engineer (ACE) — Google Cloud

---

## About this site

A single-page portfolio with a light, modern UI: floating glass navigation,
bento-style capability cards, a hero "ops console", a timeline for experience,
pointer-follow card highlights, and a dark theme (remembered between visits).
Animations respect `prefers-reduced-motion`.

**Built with** Vite · React 19 · TypeScript · Tailwind · Astryx design system ·
lucide icons · pnpm.

### Run it locally

```bash
pnpm install --frozen-lockfile
pnpm dev          # local dev server
pnpm lint         # oxlint + type-check
pnpm test         # content and structure checks
pnpm build        # production build to dist/
pnpm preview      # serve the production build
```

### Project layout

| Path | What lives there |
|---|---|
| `src/content.ts` | Capabilities, experience, projects, and certifications as typed data |
| `src/App.tsx` | Page sections, navigation, and interaction hooks |
| `src/index.css` | Design tokens (light/dark), layout, and responsive styles |
| `index.html` | Meta tags, Open Graph/Twitter cards, JSON-LD, noscript fallback |
| `cv/` | Scripts that generate the CV PDF and the Open Graph image |
| `public/` | Served CV, favicon, `og.png`, `robots.txt`, `sitemap.xml` |
| `.github/workflows/` | CI checks and the GitHub Pages deploy |

To update the copy, edit `src/content.ts`. To regenerate the CV or the social
image, see [`cv/README.md`](cv/README.md) (`python cv/generate_cv_pdf.py`,
`python cv/generate_og_image.py`).

### CI and deploy

GitHub Actions runs install → lint → test → build on every pull request
(`.github/workflows/ci.yml`). Every push to `main` runs the same checks and then
publishes `dist/` to GitHub Pages (`.github/workflows/deploy.yml`). In the repo
settings, **Pages → Source** must be set to **GitHub Actions**.

---

© 2026 Mohamed Senator

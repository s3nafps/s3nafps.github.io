# Mohamed Senator

**Systems Administrator · Cloud Infrastructure & Automation** — Algiers, Algeria

I keep systems running and build the tools around them. By day I support Windows,
network and security-sensitive infrastructure and automate the recurring work around
it. I also ship data APIs on Apify, open-source infrastructure, and an Android app.
This repository is the source of my portfolio site.

**Live site:** [s3nafps.github.io](https://s3nafps.github.io/) ·
**CV:** [Mohamed_Senator_Master_CV.pdf](public/Mohamed_Senator_Master_CV.pdf) ·
**LinkedIn:** [mohamedsenator](https://linkedin.com/in/mohamedsenator) ·
**Apify:** [apify.com/s3nafps](https://apify.com/s3nafps) ·
**Email:** [mohamed.senator@icloud.com](mailto:mohamed.senator@icloud.com)

---

## At a glance

| | |
|---|---|
| **4+** | years in live environments |
| **97%** | less time on weekly health checks (~3 hours → ~5 minutes) |
| **4,000+** | users supported |
| **12** | public data APIs (Actors) on the Apify Store |
| **ACE** | Google Cloud Associate Cloud Engineer |

## What I build

| Project | What it is |
|---|---|
| [Trackr](https://github.com/s3nafps/trackr) | Android app for tracking movies, TV and anime with friends. Kotlin, Jetpack Compose, Room, Supabase, TMDB and AniList. |
| [ADHealthCheck](https://github.com/s3nafps/ADHealthCheck-PowerShell) | PowerShell module that audits Active Directory (27 rules, 10 areas) and writes scored HTML + JSON reports. |
| [GCP Landing Zone](https://github.com/s3nafps/gcp-landing-zone) | Terraform landing zone: private, hardened GKE with keyless CI through Workload Identity Federation. |
| [VPS Platform](https://github.com/s3nafps/vps-platform) | One VPS hardened and run from code with Ansible: Caddy, Prometheus, Grafana, Loki, alerting and restore-tested backups. |

### Data APIs on Apify

Each Actor runs in the cloud, bills per event (a page, result or report), and can be
called over REST, from the JavaScript or Python API clients, or by AI agents through MCP.

| Actor | Does |
|---|---|
| [Website to Markdown Crawler](https://apify.com/s3nafps/ai-ready-webpage-extractor) | Any page or docs site → clean Markdown and RAG chunks |
| [Webpage to JSON for AI Agents](https://apify.com/s3nafps/webpage-to-json-for-ai-agents) | Plain-English instruction → typed JSON with source quotes |
| [YouTube Transcripts for AI](https://apify.com/s3nafps/youtube-transcripts-for-ai) | Bulk transcripts with timestamps and RAG chunks |
| [PDF & Word to Markdown](https://apify.com/s3nafps/doc-to-markdown) | Documents → Markdown chunks tagged with page numbers |
| [Google Custom Search API Replacement](https://apify.com/s3nafps/google-custom-search-api) | Drop-in for Google's Custom Search JSON API |
| [Google Trends Bulk Compare](https://apify.com/s3nafps/google-trends-bulk-compare) | Up to 500 keywords on one Trends scale |
| [Sitemap Intelligence API](https://apify.com/s3nafps/sitemap-intelligence-api) | Classifies sitemap URLs by page type |
| [Domain Exposure Intel](https://apify.com/s3nafps/domain-exposure-intel) | Passive security score, fixes and CVE/KEV leads |
| [Company Why-Now Signals](https://apify.com/s3nafps/company-why-now-signals) | Dated reasons to reach out, from hiring, SEC filings and news |
| [Aqar.fm Scraper](https://apify.com/s3nafps/aqar-scraper) | Saudi property listings and agents (EN/AR) |
| [Aqar.fm Monitor](https://apify.com/s3nafps/aqar-monitor) | New listings and price-drop alerts |
| [Bilibili Scraper](https://apify.com/s3nafps/bilibili-scraper) | Search, video stats, comments and trending, no login |

## Experience

| When | Where | Role |
|---|---|---|
| Feb 2025 — Present | AGCE | IT Support — Infrastructure & Automation |
| Feb 2024 — Aug 2024 | Agrofilm Packaging Algeria | Systems Administrator (contract) |
| Dec 2022 — Dec 2023 | Samsung Algeria | Systems Support Specialist |
| May 2022 — Nov 2022 | IRIS Electronics | 24/7 Infrastructure Monitoring |
| Apr 2021 — Apr 2022 | Brandt Algeria | IT Operations Specialist |

---

## About this site

A dark, cinematic single page (with a light theme toggle) built around motion:
a word-by-word hero reveal over an animated aurora and grid, a terminal that replays
real commands from the projects, an infinite tool marquee, cursor-lit cards, a
filterable grid of Apify Actors with video previews and an API dialog (cURL,
JavaScript, Python and MCP snippets), a Trackr phone showcase with scroll parallax,
and a timeline that fills as you scroll. All motion respects
`prefers-reduced-motion`.

The APIs section reads **live data from the public Apify Store API**
(`GET https://api.apify.com/v2/store?username=s3nafps`, no token needed) and merges
run counts into the curated Actor list. New Actors published on Apify appear
automatically, and Actors the Store no longer lists drop off. If the API is slow or down, the page shows a built-in snapshot.

**Built with** Vite · React 19 · TypeScript · Motion · lucide icons · plain CSS · pnpm.

### Run it locally

```bash
pnpm install --frozen-lockfile
pnpm dev          # local dev server
pnpm lint         # oxlint + type-check
pnpm test         # data, Apify client and structure checks
pnpm build        # production build to dist/
pnpm preview      # serve the production build
```

### Project layout

| Path | What lives there |
|---|---|
| `src/data/` | All copy as typed data: profile, experience, Actors, projects |
| `src/lib/apify.ts` | Apify Store client (fetch, cache, merge) and API snippet builders |
| `src/sections/` | One file per page section, each with its own CSS |
| `src/components/` | Nav, terminal and the motion primitives (`Reveal`, `SplitText`, `CountUp`, …) |
| `src/styles/` | Design tokens (dark/light) and shared utilities |
| `public/media/` | Full-size Actor promo media (linked from the Apify Store READMEs — do not move) |
| `public/previews/` | Lightweight posters, preview loops and screenshots used by the page |
| `scripts/` | `make-previews.py` (media) and `make-og.mjs` (social image) |
| `cv/` | CV source and PDF generator |
| `.github/workflows/` | CI checks and the GitHub Pages deploy |

To update the copy, edit the files in `src/data/`. To refresh media, run
`python scripts/make-previews.py --trackr ../trackr --adhc ../ADHealthCheck-PowerShell`
(needs ffmpeg and Pillow). To regenerate the social image, run `node scripts/make-og.mjs`
(needs Playwright).

### CI and deploy

GitHub Actions runs install → lint → test → build on every pull request
(`.github/workflows/ci.yml`). Every push to `main` runs the same checks and then
publishes `dist/` to GitHub Pages (`.github/workflows/deploy.yml`). In the repo
settings, **Pages → Source** must be set to **GitHub Actions**.

---

© 2026 Mohamed Senator

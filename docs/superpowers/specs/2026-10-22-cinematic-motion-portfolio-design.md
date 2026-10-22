# Cinematic Motion Portfolio — Design

Date: 2026-10-22 · Status: approved direction (answers given in chat)

## Goal

Rebuild the whole portfolio as a dark, cinematic, animation-rich single page that
presents Mohamed Senator as **a systems administrator who also builds**: the
infrastructure career stays the headline for recruiters, and a second pillar
shows what he ships — 13 public Apify Actors (data APIs), open-source
infrastructure repos, and the Trackr Android app.

## Decisions (from the user)

| Question | Answer |
|---|---|
| Visual direction | Dark cinematic (dark default, light toggle kept) |
| Positioning | Sysadmin who builds |
| "API" meaning | Both: Actors shown as callable APIs with copyable snippets **and** live data from Apify's public API with a static fallback |
| Repos | Trackr, ADHealthCheck-PowerShell, gcp-landing-zone, vps-platform |

## Content rules

- Every claim must come from the CV, the existing site copy, a repo README, or
  the Apify API. No invented metrics.
- ForecastFoundry is dropped: the repo is no longer reachable publicly.
- `public/media/**` must not be moved, renamed or deleted: Apify Store READMEs
  link to those files. New, lighter derivatives live in `public/previews/**`.
- Email, LinkedIn, GitHub, CV download and the Apify profile stay reachable
  from the nav, hero and contact sections.

## Page structure (in order)

1. **Nav** — floating glass bar; scroll-spy pill that slides between links;
   theme toggle (circular View Transition reveal where supported); CV button;
   mobile sheet menu. A spring-smoothed scroll progress bar sits at the top.
2. **Hero** (`#top`) — status badge; name; word-by-word headline reveal
   ("I keep systems running — and build the tools around them."); summary;
   CTAs (See my work, Download CV); animated aurora + masked grid background
   with a cursor spotlight; a terminal window that types real commands from
   the repos/Actors (ADHealthCheck, Terraform/checkov, Apify call, Gradle);
   proof stats with count-up (4+ years, 97% faster health checks, 4,000+
   users, 13 Actors).
3. **Stack marquee** — two infinite rows of tools moving in opposite
   directions, edge-faded, paused on hover.
4. **Capabilities** (`#capabilities`) — "Operate" and "Build" pillars as a
   bento grid with cursor-spotlight borders. Operate: Windows infrastructure,
   networking & security, cloud & virtualization. Build: automation, data
   APIs, apps.
5. **Actors / APIs** (`#apis`) — live stats panel (Actors, total runs, last
   run, source status) fed by `GET https://api.apify.com/v2/store?username=s3nafps`;
   category filter chips with an animated active pill and layout-animated
   grid; Actor cards with poster → muted preview loop on hover/in-view; click
   opens an accessible dialog (shared-element expand) with the full promo
   video, pricing, links and API tabs (cURL, JavaScript, Python, MCP) with
   copy-to-clipboard. Live data overlays static data by Actor name; Actors that
   appear live but not in static data are appended automatically.
6. **Projects** (`#projects`) — Trackr feature showcase (three phone mockups
   with scroll parallax and an auto-cycling screenshot carousel, feature list,
   stack chips, APK + GitHub links), then three cards: ADHealthCheck (report
   image with scan-line animation, ties to the 3h → minutes story),
   gcp-landing-zone (SVG architecture lines drawing in), vps-platform (service
   list with staggered health pulses).
7. **Experience** (`#experience`) — timeline whose line fills with scroll
   progress; entries slide in; certification card (Google Cloud ACE) with a
   shimmer.
8. **Contact** (`#contact`) — split-text headline, magnetic email button,
   copy-email toast, links (LinkedIn, GitHub, Apify, CV), footer.

## Visual system

- Dark: background `#07080c`, raised surfaces `#0d0f15`/`#12151d`, hairlines
  `rgba(255,255,255,.08)`, ink `#eef0f6`, muted `#9aa3b2`.
- Accent gradient violet `#8b5cf6` → cyan `#22d3ee`; success `#34d399`;
  warning `#fbbf24`. Light theme mirrors tokens (`#f7f7fb` page, `#0b0d12`
  ink, deeper accents for contrast).
- Type: Inter Tight (display), Inter (body), JetBrains Mono (labels, code,
  terminal), Instrument Serif italic for one or two accent words.
- Radii 20px cards / 12px controls; generous section padding (clamp 96–160px).

## Motion system

- Library: `motion` (Motion for React) pinned to a stable 12.x release.
- `MotionConfig reducedMotion="user"` at the root; CSS
  `prefers-reduced-motion` disables keyframe loops (aurora, marquee, pulses)
  and videos do not autoplay (posters only).
- Shared primitives: `Reveal` (fade/rise/blur in view, stagger children),
  `SplitText` (word reveal), `CountUp`, `Magnetic`, `SpotlightCard`.
- Video previews load lazily (`preload="none"`) and play only while visible.

## Architecture

```
src/
  main.tsx, App.tsx            shell: MotionConfig, theme, nav, sections
  styles/tokens.css, base.css  tokens (dark/light), reset, shared utilities
  data/profile.ts              identity, links, proof stats, stack, capabilities
  data/experience.ts           roles + certifications
  data/actors.ts               13 curated Actors (copy, pricing label, media, example input)
  data/projects.ts             Trackr + 3 repos
  lib/apify.ts                 store fetch, merge, snippet builders (pure, tested)
  lib/format.ts                compact numbers, relative time (pure, tested)
  hooks/                       useTheme, useApifyStore, useInViewVideo, useScrollSpy
  components/                  motion primitives, Nav, Terminal, Marquee, CodeTabs, Modal, PhoneMockup
  sections/                    Hero, Stack, Capabilities, Apis, Projects, Experience, Contact (+ per-section CSS)
```

Tailwind, PostCSS config and the Astryx packages are removed (they are unused
or replaced by the custom system).

## Error handling

- Apify fetch: 6s timeout, response shape validated, cached in
  `sessionStorage` for 10 minutes; any failure shows "Offline snapshot" and
  the static data. The page never blocks on the network.
- Clipboard failures fall back to selecting the text and showing a hint.
- Video errors leave the poster visible.

## Testing

- `pnpm test` runs Node strip-types checks:
  - data invariants (13 Actors, unique slugs, every referenced file exists in
    `public/`, example inputs are JSON-serialisable, 4 projects with repo URLs,
    5 roles);
  - `lib/apify` merge and snippet builders, `lib/format`;
  - structure (section order, meta tags, reduced-motion handling, no Tailwind
    or Astryx left).
- `pnpm lint` (oxlint + tsc) and `pnpm build` must pass.
- Visual QA with Playwright screenshots at 1440px and 390px, dark and light,
  plus a reduced-motion pass.

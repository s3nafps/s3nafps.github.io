# Xero-Inspired Portfolio Hero Preview Implementation Plan

> **For the implementing AI agent:** Use `executing-plans` in the current session. Track each step with the checkboxes below.

**Goal:** Build and display an isolated browser preview of the approved Xero-inspired portfolio hero without changing the React application or live site.

**Architecture:** A single self-contained HTML document will live in the existing ignored brainstorming preview directory. Plain CSS provides the complete visual treatment and responsive states; small inline JavaScript handles the mobile menu, reduced-motion behavior, beam geometry, and requestAnimationFrame state machine.

**Tech stack:** Semantic HTML, plain CSS, inline JavaScript, SVG, visual-companion preview server, in-app browser.

---

## Files

- Create: `.superpowers/brainstorm/portfolio-directions/content/xero-portfolio-hero-a1.html` — isolated interactive hero prototype.
- Read only: `docs/superpowers/specs/2026-07-27-xero-inspired-portfolio-hero-design.md` — approved content and behavior contract.
- Do not modify: `src/`, `public/`, or deployed branches.

### Task 1: Build the isolated hero prototype

- [ ] **Step 1: Confirm the preview server state**

Read `.superpowers/brainstorm/portfolio-directions/state/server-info`. If port `52341` is not listening, restart the visual-companion server with:

```powershell
bash C:/Users/s3nafps/.agents/skills/brainstorming/scripts/start-server.sh --project-dir D:/Projects/Portfolio-main
```

Expected: JSON containing a local URL and the existing `portfolio-directions/content` screen directory.

- [ ] **Step 2: Create the self-contained preview**

Create `.superpowers/brainstorm/portfolio-directions/content/xero-portfolio-hero-a1.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mohamed Senator — Hero Direction A1</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root { --bg:#0a0a0f; --surface:#111118; --text:#f0f0f5; --text-muted:#8888a8; --accent:#c8a0e0; --accent-pink:#b04090; --border:rgba(255,255,255,.08) }
      * { box-sizing:border-box }
      body { margin:0; padding:14px; background:var(--bg); color:var(--text); font-family:Inter,sans-serif }
      nav, main { width:100%; max-width:1600px; margin-inline:auto }
      .hero-card { position:relative; min-height:640px; overflow:hidden; border:1px solid rgba(255,255,255,.07); border-radius:20px; background:#0d0b12 }
      @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important } }
    </style>
  </head>
  <body>
    <nav aria-label="Primary navigation">
      <a href="#" class="nav-logo">Mohamed Senator</a>
      <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span></button>
      <div class="nav-menu">
        <a href="#experience">Experience</a><a href="#capabilities">Capabilities</a><a href="#contact">Contact</a>
      </div>
    </nav>
    <main>
      <section class="hero-card" aria-labelledby="hero-heading">
        <div class="hero-grid" aria-hidden="true"></div>
        <div class="icon-pipeline" id="pipeline">
          <svg class="beam-svg" aria-hidden="true"><defs><linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse"></linearGradient></defs><path id="beam-glow"></path><path id="beam-core"></path></svg>
          <button class="icon-node node-light-right" id="node-stack" aria-label="Windows infrastructure"></button>
          <span class="pipeline-line"></span>
          <div class="center-wrap"><span class="splash" id="splash"></span><span class="icon-node-center" id="node-x">MS</span></div>
          <span class="pipeline-line right"></span>
          <button class="icon-node node-light-left" id="node-shield" aria-label="Secure cloud delivery"></button>
        </div>
        <div class="hero-content">
          <p class="eyebrow">Systems Administrator · Cloud Engineer</p>
          <h1 id="hero-heading">Systems built to <strong>stay available.</strong></h1>
          <p>I engineer secure Windows infrastructure, automate recurring operations, and extend reliable systems into the cloud.</p>
          <a class="btn-cta" href="#experience">View experience</a>
        </div>
      </section>
      <div class="brands" aria-label="Core platforms"><span>Microsoft</span><span>PowerShell</span><span>Google Cloud</span><span>VMware</span><span>Fortinet</span></div>
    </main>
  </body>
</html>
```

Complete the CSS with the supplied arc stops, masked 40 px grid, neumorphic node shadows, desktop/mobile navigation, pipeline sizing, hero typography, CTA, expertise row, focus-visible states, and the approved breakpoints.

Add one inline script that:

- Toggles `.active` and `aria-expanded` on the mobile menu and restores the previous body overflow value when closed.
- Measures `#pipeline`, `#node-stack`, `#node-x`, and `#node-shield` to set both beam path `d` attributes on mount and resize.
- Runs the `p1 → splash → p2 → idle` requestAnimationFrame state machine with durations `800, 800, 800, 1000`.
- Skips the continuous animation when `matchMedia('(prefers-reduced-motion: reduce)')` matches.
- Removes the resize listener, media listener, and animation frame on cleanup.

The completed file must contain no product-login or signup controls and must keep all behavior local.

- [ ] **Step 3: Run a static contract check**

Run:

```powershell
rg -n "Mohamed Senator|Systems built to stay available|prefers-reduced-motion|requestAnimationFrame|node-stack|node-shield" .superpowers/brainstorm/portfolio-directions/content/xero-portfolio-hero-a1.html
```

Expected: every required phrase and behavior hook is present.

### Task 2: Verify and present the preview

- [ ] **Step 1: Open the visual-companion URL**

Open the URL from `.superpowers/brainstorm/portfolio-directions/state/server-info` in the in-app browser.

Expected: the A1 hero appears without modifying the current portfolio.

- [ ] **Step 2: Verify desktop behavior**

At the normal browser viewport, confirm:

- Navbar, arc, masked grid, three-node pipeline, heading, CTA, and five expertise labels render.
- The beam travels left-to-center, splashes, then travels center-to-right.
- There is no horizontal overflow and no console error.

- [ ] **Step 3: Verify mobile behavior**

At 390 px viewport width, confirm:

- Hamburger opens and closes the menu.
- Body scrolling locks only while the menu is open.
- Pipeline remains readable and the expertise row wraps.
- There is no horizontal overflow.

- [ ] **Step 4: Return to desktop and hand off**

Reset the temporary viewport override, leave the preview open as a deliverable tab, and ask the user whether to keep, revise, or reject A1. Do not edit or deploy the production portfolio during this task.

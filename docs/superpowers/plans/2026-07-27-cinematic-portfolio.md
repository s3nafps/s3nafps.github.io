# Mohamed Senator Cinematic Portfolio Implementation Plan

> **For AI agents:** Required sub-skill: use
> `superpowers:subagent-driven-development` (recommended) or
> `superpowers:executing-plans` to implement this plan task by task. Track
> progress with the checkboxes below.

**Goal:** Replace the current light editorial portfolio with the approved
three-section cinematic portfolio using only CV-supported content.

**Architecture:** Keep the existing Vite/React entry point and implement the
single page in `App.tsx`. Local typed arrays hold capabilities and employment
history; two small shared animation components handle word reveals. Tailwind
provides layout and responsive styling while `index.css` contains only global,
noise, media-fallback, focus, and reduced-motion rules.

**Tech stack:** React 19, Vite 8, TypeScript 6, Tailwind CSS 3, Framer Motion,
Lucide React, PostCSS, Autoprefixer, Oxlint.

---

## File Structure

- Modify `package.json`: add Tailwind, PostCSS, Autoprefixer, Framer Motion, and
  Lucide React, then remove Astryx after its imports are replaced.
- Create `tailwind.config.js`: scan Vite source files and define the cream
  color and serif font.
- Create `postcss.config.js`: enable Tailwind and Autoprefixer.
- Modify `index.html`: update metadata and load Almarai and Instrument Serif.
- Modify `src/main.tsx`: remove Astryx CSS imports.
- Replace `src/App.tsx`: add the typed CV content, animation helpers, and the
  Hero, About, Capabilities/Experience, and Footer markup.
- Replace `src/index.css`: add Tailwind layers and the small custom visual and
  accessibility rules.
- Create `pnpm-lock.yaml`: lock the installed dependency versions.

The deferred GitHub project showcase intentionally creates no code or data file
in this implementation.

### Task 1: Replace the UI dependency layer

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `pnpm-lock.yaml`

- [ ] **Step 1: Update dependencies**

Run:

```powershell
pnpm add framer-motion lucide-react
pnpm add -D tailwindcss@3 postcss autoprefixer
```

Expected: the five required packages are added and `pnpm-lock.yaml` is created.
Keep Astryx temporarily so the existing `App.tsx` remains buildable until Task
3 replaces its imports.

- [ ] **Step 2: Add Tailwind configuration**

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DEDBC8',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
      },
    },
  },
  plugins: [],
}
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Verify dependency resolution**

Run:

```powershell
pnpm install --frozen-lockfile
pnpm exec tailwindcss --help
```

Expected: install exits 0 and the Tailwind CLI prints its help text.

- [ ] **Step 4: Commit if Git metadata is available**

```powershell
git add package.json pnpm-lock.yaml tailwind.config.js postcss.config.js
git commit -m "build: add portfolio styling dependencies"
```

Expected in this workspace: skip because `.git` is absent.

### Task 2: Establish global design tokens and document metadata

**Files:**
- Modify: `index.html`
- Modify: `src/main.tsx`
- Replace: `src/index.css`

- [ ] **Step 1: Update the HTML document**

Set the title to:

```html
<title>Mohamed Senator — Systems Administrator &amp; Cloud Engineer</title>
```

Set the description to:

```html
<meta
  name="description"
  content="Mohamed Senator is a Systems Administrator and Cloud Engineer specializing in Windows infrastructure, PowerShell automation, and reliable IT operations."
/>
```

Load the approved fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Instrument+Serif:ital@1&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 2: Remove Astryx imports**

`src/main.tsx` must retain React, ReactDOM, `./index.css`, and `App`, and remove
all three `@astryxdesign` stylesheet imports.

- [ ] **Step 3: Replace global CSS**

Start `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  font-family: 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

html {
  scroll-behavior: smooth;
  background: #000;
}

body {
  margin: 0;
  min-width: 320px;
  background: #000;
  color: #e1e0cc;
  -webkit-font-smoothing: antialiased;
}
```

Add `.noise-overlay` and `.bg-noise` using the two SVG `feTurbulence` data
URIs specified in the source prompt. Add visible `:focus-visible` outlines,
video fallback gradients, and a reduced-motion media query that disables smooth
scrolling and nonessential transitions.

- [ ] **Step 4: Verify the CSS pipeline**

Run:

```powershell
pnpm run build
```

Expected: TypeScript and Vite complete without missing Astryx or PostCSS errors.
The page can still be visually incomplete until Task 3.

- [ ] **Step 5: Commit if Git metadata is available**

```powershell
git add index.html src/main.tsx src/index.css
git commit -m "style: establish cinematic portfolio theme"
```

Expected in this workspace: skip because `.git` is absent.

### Task 3: Implement CV-grounded content and shared motion

**Files:**
- Replace: `src/App.tsx`

- [ ] **Step 1: Define exact content types**

Add these types near the top of `src/App.tsx`:

```ts
type Capability = {
  number: string
  title: string
  description: string
  items: string[]
  media?: 'video'
}

type Experience = {
  dates: string
  company: string
  role: string
  location: string
  summary: string
}

type StyledSegment = {
  text: string
  className?: string
}
```

- [ ] **Step 2: Add the four capability entries**

Use the exact categories and CV-supported technologies:

```ts
const capabilities: Capability[] = [
  {
    number: '01',
    title: 'Windows Infrastructure',
    description: 'Enterprise Windows environments kept available, governed, and supportable.',
    items: ['Windows Server', 'Active Directory & Group Policy', 'Microsoft Exchange & Microsoft 365'],
    media: 'video',
  },
  {
    number: '02',
    title: 'PowerShell Automation',
    description: 'Recurring operations converted into consistent, reviewable workflows.',
    items: ['Infrastructure health checks', 'System audits & data collection', 'Dashboards & operational reporting'],
  },
  {
    number: '03',
    title: 'Networking & Security',
    description: 'Operational support across enterprise connectivity and security controls.',
    items: ['TCP/IP, Cisco & LAN/WAN', 'Fortinet FortiGate & PKI', 'Vulnerability remediation & patching'],
  },
  {
    number: '04',
    title: 'Cloud & Virtualization',
    description: 'Virtualized infrastructure experience with an expanding Google Cloud practice.',
    items: ['Google Cloud Platform', 'VMware vSphere & Hyper-V', 'Google Cloud Associate Cloud Engineer'],
  },
]
```

- [ ] **Step 3: Add the five experience entries**

Use the dates, employer names, role names, and locations from the CV. Each
summary must paraphrase only the corresponding CV bullets:

```ts
const experience: Experience[] = [
  {
    dates: 'Feb 2025 — Present',
    company: 'AGCE',
    role: 'IT Support & Systems Administration',
    location: 'Algiers, Algeria',
    summary: 'Building PowerShell automation, infrastructure health checks, system audits, dashboards, and operational reporting in a security-sensitive government environment.',
  },
  {
    dates: 'Feb 2024 — Aug 2024',
    company: 'Agrofilm Packaging Algeria',
    role: 'IT Support Engineer — Contract',
    location: 'Algeria',
    summary: 'Supported Active Directory, Windows endpoints, connectivity, remote administration, and infrastructure incidents in a production environment.',
  },
  {
    dates: 'Dec 2022 — Dec 2023',
    company: 'Samsung',
    role: 'IT Support / Infrastructure Support',
    location: 'Algeria',
    summary: 'Supported Windows services, 20+ virtual machines, Active Directory, Exchange, Cisco networking, FortiGate, and escalated infrastructure incidents.',
  },
  {
    dates: 'May 2022 — Nov 2022',
    company: 'IRIS SATEREX',
    role: 'IT Support — Contract',
    location: 'Algeria',
    summary: 'Monitored manufacturing infrastructure and responded to user, system, network, and production-availability incidents.',
  },
  {
    dates: 'Apr 2021 — Apr 2022',
    company: 'Brandt Algeria',
    role: 'IT Support Technician',
    location: 'Algeria',
    summary: 'Supported an enterprise environment serving 4,000+ users while documenting recurring issues and coordinating infrastructure escalations.',
  },
]
```

- [ ] **Step 4: Implement the shared word-reveal components**

Implement these signatures:

```ts
function WordsPullUp({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split(' ').map((word, index) => (
        <span className="overflow-hidden" key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {index < text.split(' ').length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function WordsPullUpMultiStyle({
  segments,
  className = '',
}: {
  segments: StyledSegment[]
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({
      word,
      className: segment.className ?? '',
    })),
  )

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map(({ word, className: wordClassName }, index) => (
        <span className="overflow-hidden" key={`${word}-${index}`}>
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
```

Both use `useRef`, `useInView({ once: true, margin: '-10%' })`, and
`motion.span` with `y: 20`, `opacity: 0`, an `0.08` second stagger, and easing
`[0.16, 1, 0.3, 1]`.

- [ ] **Step 5: Remove the now-unused Astryx packages**

Run:

```powershell
pnpm remove @astryxdesign/core @astryxdesign/theme-neutral @astryxdesign/cli
```

Expected: all three packages disappear from `package.json`; no source file
imports `@astryxdesign`.

- [ ] **Step 6: Run the static checks**

Run:

```powershell
pnpm run build
pnpm run lint
```

Expected: both commands exit 0 with no TypeScript errors or lint diagnostics.

- [ ] **Step 7: Commit if Git metadata is available**

```powershell
git add src/App.tsx
git commit -m "feat: add cv-grounded portfolio content"
```

Expected in this workspace: skip because `.git` is absent.

### Task 4: Build the three-section cinematic page

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Build the Hero**

Use the supplied primary video URL in an autoplaying, muted, looping,
`playsInline` decorative video. Layer `.noise-overlay` and a black gradient
over it. Add semantic navigation to `#about`, `#capabilities`, `#experience`,
LinkedIn, and `#contact`.

```ts
const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

const CAPABILITY_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'
```

The visible hero copy is:

```text
Systems Administrator & Cloud Engineer
Mohamed Senator
I keep enterprise infrastructure available and turn recurring operations into documented PowerShell and cloud workflows.
Algiers, Algeria · 4+ years · Google Cloud ACE
```

Add `View experience` linking to `#experience` and `Download CV` linking to
`/Mohamed_Senator_CV_2026.pdf`.

- [ ] **Step 2: Build About**

Use `WordsPullUpMultiStyle` for:

```text
I build reliable Windows infrastructure and automate the work that should not stay manual.
```

Set `automate the work` in Instrument Serif italic. Add a scroll-linked
paragraph using `useScroll` and per-character `useTransform` opacity:

```text
Across more than four years in enterprise, manufacturing, and government environments, I have supported infrastructure serving up to 4,000+ users while developing PowerShell health checks, audits, dashboards, and operational reporting.
```

- [ ] **Step 3: Build capability cards**

Render `capabilities.map(...)` in a one/two/four-column responsive grid. The
first card uses `CAPABILITY_VIDEO`. The remaining cards use `#212121`, a small
number label, title, description, cream Lucide `Check` icons, and the typed
checklist. Animate cards from `scale: 0.95` and `opacity: 0` with a `0.15`
second stagger.

- [ ] **Step 4: Build experience timeline**

Within the third section, add `id="experience"` to the timeline heading
container. Render `experience.map(...)` as bordered rows with dates, role,
company, location, and summary. Use one-column rows on mobile and a fixed date
column from the medium breakpoint upward.

- [ ] **Step 5: Build the footer**

Add `id="contact"`, the email
`mohamed.senator@icloud.com`, and external links for:

```text
LinkedIn: https://linkedin.com/in/mohamedsenator
GitHub: https://github.com/s3nafps
CV: /Mohamed_Senator_CV_2026.pdf
```

Use Lucide `ArrowUpRight` or `ArrowRight` icons and include `Algiers, Algeria`
plus `2026`.

- [ ] **Step 6: Run build and lint**

Run:

```powershell
pnpm run build
pnpm run lint
```

Expected: both commands exit 0.

- [ ] **Step 7: Commit if Git metadata is available**

```powershell
git add src/App.tsx
git commit -m "feat: build cinematic portfolio page"
```

Expected in this workspace: skip because `.git` is absent.

### Task 5: Browser verification and polish

**Files:**
- Modify if defects are found: `src/App.tsx`
- Modify if defects are found: `src/index.css`

- [ ] **Step 1: Start the production-like preview**

Run:

```powershell
pnpm run build
pnpm run preview -- --host 127.0.0.1
```

Expected: Vite prints a local preview URL and serves the built site.

- [ ] **Step 2: Check desktop**

At 1440 × 900 verify:

- hero fills the viewport without horizontal overflow;
- the name is readable over the video;
- navigation links reach the correct sections;
- four capability cards fit in one row;
- the experience timeline is aligned;
- external and CV links have correct targets.

- [ ] **Step 3: Check tablet and mobile**

At 768 × 1024 and 390 × 844 verify:

- navigation remains inside the viewport;
- hero copy stacks without clipping;
- capability cards use two columns at tablet and one at mobile;
- timeline dates stack cleanly;
- tap targets and body copy remain readable.

- [ ] **Step 4: Check resilience and accessibility**

Verify:

- disabling remote media leaves the dark fallback readable;
- `prefers-reduced-motion: reduce` removes nonessential animation;
- Tab reveals visible focus;
- decorative videos are ignored by assistive technology;
- headings follow one `h1` then section `h2` hierarchy.

- [ ] **Step 5: Re-run final checks**

Run:

```powershell
pnpm run build
pnpm run lint
```

Expected: both commands exit 0 after any visual fixes.

- [ ] **Step 6: Confirm content against the source CV**

Compare every number, certification, employer, date, and technology displayed
in `src/App.tsx` with `C:\Users\s3nafps\Downloads\Mohamed_Senator.pdf`.

Expected: no invented projects or unsupported claims appear.

- [ ] **Step 7: Commit if Git metadata is available**

```powershell
git add src/App.tsx src/index.css
git commit -m "fix: polish responsive portfolio experience"
```

Expected in this workspace: skip because `.git` is absent.

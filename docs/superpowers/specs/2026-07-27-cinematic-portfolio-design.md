# Mohamed Senator Cinematic Portfolio Design

## Goal

Rebuild the existing portfolio as a dark, cinematic single-page website that
appeals equally to Systems Administrator and Cloud/DevOps recruiters. The
visual direction follows the supplied Prisma landing-page prompt while all
personal claims come from `Mohamed_Senator.pdf`.

## Content Rules

- Use only facts supported by the supplied CV.
- Remove the existing invented project entries and unsupported performance
  claims.
- Present Mohamed as a Systems Administrator whose infrastructure operations
  experience naturally extends into PowerShell automation and cloud
  engineering.
- Keep the downloadable CV, email, LinkedIn, and GitHub links.
- Do not add a contact form, CMS, backend, analytics, or project-detail pages.
- Leave room for a future selected-project showcase sourced from Mohamed's
  GitHub profile, but do not render projects or call the GitHub API in this
  version.

## Page Structure

The page contains three primary sections and a compact footer.

### 1. Hero

- Full-viewport inset composition with rounded corners.
- Use the supplied cinematic hero video with a black gradient and SVG noise
  overlay.
- Show a compact pill-shaped navigation with links to About, Capabilities,
  Experience, LinkedIn, and Contact.
- Display `Mohamed Senator` as the dominant responsive heading.
- Use `Systems Administrator & Cloud Engineer` as the role label.
- Use a concise introduction based on the CV: enterprise infrastructure,
  PowerShell automation, and operational reliability.
- Provide a primary action to view experience and a secondary CV download.
- Include concise proof points: Algiers, 4+ years, and Google Cloud ACE.
- If the video cannot load, retain a readable dark gradient background.

### 2. About

- Use a centered dark card on black.
- Introduce Mohamed as a systems administrator with 4+ years of experience
  supporting Windows infrastructure across enterprise, manufacturing, and
  government environments.
- Highlight environments serving up to 4,000+ users.
- Use Instrument Serif italic only for selected phrases; all other copy uses
  Almarai.
- Animate heading words upward once when entering the viewport.
- Reveal the supporting paragraph progressively during scroll.

### 3. Capabilities and Experience

- Use a subtle SVG noise texture behind the section.
- Lead with a two-line statement about stable systems and automated operations.
- Show four responsive cards:
  1. Windows Infrastructure: Windows Server, Active Directory, Group Policy,
     Microsoft Exchange, and Microsoft 365.
  2. PowerShell Automation: health checks, system audits, data collection,
     dashboards, and operational reporting.
  3. Networking and Security: TCP/IP, Cisco, Fortinet FortiGate, LAN/WAN, PKI,
     vulnerability remediation, and patch management.
  4. Cloud and Virtualization: Google Cloud Platform, VMware vSphere, Hyper-V,
     and Google Cloud Associate Cloud Engineer certification.
- The first card uses the supplied secondary video; the remaining cards use
  dark surfaces and concise checklists.
- Follow the cards with a compact chronological experience list:
  AGCE, Agrofilm Packaging Algeria, Samsung, IRIS SATEREX, and Brandt Algeria.
- Each role includes dates, title, employer, and a short CV-grounded summary.

### Footer

- Show the email address as the primary contact action.
- Include LinkedIn, GitHub, and CV links.
- Include Algiers, Algeria and the current year.

## Visual System

- Global background: `#000000`.
- About surface: `#101010`.
- Capability cards: `#212121`.
- Primary text: `#E1E0CC`.
- Utility cream: `#DEDBC8`.
- Secondary text: neutral gray.
- Typography: Almarai 300/400/700/800 globally and Instrument Serif italic for
  accent phrases.
- Use rounded containers, generous negative space, and restrained borders.
- Apply SVG fractal-noise overlays to the hero and capabilities background.
- Avoid stock illustrations, fabricated dashboards, or decorative technology
  cliches.

## Interaction and Animation

- Use Framer Motion for word pull-up, fade-up, scroll-linked character opacity,
  and staggered card entrances.
- Use Lucide React for arrow and check icons.
- Keep hover effects limited to clear affordances: link color changes, small
  arrow movement, and restrained button scaling.
- Honor `prefers-reduced-motion` by disabling nonessential movement.
- Smooth-scroll internal navigation while maintaining visible keyboard focus.

## Responsive Behavior

- Hero typography scales fluidly across mobile, tablet, and desktop.
- Navigation uses smaller type and tighter gaps on narrow screens without
  horizontal overflow.
- Hero content stacks on mobile and uses a 12-column layout on desktop.
- Capability cards render as one column on mobile, two on tablet, and four on
  desktop.
- Experience rows stack dates above role details on narrow screens.
- All controls remain at least comfortably tappable and all body copy remains
  readable without zoom.

## Technical Design

- Keep the existing Vite and TypeScript foundation.
- Replace the current Astryx-based UI with React components styled through
  Tailwind CSS 3.
- Add only the prompt-required dependencies: Tailwind CSS, PostCSS,
  Autoprefixer, Framer Motion, and Lucide React.
- Store capability and experience content in local typed arrays.
- Use shared `WordsPullUp` and `WordsPullUpMultiStyle` components for animated
  headings.
- No network data fetching or application state is required.
- External links use `target="_blank"` with `rel="noreferrer"`.
- The CV download remains a static file in `public`.

## Deferred GitHub Project Showcase

- A later iteration can add a `Selected Projects` block without changing the
  visual system or the three-section page structure.
- Projects should be curated rather than importing every public repository.
- Each project entry should support a name, concise summary, technology list,
  repository URL, and optional year or cover image.
- Start with a local typed project list when the showcase is requested.
- Add GitHub API synchronization only if keeping project metadata updated
  manually becomes a demonstrated problem.
- This deferred capability adds no UI, API calls, tokens, or dependencies to
  the current implementation.

## Error Handling and Accessibility

- Provide a dark visual fallback behind videos.
- Keep content usable if remote videos or Google Fonts fail.
- Use semantic `header`, `nav`, `main`, `section`, `ol`, and `footer` elements.
- Provide descriptive navigation labels and visible focus states.
- Treat decorative videos and texture overlays as nonessential and hidden from
  assistive technology.
- Maintain sufficient text contrast throughout.

## Verification

- Run the production TypeScript/Vite build.
- Run the configured lint command.
- Inspect the rendered page at mobile, tablet, and desktop widths.
- Verify there is no horizontal overflow.
- Verify navigation, mail, social, and CV links.
- Verify video fallback behavior and reduced-motion behavior.
- Confirm every personal statement against the supplied CV.

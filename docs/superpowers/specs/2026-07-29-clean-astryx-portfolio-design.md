# Clean Astryx Portfolio Design

## Goal

Redesign Mohamed Senator's recruiter-facing portfolio around a clean, modern Astryx visual system. Keep every CV-grounded fact and existing public link, correct the identity everywhere to **Mohamed Senator**, remove the existing capability imagery, and use an identity-preserving portrait derived from the supplied selfie.

## Direction

The selected direction is **Clean Astryx portfolio**.

- Light/day theme is the default.
- A visible control switches between light and dark themes.
- The visual language uses warm cream, stone, black typography, restrained borders, generous space, and no purple or glow.
- The site remains a full recruiter-first single page rather than a hero-only landing page.
- The editorial marquee and full-bleed cinematic portrait direction are explicitly excluded.

Astryx is the design-system reference and implementation foundation. Use `@astryxdesign/core` and the neutral theme for controls, accessible interaction patterns, and theme tokens where they materially help. Use semantic plain CSS for the portfolio-specific layout; do not add Tailwind.

## Page Structure

1. Header
2. Hero
3. Proof rail
4. Capabilities
5. Experience
6. Operating approach
7. Contact

### Header

- Brand text: `Mohamed Senator`.
- Links: Experience, Capabilities, CV, and Contact.
- Light/dark theme toggle with an accessible name and visible focus state.
- Mobile navigation uses a full-screen drawer and restores body scrolling when closed.

### Hero

Use a spacious two-column composition.

- Left column:
  - Systems Administrator / Cloud Engineer eyebrow.
  - Infrastructure-focused headline grounded in the existing portfolio positioning.
  - Concise CV-backed introduction.
  - Experience and Download CV actions.
- Right column:
  - One identity-preserving portrait created from the supplied selfie.
  - Clean neutral studio background.
  - No embedded text, logos, watermark, marquee, or cinematic overlay.
- On mobile, content stacks above the portrait.

### Proof Rail

Retain the verified proof points:

- 4+ years
- 4,000+ users
- Google Cloud ACE
- Algiers

### Capabilities

Retain the four CV-grounded capability groups and their text, but rebuild them as numbered typographic blocks.

- Windows Infrastructure
- PowerShell Automation
- Networking & Security
- Cloud & Virtualization

Remove:

- The `image` field from the `Capability` type and data.
- All capability image markup.
- Capability image CSS.
- The four WebP files in `public/images`.

### Experience

Keep the existing chronological CV-grounded experience data and summaries. Present it as a restrained, readable timeline using Astryx-inspired spacing, typography, and borders.

### Operating Approach

Keep the Reliability → Automation → Cloud narrative as three concise text blocks.

### Contact

Keep email, LinkedIn, GitHub, and CV links. Use a high-contrast terminal section that works in both themes without reintroducing cinematic styling.

## Theme Behavior

- Default to light mode on first visit, regardless of operating-system preference.
- Store only an explicit visitor selection in `localStorage`.
- Apply the selected theme before the first meaningful paint where practical to avoid a flash.
- Both themes must maintain visible focus states, readable contrast, and consistent layout.
- Theme control must expose its current state to assistive technology.

## Portrait Generation

Use the built-in image-generation path in identity-preserving edit mode.

### Source

`C:\Users\s3nafps\Downloads\Adobe Express - file.png`

### Production Brief

- Use case: `identity-preserve`
- Asset type: portfolio hero portrait
- Preserve Mohamed's face, skin tone, body proportions, shaved hairstyle, expression, and recognizable appearance.
- Preserve the simple dark shirt.
- Change only the crop, lighting, neutral studio background, and placement needed for the clean Astryx hero.
- Use soft daylight-style studio lighting and a warm cream/stone background compatible with both themes.
- Keep negative space around the subject for responsive cropping.
- No text, logos, watermark, accessories, extra people, or dramatic effects.

The selected output must be copied into `public/` and referenced locally. The original download must not be modified.

## Metadata and Identity

- Document title: exactly `Mohamed Senator`.
- Description and visible copy must use `Mohamed Senator`; do not use `Mohamed Amine Difallah`.
- Existing public email, LinkedIn, GitHub, and CV URLs remain unchanged.

## Motion and Accessibility

- Use only restrained entrance reveals.
- Disable nonessential motion under `prefers-reduced-motion: reduce`.
- Preserve semantic heading order, keyboard navigation, minimum touch targets, descriptive link names, and visible focus states.
- Decorative portrait treatment must not duplicate meaningful text.

## Technical Scope

- Keep Vite, React, TypeScript, Framer Motion, Lucide React, and the existing CV data.
- Add only the Astryx core and neutral-theme packages required by this design.
- Do not add a CMS, API, analytics, contact form, project showcase, or Tailwind.
- No capability images remain in the source or deployed build.

## Verification

Run:

- `pnpm test`
- `pnpm run lint`
- `pnpm run build`

Browser-test at 390 px, 768 px, and desktop width:

- No horizontal overflow or console warnings.
- Light mode is the first-visit default.
- Theme toggle changes the page, persists the explicit selection, and exposes its state.
- Mobile menu opens and closes and restores body scrolling.
- Portrait loads without layout shift or distortion.
- Capability blocks contain no images.
- Navigation anchors, email, LinkedIn, GitHub, and CV links resolve correctly.
- Heading hierarchy, focus states, contrast, and touch targets remain accessible.

After verification, merge to `main`, push the source, rebuild `gh-pages`, and verify `https://s3nafps.github.io/` serves the new compiled assets without browser errors.

# Full Xero-Inspired Portfolio Design

## Goal

Restructure Mohamed Senator's portfolio into a recruiter-first single page using the approved A1 visual direction. Preserve all CV-grounded facts and public links while replacing the current cinematic styling.

## Page Structure

1. Hero with responsive navigation, animated infrastructure pipeline, experience CTA, and CV download.
2. Proof rail with four facts: 4+ years, 4,000+ users supported, Google Cloud ACE, and Algiers.
3. Four capability cards for Windows, PowerShell, Networking and Security, and Cloud and Virtualization.
4. Chronological experience timeline.
5. Operating approach narrative: Reliability → Automation → Cloud.
6. Contact card with email, LinkedIn, GitHub, and CV.

Projects remain deferred.

## Visual Direction

- Use Inter on a near-black page.
- Use rounded dark surfaces, restrained borders, generous spacing, and a responsive editorial grid.
- Reproduce the pink-to-white radial arc and masked crosshatch grid in the hero.
- Echo the arc subtly in the contact section.
- Keep magenta limited to arcs, beams, active states, and small accents.
- Use the existing generated capability images as muted visual bands rather than full-card backgrounds.

## Hero and Navigation

- Brand: `Mohamed Senator`
- Navigation: `Experience`, `Capabilities`, `CV`, `Contact`
- Eyebrow: `Systems Administrator · Cloud Engineer`
- Heading: `Systems built to stay available.`
- Supporting copy: `I engineer secure Windows infrastructure, automate recurring operations, and extend reliable systems into the cloud.`
- Actions: `View experience` and `Download CV`
- Mobile navigation uses a hamburger-controlled full-screen overlay and restores body scrolling on close or unmount.

## Animated Pipeline

The pipeline communicates infrastructure → automation → secure cloud delivery:

1. Left layers node: Windows infrastructure.
2. Center `MS` monogram: automation and operational control.
3. Right shield-check node: secure cloud delivery.

An SVG beam follows the measured centers of all three nodes. A requestAnimationFrame state machine runs a 3.4-second loop:

- 800 ms from the left node to the center.
- 800 ms center splash.
- 800 ms from the center to the right node.
- 1000 ms idle pause.

The SVG path is recalculated on mount and resize. The animation stops cleanly on unmount. With reduced motion, the pipeline remains visible with a centered static beam.

## Capabilities and Experience

- Capability content and images continue to come from the typed local `capabilities` array.
- Each card has a restrained image band, number, title, description, and three supporting items.
- Experience continues to come from the typed local `experience` array.
- Timeline rows show dates, role, company, location, and CV-grounded summary.

## Operating Approach and Contact

- Replace the standalone About block with three connected ideas: Reliability, Automation, and Cloud.
- Use the existing 4+ years, enterprise/manufacturing/government, and 4,000+ users facts in concise supporting copy.
- Close with a dark contact card, subtle arc echo, email address, social links, CV link, Algiers, and the current year.

## Technical Boundaries

- Keep React, TypeScript, Vite, Framer Motion, Lucide React, and existing typed content.
- Use semantic class names and plain CSS for the new presentation.
- Add no API, CMS, analytics, backend, contact form, or project showcase.
- Remove the remote hero video and continuous nonessential motion.

## Responsive and Accessibility Requirements

- Support desktop, tablet, and 390 px mobile widths without horizontal overflow.
- Preserve readable card text and image cropping at every breakpoint.
- Use semantic landmarks and heading order, visible focus states, descriptive labels, and comfortable touch targets.
- Honor reduced motion and keep all content usable if Google Fonts fails.

## Validation

- Run tests, TypeScript checking, and the production Vite build.
- Verify the pipeline geometry, reduced-motion fallback, menu scroll locking, image loading, navigation, CV, email, and social links.
- Confirm no browser console warnings or horizontal overflow at 390 px, 768 px, and desktop widths.
- Deploy the verified build to the existing `s3nafps.github.io` GitHub Pages site.

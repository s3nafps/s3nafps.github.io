# Xero-Inspired Portfolio Hero Design

## Goal

Create a separate local preview of a replacement hero for Mohamed Senator's portfolio. The preview adapts the supplied Xero visual direction to Mohamed's professional identity without changing the current portfolio or deployed GitHub Pages site.

## Scope

The preview covers the navbar, hero card, animated icon pipeline, primary call to action, and expertise row only. Existing experience, capabilities, projects, contact sections, and production deployment remain unchanged.

## Visual Direction

- Use Inter on a near-black page.
- Center a rounded dark hero card beneath a compact three-column navbar.
- Reproduce the pink-to-white radial arc and masked crosshatch grid from the supplied direction.
- Keep purple and magenta confined to the arc, beam, splash, and small active-node highlights.
- Use restrained monochrome typography and controls elsewhere.

## Content

- Brand: `Mohamed Senator`
- Navigation: `Experience`, `Capabilities`, `Contact`
- Eyebrow: `Systems Administrator · Cloud Engineer`
- Heading: `Systems built to stay available.`
- Supporting copy: `I engineer secure Windows infrastructure, automate recurring operations, and extend reliable systems into the cloud.`
- Primary action: `View experience`
- Expertise row: `Microsoft`, `PowerShell`, `Google Cloud`, `VMware`, `Fortinet`

## Animated Pipeline

The pipeline communicates Mohamed's operating model:

1. Left layers node: Windows infrastructure.
2. Center `MS` monogram: automation and operational control.
3. Right shield-check node: security and cloud-ready delivery.

An SVG beam follows the measured centers of all three nodes. A requestAnimationFrame state machine runs a 3.4-second loop:

- 800 ms from the left node to the center.
- 800 ms center splash.
- 800 ms from the center to the right node.
- 1000 ms idle pause.

The SVG path is recalculated on mount and resize. The animation stops cleanly on unmount. When reduced motion is requested, the pipeline remains visible without continuous movement.

## Responsive Behavior

- Desktop retains the centered three-column navbar and full pipeline.
- Below 860 px, the pipeline connectors shorten.
- At 768 px and below, the navbar uses a hamburger-controlled full-screen menu, nodes shrink, and hero spacing tightens.
- At 480 px and below, corner radii and expertise-row gaps reduce.
- Opening the mobile menu locks body scrolling; closing or unmounting restores it.

## Implementation Boundary

The prototype will live only in the brainstorming preview directory. It will not edit `src/`, deploy to GitHub Pages, or replace the current hero until the user explicitly approves the rendered preview.

## Validation

- Confirm the preview renders at desktop and mobile widths.
- Confirm the pipeline path connects all node centers after resize.
- Confirm the menu opens, closes, and restores body scrolling.
- Confirm reduced-motion behavior.
- Confirm the preview has no horizontal overflow or browser console errors.

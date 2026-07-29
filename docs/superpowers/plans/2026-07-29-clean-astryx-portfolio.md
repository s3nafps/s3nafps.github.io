# Clean Astryx Portfolio Implementation Plan

**Goal:** Replace the current dark cinematic portfolio with the approved light-first Clean Astryx portfolio, using Mohamed Senator's selfie, image-free capability cards, and a persistent dark-mode toggle.

**Architecture:** Keep the existing single-page React structure and CV-backed content. Use Astryx core and its neutral theme for the UI foundation, plain CSS for the responsive portfolio layout, and a small local theme state in `App.tsx`.

**Tech stack:** React 19, TypeScript, Vite, Astryx, Framer Motion, Vitest

---

### Task 1: Lock the new public contract

**Files:**
- Modify: `src/portfolio.test.ts`
- Modify: `src/content.test.ts`

1. Add assertions for the exact page title, Astryx styling imports, light-first theme contract, portrait asset, and image-free capabilities.
2. Run `pnpm test` and confirm the new assertions fail against the old portfolio.
3. Commit the failing contract tests.

### Task 2: Prepare the portrait and Astryx foundation

**Files:**
- Create: `public/mohamed-senator-portrait.webp`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `src/main.tsx`

1. Generate an identity-preserving studio portrait from `C:\Users\s3nafps\Downloads\Adobe Express - file.png`.
2. Inspect the result and place the final optimized asset in `public`.
3. Install `@astryxdesign/core` and `@astryxdesign/theme-neutral`.
4. Confirm the package exports, then wrap the app in the neutral Astryx theme.

### Task 3: Rebuild the portfolio

**Files:**
- Modify: `index.html`
- Modify: `src/App.tsx`
- Modify: `src/content.ts`
- Modify: `src/index.css`
- Delete: `public/images/windows-infrastructure.webp`
- Delete: `public/images/powershell-automation.webp`
- Delete: `public/images/networking-security.webp`
- Delete: `public/images/cloud-virtualization.webp`

1. Set the document title to exactly `Mohamed Senator` and apply a stored explicit dark preference before paint.
2. Remove capability image data, markup, styles, and files.
3. Replace the animated pipeline hero with the approved clean two-column portrait hero.
4. Retain the existing recruiter-first sections and CV-grounded claims.
5. Add an accessible light/dark toggle, responsive navigation, visible focus states, and reduced-motion behavior.
6. Restyle the full page with a light editorial grid, neutral Astryx surfaces, restrained green accents, and a matching dark theme.

### Task 4: Verify and release

**Files:**
- Modify only if verification reveals an issue.

1. Run `pnpm test`, `pnpm run lint`, and `pnpm run build`.
2. Browser-check desktop, 768 px, and 390 px layouts; verify navigation, theme persistence, CV and contact links, console output, and horizontal overflow.
3. Commit the verified implementation and push `main`.
4. Publish `dist` to `gh-pages`.
5. Verify `https://s3nafps.github.io/` serves the rebuilt portfolio without asset or console errors.

# Design options (pending choice)

Three clean directions for the portfolio, all built on the same markup in `src/App.tsx`.
Each `option-*.css` is a complete drop-in replacement for `src/index.css`.

- **A: Minimal editorial**: white page, hairline rules instead of boxes, blue accent.
- **B: Soft cards**: light grey page, white cards, teal accent, dark contact block.
- **C: Sidebar résumé**: fixed left sidebar with name, nav and links; indigo accent.

`src/index.css` currently holds option B, the closest to the existing layout.
This folder is removed once a direction is chosen.

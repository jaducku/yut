# Agent.md (For 2D Yutnori Game with Pixi.js)

## Development Environment Tips

* **Jump to a package:**
  Use `pnpm dlx turbo run where <project_name>` to quickly navigate to a package.
* **Add package to workspace:**
  Run `pnpm install --filter <project_name>` so Vite, ESLint, and TypeScript can recognize it.
* **Scaffold a new project:**
  `pnpm create vite@latest <project_name> -- --template react-ts` → sets up a React + Vite + TypeScript project.
* **Check package names:**
  Confirm the `name` field in each package’s `package.json` (skip the top-level one).
* **Node/Bun engines:**
  Set `engines` to Node.js >=20 (or Bun >=1.1). Prefer Node.js for CI unless Bun is explicitly required.
* **Core dependencies (per package needs):**

  * State management: `zustand`
  * Networking/schema: `@colyseus/schema`, `colyseus.js`
  * Validation: `zod`
  * Testing: `vitest`, `@playwright/test`
  * **2D rendering:** `pixi.js`
  * UI styling: `tailwindcss` (optional)

## Graphics & Assets

* **Rendering engine:** Pixi.js (WebGL under the hood, but fully abstracted for 2D use).
* **Asset formats:** `.png`, `.jpg`, `.svg` (sprite sheets recommended for performance).
* **Animations:** Implemented using Pixi.js `AnimatedSprite` or frame-based sequences.
* **Audio:** Use PixiJS Sound (`@pixi/sound`) with `.mp3`/`.ogg`.
* **Scene setup:**

  * Create a root Pixi Application.
  * Manage containers for board, pieces, UI overlays.
  * Use a small renderer factory if multiple views (menu vs game).

## Testing Instructions

* **CI plan:** Found in `.github/workflows`.
* **Run package tests:**
  `pnpm turbo run test --filter <project_name>`
* **From package root:**
  `pnpm test`
* **Focus on one test:**
  `pnpm vitest run -t "<test name>"`
* **Linting & type checks:**
  `pnpm lint --filter <project_name>`
* **Test coverage requirements:**

  * **Unit tests (game logic):**

    * Throw resolution (Do/Gae/Geol/Yut/Mo)
    * Shortcut branching
    * Capture/stacking
    * Win condition
  * **E2E smoke tests:**
    Run `pnpm playwright test` to verify core flow: start game → throw → move → capture → win.

## Pull Request Instructions

* **Title format:** `[<project_name>] <Title>`
* **Pre-commit checks:** Run `pnpm lint` and `pnpm test`.
* **Include notes:**

  * Short description of any rule/UX changes.
  * Attach GIF/screenshot if UI is affected (e.g., animations or layout).
* **Bundle size:**
  Run `pnpm build` + report. Confirm performance budget compliance.

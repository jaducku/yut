## Dev environment tips

* Use `pnpm dlx turbo run where <project_name>` to jump to a package instead of scanning with `ls`.
* Run `pnpm install --filter <project_name>` to add the package to your workspace so Vite, ESLint, and TypeScript can see it.
* Use `pnpm create vite@latest <project_name> -- --template react-ts` to spin up a new React + Vite package with TypeScript checks ready.
* Check the `name` field inside each package's `package.json` to confirm the right name—skip the top-level one.
* Set engines to Node.js **>=20** (or Bun **>=1.1**) in `package.json`; prefer Node for CI unless Bun is explicitly required.
* Add core deps per package needs: `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `@colyseus/schema`, `colyseus.js`, `zod`, `vitest`, `@playwright/test`.
* Feature-detect WebGPU (`navigator.gpu`) and fall back to WebGL2 automatically; keep the renderer behind a small `createRenderer()` factory.
* Use glTF/GLB for assets; wire up KTX2/Basis, Draco/meshopt decoders once at app start.

## Testing instructions

* Find the CI plan in the `.github/workflows` folder.
* Run `pnpm turbo run test --filter <project_name>` to run every check defined for that package.
* From the package root you can just call `pnpm test`. The commit should pass all tests before you merge.
* To focus on one step, add the Vitest pattern: `pnpm vitest run -t "<test name>"`.
* Fix any test or type errors until the whole suite is green.
* After moving files or changing imports, run `pnpm lint --filter <project_name>` to be sure ESLint and TypeScript rules still pass.
* Add or update tests for the code you change, even if nobody asked.
* For gameplay logic, include unit tests for: throw resolution (Do/Gae/Geol/Yut/Mo), shortcut branching, capture/stack, win condition.
* For e2e smoke, run `pnpm playwright test` to verify basic flows: start game → throw → move → capture → win.

## PR instructions

* Title format: `[<project_name>] <Title>`
* Always run `pnpm lint` and `pnpm test` before committing.
* Include a short note on any rules/UX changes and a GIF/screenshot when UI is affected.
* If you touched assets/build, attach a bundle size diff (e.g., `pnpm build` + report) and confirm performance budget still holds.

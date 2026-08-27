# CLAUDE.md — FrontEndReact

Guidance for working in the React SPA. See the repo root `CLAUDE.md` for cross-cutting/run/test commands.

## Layout

- `src/View/<Role>/...` — screens grouped by who sees them (`Admin`, `Student`, `Login`, `Logout`, `Navbar`, `Error`, `Loading`, `Success`). Within a role, further split into task folders (e.g. `Admin/Add/AddCourse/`, `Admin/View/...`).
- `src/View/Components/` — shared/reusable components (buttons, dropdowns, modals, data tables) used across multiple views.
- `src/types/` — shared TypeScript interfaces for domain entities (`Team.tsx`, `Course.tsx`, `Rubric.tsx`, `User.tsx`, ...). Despite the `.tsx` extension these are type-only files.
- `src/Enums/` — TS enums (`Role.tsx`, `HttpStatusCodes.tsx`, `RequestState.tsx`).
- `src/Constants/` — shared constant values/components (e.g. `ButtonSpinner.tsx`, `password.ts`).
- `src/utils/` — standalone utility functions (e.g. `passwordUtils.ts`).
- `src/utility.ts` — the generic API client (see below) plus shared cross-cutting helpers; this is distinct from `src/utils/`.
- `src/LibAdapters/` — thin wrappers around third-party libraries (e.g. `MUIDataTable.tsx`) to isolate the rest of the app from a library's API.
- Every folder with a component gets its own `__tests__/` subfolder colocated with the component, not a top-level test tree.

## Stack conventions

- Vite + TypeScript (`strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` — new code must satisfy these, don't loosen tsconfig to work around a type error).
- MUI (`@mui/material`) is the component library; prefer MUI primitives and `styled()` over raw CSS where reasonable. Global overrides live in `SBStyles.css`.
- Routing via `react-router-dom` (`App.tsx`).
- Components are function components with typed `Props` interfaces (e.g. `interface BackButtonProps { ... }`), default-exported.

## Calling the backend

Never call `fetch` directly against the API. Use the generic helpers in `src/utility.ts`:

```ts
genericResourceGET(fetchURL, resourceKey, component, options?)
genericResourcePOST(fetchURL, component, body, options?)
genericResourcePUT(fetchURL, component, body, options?)
genericResourceDELETE(fetchURL, component, options?)
```

These prepend `apiUrl` (from `App.tsx`, sourced from `VITE_API_URL`), attach `user_id` from the `user` cookie, unwrap the backend's `{ success, content: { <resource>: [...] } }` envelope, and transparently handle 401s via `refreshLock.tsx` (silent token refresh, then retry once) and full logout when refresh fails. Auth tokens/user info live in cookies via `universal-cookie`, not localStorage.

## Testing

- Jest + `@testing-library/react`, jsdom environment (config lives in `package.json`, not a separate jest.config file).
- **Jest tests need the backend running and reachable** (`REACT_APP_API_URL`/`VITE_API_URL` pointed at it) — they exercise real login/API flows, not mocks, for most integration-style component tests.
- Tests are driven by `aria-label` almost exclusively — see `src/JestTestDocumentation.md` and `src/testUtilities.ts` for the helpers (`clickElementWithAriaLabel`, `changeElementWithAriaLabelWithInput`, `expectElementWithAriaLabelToBeInDocument`, etc.). When adding a new interactive element that a test will need to target, give it a unique `aria-label` rather than relying on text/role queries.
- Run a single file: `npm test path/to/File.test.tsx` (from `FrontEndReact/`).
- Lint: `npx eslint --max-warnings=0 .` — CI fails on any warning, not just errors.

## Types reference

`src/TYPES.md` documents the shared domain types in `src/types/` in more depth — check it before inventing a new shape for an entity that likely already has one.

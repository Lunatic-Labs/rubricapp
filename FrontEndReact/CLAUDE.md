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
- Tests generally live in a `__tests__/` subfolder colocated with the component, and that's the convention to follow for new ones. Coverage is uneven, though: `View/Components/` has 14 components and a single test, and `src/__tests__/utility.test.ts` is a top-level exception — so don't assume a given component already has a test folder.

## Stack conventions

- Vite + TypeScript (`strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` — new code must satisfy these, don't loosen tsconfig to work around a type error).
- MUI (`@mui/material`) is the component library; prefer MUI primitives and `styled()` over raw CSS where reasonable. Global overrides live in `SBStyles.css`.
- Routing via `react-router-dom` (`App.tsx`) — but there are only two `<Route>`s: `/` renders `<Login/>`, `*` redirects back to `/`. React Router isn't the app's real navigation; `Login.tsx`'s `render()` is a chain of early returns driven by component state (`resettingPassword` → reset flow, `!loggedIn` → login form, `hasSetPassword === false` → forced password-set screen, else → the logged-in app shell). Screens inside the shell are switched the same way, by state rather than URL, so there's no deep-linking — keep new top-level screens consistent with that pattern rather than introducing real routes for them.
- Components are mostly class components (`extends Component<Props, State>`) in the existing codebase; prefer function components for new reusable UI where practical, and always type `Props`/`State` explicitly (e.g. `interface BackButtonProps { ... }`), default-exported.
- `componentDidMount` → `genericResourceGET(url, "resourceKey", this)` is the standard data-fetch shape used by nearly every `Admin*`/`Student*` wrapper component: on success it sets `isLoaded: true`, clears `errorMessage`, and stores the payload under `resourceKey`; on failure it sets `errorMessage` instead. Initialization of `isLoaded` is split about evenly in the existing code: roughly half of these components start it at `null` (typed `boolean | null`) so `render()` can distinguish "not yet attempted" / "loaded" / "failed" with one field, and roughly half start it at `false` (typed `boolean` — e.g. `AdminViewTeams.tsx`, `StudentViewAssessmentTask.tsx`). Both are idiomatic here, so follow whichever the surrounding component's `State` type already uses; reuse these field names rather than inventing new loading-state flags.
- When API data carries a bare `user_id`/`role_id`/etc. without the associated name (most rating/roster/assessment payloads do), build an `id → name` lookup map once via the `parse*` helpers in `utility.ts` (`parseUserNames`, `parseRoleNames`, `parseRubricNames`) from whichever endpoint *does* return full objects, then do cheap lookups elsewhere — don't re-fetch or re-join data the app already has in state just to resolve a name.

## Calling the backend

For **authenticated** resource requests, don't call `fetch` directly — use the generic helpers in `src/utility.ts`:

```ts
genericResourceGET(fetchURL, resourceKey, component, options?)
genericResourcePOST(fetchURL, component, body, options?)
genericResourcePUT(fetchURL, component, body, options?)
genericResourceDELETE(fetchURL, component, options?)
```

These prepend `apiUrl` (from `App.tsx`, sourced from `VITE_API_URL`), attach `user_id` from the `user` cookie, unwrap the backend's `{ success, content: { <resource>: [...] } }` envelope, and transparently handle 401s via `refreshLock.tsx` (silent token refresh, then retry once) and full logout when refresh fails. Auth tokens/user info live in cookies via `universal-cookie`, not localStorage. Avoid `document.cookie`; `genericResourceFetch`/`refreshLock` use `new Cookies().get(...)` and `genericResourceFetch` sets `Authorization: Bearer <token>` for you.

The helpers bail out early with `errorMessage: "Not authenticated"` when the `access_token`/`refresh_token`/`user` cookies are absent, so pre-auth and token-lifecycle flows genuinely cannot use them — login, password reset (`utils/passwordUtils.ts`) and the refresh call itself (`refreshLock.tsx`) legitimately use raw `fetch`. Anything running with a logged-in user should go through the helpers. (`fix/unauthenticated-password-reset` is moving some of these onto `utility.ts`, so re-check this once it merges.)

On a token-expiry failure, `handleTokenErrorsAndRetry` calls `refreshAccessTokens()` (`refreshLock.tsx`) before giving up — `refreshLock` holds a single in-flight refresh promise so multiple components hitting an expired token at once share one `/refresh` call instead of firing several redundant ones. The retried request is re-issued exactly once with `isRetry: true` so a still-failing refresh can't loop.

## Testing

- Jest + `@testing-library/react`, jsdom environment (config lives in `package.json`, not a separate jest.config file).
- **Jest tests need the backend running and reachable** (`VITE_API_URL` pointed at it) — they exercise real login/API flows, not mocks, for most integration-style component tests.
- Tests select elements by `data-testid` — see `src/JestTestDocumentation.md` and `src/testUtilities.ts` for the helpers (`clickElementWithTestId`, `changeElementWithTestIdWithInput`, `expectElementWithTestIdToBeInDocument`, etc.). When a test needs to target a new element, give it a unique kebab-case `data-testid` (e.g. `data-testid="courses-title"`); for an MUI `Select`, pass it through `SelectDisplayProps={selectTestId("...")}` (`src/utils/selectTestId.ts`) so it lands on the clickable combobox. Keep `aria-label` for what screen readers should announce: a human-readable name such as "Delete user" on icon-only controls, not a test hook. Elements with visible text (headings, labelled buttons, menu options) usually need no `aria-label` at all, since it would replace that text as their accessible name.
- Run a single file: `npm test path/to/File.test.tsx` (from `FrontEndReact/`).
- Lint: `npx eslint --max-warnings=0 .` — CI fails on any warning, not just errors.

## Types reference

`src/TYPES.md` documents the shared domain types in `src/types/` in more depth — check it before inventing a new shape for an entity that likely already has one.

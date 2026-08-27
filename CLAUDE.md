# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

SkillBuilder (rubricapp) is a web app for instructors to assess student teams in real time against research-based or custom rubrics. It's a two-part app in one repo:

- `BackEndFlask/` — Python 3.12 / Flask REST API (MySQL, Redis, JWT auth). See `BackEndFlask/CLAUDE.md`.
- `FrontEndReact/` — TypeScript / React SPA (Vite, MUI). See `FrontEndReact/CLAUDE.md`.

Each side has its own conventions — read the nested CLAUDE.md for whichever side you're editing.

## Running the app

Docker Compose is the primary supported workflow (bare-metal Windows is not supported; Linux/macOS/WSL2 only outside Docker).

```bash
docker compose build        # rebuild images (needed after Dockerfile changes)
docker compose up           # start backend (5050->5000), frontend (3000), mysql, redis
```

Without Docker:

```bash
# Backend
cd BackEndFlask
python3 ./setupEnv.py -irds   # first run: install deps, reset db, load demo data, start server
python3 ./setupEnv.py -s      # subsequent runs

# Frontend
cd FrontEndReact
npm install   # once
npm run dev   # vite dev server on :3000
```

`setupEnv.py` flags: `-i` install deps, `-r` reset db, `-d` load demo data, `-s` start server, `-t` run tests instead of starting the server.

## Tests

```bash
# Backend (from BackEndFlask/)
python3 -m pytest Tests/                      # all
python3 -m pytest Tests/unit -n auto           # unit, parallel (matches CI)
python3 -m pytest Tests/integration            # integration (needs a running MySQL/Redis)
python3 -m pytest -k "test_specific_function"  # single test by name

# Frontend (from FrontEndReact/)
npm test                       # jest — requires the backend to be running and reachable
npm test examplefile.test.tsx  # single file
```

CI (`.github/workflows/ci.yml`) runs `pytest Tests/unit`, sharded `pytest Tests/integration` (3 shards), `npm test`, and `npx eslint --max-warnings=0 .` on the frontend. Match these locally before pushing.

## Cross-cutting architecture

- **Auth**: JWT access/refresh tokens (flask-jwt-extended), issued by `Login_route.py`, blacklisted-on-logout via Redis (`controller/security/blacklist.py`). The frontend stores tokens in cookies (`universal-cookie`) and auto-refreshes via `refreshLock.tsx`.
- **API contract**: every backend response is an envelope `{ success, status, message, content: { <resource>: [...] } }` built by `controller/Route_response.py`. The frontend's generic fetch helpers in `FrontEndReact/src/utility.ts` (`genericResourceGET/POST/PUT/DELETE`) know how to unwrap this envelope and handle 401 refresh/logout — new API calls should go through those, not raw `fetch`.
- **Roles**: three levels (student, TA/observer, admin) enforced server-side via decorators (`AuthCheck`, `admin_check`, `privilege_check`, `super_admin_check` in `controller/security/CustomDecorators.py`) and mirrored client-side by `FrontEndReact/src/View/{Admin,Student,...}` route segregation.
- **Env files**: `.env` at repo root plus `BackEndFlask/.env` and `FrontEndReact/.env` (see `Scripts/quickCreateEnvs.py` for how CI generates them). Never commit real secrets in these.

## Docs worth knowing about

- `Manuals/TECHNICAL_DOCUMENTATION.md` — entry-level architecture tour.
- `Manuals/OAuth2-instructions.md`, `Manuals/HowToChangeDBPasswords.md`, `Manuals/BACKUP_SQL_INSTRUCTIONS.md` — ops/setup procedures.
- `BackEndFlask/Tests/TEST_PLAN.md`, `TEST_PLAN_2.md` — backend test scope/strategy.
- `FrontEndReact/src/JestTestDocumentation.md` — how the `aria-label`-driven Jest test helpers work.
- `FrontEndReact/src/TYPES.md` — shared TypeScript type reference.

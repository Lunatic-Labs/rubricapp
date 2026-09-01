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
- **Roles**: three levels (student, TA/observer, admin) enforced server-side via decorators (`AuthCheck`, `admin_check`, `privilege_check`, `super_admin_check` in `controller/security/CustomDecorators.py`) and mirrored client-side by `FrontEndReact/src/View/{Admin,Student,...}` route segregation. A user's role is per-course, not global — it lives on the `UserCourse` join row (`user_id` + `course_id` + `role_id`), so the same person can be a TA in one course and a student in another.
- **Env files**: `.env` at repo root plus `BackEndFlask/.env` and `FrontEndReact/.env` (see `Scripts/quickCreateEnvs.py` for how CI/local setup generates them). `FrontEndReact/.env`'s `VITE_API_URL` and `BackEndFlask/.env`'s `FRONT_END_URL` are two ends of the same handshake — the former is where the frontend sends requests, the latter is the origin the backend's CORS config allows requests from. Change one port without the other and the browser starts rejecting cross-origin responses. Never commit real secrets in these.
- **One route table, one blueprint**: every file under `BackEndFlask/controller/Routes/` decorates with the same shared `bp = Blueprint('api', __name__)` (`controller/__init__.py`), which is mounted once with `url_prefix='/api'` in `core/__init__.py`. Route files write paths without the `/api` prefix (e.g. `@bp.route('/course')` actually serves `/api/course`).
- **Deploy sequence** (`Cloud/syscontrol.sh`): `--fresh` (lays down the production directory structure) → `--init` (installs system/pip/npm deps, then configures SSL/nginx/gunicorn/firewall/DB) → `--serve` (starts Redis, builds the frontend, runs both halves as background processes). Each stage assumes the previous one already succeeded.

## Docs worth knowing about

- `Manuals/TECHNICAL_DOCUMENTATION.md` — entry-level architecture tour.
- `Manuals/OAuth2-instructions.md`, `Manuals/HowToChangeDBPasswords.md`, `Manuals/BACKUP_SQL_INSTRUCTIONS.md` — ops/setup procedures.
- `BackEndFlask/Tests/TEST_PLAN.md`, `TEST_PLAN_2.md` — backend test scope/strategy.
- `FrontEndReact/src/JestTestDocumentation.md` — how the `aria-label`-driven Jest test helpers work.
- `FrontEndReact/src/TYPES.md` — shared TypeScript type reference.

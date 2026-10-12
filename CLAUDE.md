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

Run the full suites against the `docker compose` stack, as described in `Manuals/RunningCoverageReports.md` (the source of truth for the steps below, including coverage reports). Backend integration tests need real MySQL + Redis, and most frontend tests need a live backend — without one they fail or silently skip most of the code.

1. **Start the stack**: `docker compose up -d`, then `docker ps` to confirm container names (usually `rubricapp-backend-1`, `rubricapp-mysql-1`, …) and `docker port rubricapp-backend-1` for the backend's host port (currently `5050`).

   **Rebuild the backend image after pulling or switching branches**: `docker compose build backend && docker compose up -d --no-deps backend`. `compose.yml` live-mounts only `Functions/`, `controller/`, `core/`, `models/` and `Tests/`. Everything else under `BackEndFlask/` (`constants/`, `enums/`, `setupEnv.py`, `wsgi.py`, `requirements.txt`, …) is copied in at build time, so a stale image runs old copies of those. A new module there typically crashes the backend on startup with `ModuleNotFoundError`. When the backend isn't running, frontend tests fail almost across the board, stuck on the login form.

2. **Never run pytest against the dev database.** `Tests/conftest.py` creates and drops its database around *every* test, so pointing it at `local` (the default `MYSQL_DATABASE`) wipes dev data and can crash the running containers. Use the throwaway `pytest_coverage` database instead; grant access to it once per MySQL volume:

   ```bash
   docker exec rubricapp-mysql-1 sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON pytest_coverage.* TO '"'"'skillbuilder'"'"'@'"'"'%'"'"'; FLUSH PRIVILEGES;"'
   ```

3. **Backend** (unit + integration), inside the backend container:

   ```bash
   docker exec -e MYSQL_DATABASE=pytest_coverage -e TESTING_MODE=1 -e RUBRICAPP_RUNNING_LOCALLY=0 \
     rubricapp-backend-1 python3 -m pytest Tests/
   # single test: append  -k "test_specific_function"
   # coverage: `docker exec rubricapp-backend-1 pip install pytest-cov coverage` (not in
   # requirements.txt, lost on rebuild), then add
   #   --cov=models --cov=controller --cov=core --cov=enums --cov=constants --cov=Functions --cov-report=term-missing
   ```

4. **Frontend** (from `FrontEndReact/`), on the host:
   - Use **Node 24** (`nvm use 24`), as CI does. Older Node fails with `ERR_REQUIRE_ESM` because `@babel/core@8` is ESM-only.
   - Run `npm install` after switching branches. Branches can differ in dependencies (e.g. `mui-datatables` vs `@mui/x-data-grid`), and a stale `node_modules` makes suites fail with "Cannot find module".
   - `.env`'s `VITE_API_URL` usually says port `5000`, which won't match the Docker port. Override it for the run instead of editing `.env`:

   ```bash
   CI=true VITE_API_URL=http://127.0.0.1:5050/api npx jest --watchAll=false --runInBand   # all
   CI=true VITE_API_URL=http://127.0.0.1:5050/api npx jest path/to/File.test.tsx          # single file
   # add --coverage for a report in FrontEndReact/coverage/lcov-report/index.html
   ```

   Use `--runInBand` for the full suite. Run in parallel, the login-driven Admin suites (`AdminAddCourse`, `AdminAddUser`, `AdminViewTeamMembers`, `AdminBulkUpload`, `AdminEditTeamMembers`, `AdminAddAssessmentTask`) overload the backend. `waitFor` then times out after its default 1s, and the failures show up as `Unable to find a label with the text of: coursesTitle` with the login form still rendered. If that error appears in a serial run, the cause is more likely missing demo data: seed it (`setupEnv.py -d`) before treating it as a regression. `ECONNREFUSED` in the output means the backend isn't reachable at `VITE_API_URL`.

CI (`.github/workflows/ci.yml`) runs `pytest Tests/unit`, sharded `pytest Tests/integration` (3 shards), `npm test`, and `npx eslint --max-warnings=0 .` on the frontend. Match these locally before pushing.

## Cross-cutting architecture

- **Auth**: JWT access/refresh tokens (flask-jwt-extended), issued by `Login_route.py`, blacklisted-on-logout via Redis (`controller/security/blacklist.py`). The frontend stores tokens in cookies (`universal-cookie`) and auto-refreshes via `refreshLock.tsx`.
- **API contract**: every backend response is an envelope `{ success, status, content: { <resource>: [...] } }` built by `controller/Route_response.py`. Only bad and warning responses add a `message` string — `create_good_response` never sets one, so don't write consumers that require a message on success. The frontend's generic fetch helpers in `FrontEndReact/src/utility.ts` (`genericResourceGET/POST/PUT/DELETE`) know how to unwrap this envelope and handle 401 refresh/logout — authenticated resource calls should go through those rather than raw `fetch` (see `FrontEndReact/CLAUDE.md` for the pre-auth exceptions).
- **Roles**: three separate mechanisms that are easy to conflate — work out which one a feature actually needs before picking a decorator.
  - **Per-course role**: `enums/roles.py` defines six values (`RESEARCHER`, `SUPER_ADMIN`, `ADMIN`, `TA_INSTRUCTOR`, `STUDENT`, `TEST_STUDENT`), and a user's role for a given course lives on the `UserCourse` join row (`user_id` + `course_id` + `role_id`) — so the same person can be a TA in one course and a student in another. `privilege_check` is the only decorator that reads this.
  - **Global admin flag**: `User.is_admin` is a single boolean with no course context. `admin_check` reads only this flag, so despite the name it does not scope to a course (tracked in SKIL-861; see `BackEndFlask/CLAUDE.md`).
  - **Observer assignment**: neither of the above — it's `Team.observer_id` on the team row.

  Decorators live in `controller/security/CustomDecorators.py` (`AuthCheck`, `admin_check`, `privilege_check`, `super_admin_check`); the client mirrors the split via `FrontEndReact/src/View/{Admin,Student,...}` route segregation.
- **Env files**: `.env` at repo root plus `BackEndFlask/.env` and `FrontEndReact/.env` (see `Scripts/quickCreateEnvs.py` for how CI/local setup generates them). `FrontEndReact/.env`'s `VITE_API_URL` is where the frontend sends requests. `BackEndFlask/.env`'s `FRONT_END_URL` is **not** currently enforced as a CORS origin, despite the name: `core/__init__.py` calls `CORS(app)` with no restrictions and `controller/__init__.py` sets `origins: "*"`, while `FRONT_END_URL` is only interpolated into an `Access-Control-Allow-Origin` key inside the response *body* dict that `Route_response.__init_response` builds — not an actual header. Changing it will not make Flask reject an origin. (A fix is in progress on the `fix/cors-wildcard` branch; re-check this section once that merges.) Never commit real secrets in these.
- **One route table, one blueprint**: every file under `BackEndFlask/controller/Routes/` decorates with the same shared `bp = Blueprint('api', __name__)` (`controller/__init__.py`), which is mounted once with `url_prefix='/api'` in `core/__init__.py`. Route files write paths without the `/api` prefix (e.g. `@bp.route('/course')` actually serves `/api/course`).
- **Deploy sequence** (`Cloud/syscontrol.sh`): `--fresh` (lays down the production directory structure) → `--init` (installs system/pip/npm deps, then configures SSL/nginx/gunicorn/firewall/DB) → `--serve` (starts Redis, builds the frontend, runs both halves as background processes). Each stage assumes the previous one already succeeded.

## Docs worth knowing about

- `Manuals/TECHNICAL_DOCUMENTATION.md` — entry-level architecture tour.
- `Manuals/OAuth2-instructions.md`, `Manuals/HowToChangeDBPasswords.md`, `Manuals/BACKUP_SQL_INSTRUCTIONS.md` — ops/setup procedures.
- `BackEndFlask/Tests/TEST_PLAN.md`, `TEST_PLAN_2.md` — backend test scope/strategy.
- `FrontEndReact/src/JestTestDocumentation.md` — how the `aria-label`-driven Jest test helpers work.
- `FrontEndReact/src/TYPES.md` — shared TypeScript type reference.

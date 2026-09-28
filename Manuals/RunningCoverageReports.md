# Running Code Coverage Reports (via Docker)

This documents how to generate real backend and frontend coverage numbers against a
running `docker compose` stack. Neither CI nor the local dev setup tracks coverage
automatically — this is a manual process you run when you want a snapshot.

## Why Docker

Backend coverage needs a real MySQL + Redis instance (the integration test fixtures
provision and drop real databases — nothing here is mocked). Frontend coverage needs a
live backend for the many components that fetch data on mount; without one, most of
that code never executes and the coverage numbers come out badly deflated (we saw
coverage jump from ~15% to ~35% once a real backend was reachable).

## Prerequisites

Start the stack:

```bash
docker compose up
```

Confirm the containers are up and note their names (they're usually
`rubricapp-backend-1`, `rubricapp-mysql-1`, `rubricapp-frontend-1`, etc., but the
prefix depends on your project directory name — check with `docker ps` if unsure):

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## One-time setup: an isolated test database

**Do not point the test suite at the same `MYSQL_DATABASE` your running containers
use for real dev data.** `Tests/conftest.py`'s `flask_app_mock` fixture runs
`CREATE DATABASE IF NOT EXISTS` at the start of *every test function* and
`DROP DATABASE IF EXISTS` at teardown of every one — if you point it at your live
database (`local`, by default, per `compose.yml`), it will repeatedly drop and
recreate your actual dev data mid-run, and can crash the already-running
backend/frontend containers when their database briefly vanishes out from under them.

Instead, run tests against a separate database name (e.g. `pytest_coverage`) that's
safe to create/drop freely. The app's default DB user (`skillbuilder`) only has
grants on `local`, so you need to grant it access to this new database once. Get the
MySQL root password from the running container and grant scoped (not global)
privileges:

```bash
docker exec rubricapp-mysql-1 sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON pytest_coverage.* TO '"'"'skillbuilder'"'"'@'"'"'%'"'"'; FLUSH PRIVILEGES;"'
```

This only grants privileges on the one throwaway database — it does not touch access
to `local` or grant anything global. You only need to run this once per MySQL
container (it won't survive `docker compose down -v` / a fresh volume, but persists
across normal container restarts).

## Backend coverage

`pytest-cov` isn't in `requirements.txt`, so install it in the running container
first (ephemeral — it won't persist if the container is rebuilt):

```bash
docker exec rubricapp-backend-1 pip install --quiet pytest-cov coverage
```

Then run the full suite (unit + integration) with coverage, pointed at the isolated
database:

```bash
docker exec \
  -e MYSQL_DATABASE=pytest_coverage \
  -e TESTING_MODE=1 \
  -e RUBRICAPP_RUNNING_LOCALLY=0 \
  rubricapp-backend-1 \
  python3 -m pytest Tests/ \
    --cov=models --cov=controller --cov=core --cov=enums --cov=constants --cov=Functions \
    --cov-report=term-missing -q
```

The per-file breakdown and the `TOTAL` line print directly to the terminal. Swap
`--cov-report=term-missing` for `--cov-report=html` if you want a browsable report
written inside the container (you'd then need to `docker cp` it out to view it).

## Frontend coverage

The frontend build tooling migrated from Create React App to Vite; tests run directly
through Jest now (`package.json`'s `test` script is just `jest`, not `react-scripts
test`).

**Node version:** the project now requires Node 24 (see `.github/workflows/ci.yml`),
and current dependency versions (`@babel/core@8`, which is ESM-only) fail under Node
18/20 with `Error [ERR_REQUIRE_ESM]` when `babel-jest` tries to `require()` it. If
your default `node -v` is older, switch first, e.g. via nvm:

```bash
nvm use 24   # or: nvm install 24 if you don't have it yet
```

Find the port your backend container maps to on the host — `compose.yml` maps it, but
the exact host port can vary:

```bash
docker port rubricapp-backend-1
```

`FrontEndReact/.env`'s `VITE_API_URL` is usually `http://127.0.0.1:5000/api`, which
may not match that mapped port. Rather than editing `.env`, override it just for this
run — an env var set on the command line takes precedence over the `.env` file. Code
reads it via `import.meta.env.VITE_API_URL`, which `babel-plugin-transform-vite-meta-env`
rewrites to `process.env.VITE_API_URL` for Jest, so a plain shell env var works:

```bash
cd FrontEndReact
CI=true VITE_API_URL=http://127.0.0.1:<mapped-port>/api npx jest --coverage --watchAll=false
```

The summary prints to the terminal; a full browsable report is written to
`FrontEndReact/coverage/lcov-report/index.html`.

**Note:** some Admin-side tests (`AdminAddCourse`, `AdminAddUser`,
`AdminViewTeamMembers`, `AdminBulkUpload`, and similar) depend on demo data — seeded
courses/users/teams — being loaded into whichever database the backend container is
actually using. If those still fail even with a live backend reachable, seed demo
data into that database (see `setupEnv.py`'s `-d`/`--demo` flag) rather than assuming
it's a real regression.

## Cleanup (optional)

To revoke the scoped grant once you're done experimenting:

```bash
docker exec rubricapp-mysql-1 sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "REVOKE ALL PRIVILEGES ON pytest_coverage.* FROM '"'"'skillbuilder'"'"'@'"'"'%'"'"'; DROP DATABASE IF EXISTS pytest_coverage; FLUSH PRIVILEGES;"'
```

This isn't necessary for correctness — the grant is scoped to one disposable database
and doesn't affect anything else — it's just tidiness if you'd rather not leave it in
place.

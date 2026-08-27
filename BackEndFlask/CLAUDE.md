# CLAUDE.md — BackEndFlask

Guidance for working in the Flask API. See the repo root `CLAUDE.md` for cross-cutting/run/test commands.

## Layout

- `controller/Routes/<Name>_routes.py` — one file per resource; registers routes on the shared `bp` Blueprint (`controller/__init__.py` imports every route module — a new route module must be imported there or it never registers).
- `controller/security/` — `CustomDecorators.py` (auth/role decorators), `blacklist.py` (Redis token blacklist), `utility.py`.
- `models/<name>.py` — CRUD functions per entity, operating on SQLAlchemy models declared in `models/schemas.py`.
- `models/queries.py` — cross-entity/joined queries that don't belong to a single model file.
- `core/` — app/db/config singletons (`from core import db, app, config`).
- `enums/`, `constants/` — fixed value sets (roles, HTTP codes, email types).
- `procedures/` — SQL stored procedures and their Python wrappers.
- `migrations/` — Flask-Migrate/Alembic; run `flask db migrate` / `flask db upgrade` from `BackEndFlask/`.
- `Tests/unit/` vs `Tests/integration/` — unit tests don't need a DB; integration tests do (see Testing below). Mirrors `controller/`, `models/`, `Functions/` structure.

## Route pattern

Every endpoint follows the same shape. Match it exactly for new routes:

```python
@bp.route('/team', methods=['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()          # optional; add privilege_check()/super_admin_check() as needed
def add_team():
    try:
        new_team = create_team(request.json)
        return create_good_response(team_schema.dump(new_team), 200, "teams")
    except Exception as e:
        return create_bad_response(f"An error occurred adding a team: {e}", "teams", 400)
```

- Decorator order matters: `jwt_required()` → `bad_token_check()` → `AuthCheck()` → any role/privilege decorator last (`admin_check`, `privilege_check`, `super_admin_check`), since those hit the DB and should only run once identity is already verified.
- Wrap the whole body in `try/except Exception`; return `create_bad_response(msg, content_type, status)` on failure. `content_type` is the same resource-name string used for the success response — it's the key the frontend looks for in `response.content`.
- Return success via `create_good_response(data, status, content_type)` from `controller/Route_response.py`. Never build the response envelope by hand.
- Marshmallow `Schema` classes live at the bottom of the same route file as the resource they serialize (e.g. `TeamSchema` in `Team_routes.py`), not centralized.

## Model pattern

- CRUD/query functions in `models/<name>.py` are decorated `@error_log` (`models/utility.py`) which logs exceptions before re-raising.
- Look-up functions raise a custom `Invalid<Entity>ID` exception (defined at the top of the same model file) when a record isn't found, rather than returning `None` — callers rely on the exception to short-circuit into the route's `except` block.
- `db.session.commit()` is called explicitly after each mutation inside the model function, not in the route.

## Auth model

Three levels enforced server-side in `controller/security/CustomDecorators.py`:
- `AuthCheck()` — the `user_id` query param must match the JWT subject.
- `admin_check()` — caller must be a course admin.
- `privilege_check([Roles...])` — caller's role for the given `course_id` must be in the allowed list.
- `super_admin_check()` — caller must be the reserved super-admin user.

Roles are defined in `enums/roles.py`.

## Testing

- `Tests/unit/` — no live DB required.
- `Tests/integration/` — needs MySQL + Redis reachable via the env vars in `BackEndFlask/.env`; uses the `flask_app_mock` pytest fixture (`Tests/conftest.py`), which creates/migrates a real test database and yields the Flask app. Test functions take `flask_app_mock` as a parameter and open `with flask_app_mock.app_context():` before touching the DB.
- `Tests/PopulationFunctions.py` — shared fixtures/helpers for seeding users, courses, teams, etc. Clean up any data your test inserts so the next test starts from a known state.
- Naming: `test_<snake_case_description_of_behavior>`, e.g. `test_should_fail_with_file_not_found`.
- Run a single test: `python3 -m pytest -k "test_name"` (from `BackEndFlask/`).

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
- Return success via `create_good_response(data, status, content_type)` from `controller/Route_response.py`. Never build the response envelope by hand. Every response (good or bad) carries `success`/`status`/`content`; a good response additionally nests any new `access_token`/`refresh_token` under `"headers"` when the route issues them (login, refresh); a bad response carries a `"message"` string instead.
- Marshmallow `Schema` classes live at the bottom of the same route file as the resource they serialize (e.g. `TeamSchema` in `Team_routes.py`), not centralized. The schema is the boundary between "what's in the DB" and "what the API exposes" — declare only the fields a response should actually carry (e.g. never a password hash), and call `.dump(obj)` before passing data to `create_good_response`.

## Model pattern

- CRUD/query functions in `models/<name>.py` are decorated `@error_log` (`models/utility.py`) which logs exceptions before re-raising.
- Look-up functions raise a custom `Invalid<Entity>ID` exception (defined at the top of the same model file) when a record isn't found, rather than returning `None` — callers rely on the exception to short-circuit into the route's `except` block.
- `db.session.commit()` is called explicitly after each mutation inside the model function, not in the route.
- **All ORM table classes live in one file**: `models/schemas.py` is the only place `db.Model` classes (`User`, `Course`, `Rubric`, `Team`, `AssessmentTask`, ...) are declared. Every `models/<name>.py` file is a data-access layer of `get_/create_/replace_/delete_` functions operating on those shared classes — there is no `class Course(db.Model)` hiding in `course.py`. Keep new query/mutation logic in the resource's `models/<name>.py`, not in `schemas.py`.
- **Cascades are inconsistent by design — check before deleting**: `User.team = db.relationship('TeamUser', backref='user', cascade='all, delete')` cascades at the ORM level. `UserCourse.user_id` and `Feedback.user_id` cascade at the *database* level via `ForeignKey(..., ondelete='CASCADE')` instead. Other relationships (e.g. `Team.admin_id`, `Team.observer_id`) are `ondelete='RESTRICT'` — deleting a referenced `User` while they still own/observe a team will fail at the DB level. Enrollment history, completed assessments, and course ownership have no cascade at all. Don't assume deleting a row cleans up its dependents; check `schemas.py` for the specific relationship/FK before writing a delete path.
- `AssessmentTask.unit_of_assessment` (bool: true = team, false = individual) drives whether `CompletedAssessment`/`Feedback` rows get populated with a `team_id` or a `user_id` — both columns are nullable on both models, and it's route code (`Rating_routes.py`) that decides which one to set based on the assessment task's flag, not a DB constraint. Keep that mutual exclusivity in mind when writing new code that touches these tables directly.

## Auth model

Four layers enforced server-side, applied in this order (`controller/security/CustomDecorators.py`), each answering a narrower question than the last:
- `@jwt_required()` (flask-jwt-extended) — the access token is syntactically valid and unexpired.
- `@bad_token_check()` — the token hasn't been explicitly revoked (checked against the Redis blacklist).
- `@AuthCheck()` — the `user_id` query param matches the identity encoded in the token (you can't act "as" someone else by editing the query string).
- `admin_check()` / `privilege_check([Roles...])` / `super_admin_check()` — re-checks privilege from the database itself, not from anything in the token:
  - `admin_check()` — caller must be a course admin.
  - `privilege_check([Roles...])` — caller's role for the given `course_id` must be in the allowed list. `enums/roles.py` orders `Roles` so a *lower* number is *more* privileged (`RESEARCHER=1` ... `TA_INSTRUCTOR=4` ... down to `TEST_STUDENT=6`); `roles_at_or_above(role)` returns every role whose value is `<= role.value`, i.e. "this role or anyone more senior." Prefer it over hardcoding a role list when a feature should be available to a role and everyone above it.
  - `super_admin_check()` — caller must be the reserved super-admin user.
- JWTs are minted with `identity=str(user_id)` (`controller/security/utility.py`, `create_new_tokens`), so `get_jwt_identity()` always comes back as a string. Cast explicitly with `int(get_jwt_identity())` before handing it to code that isn't a SQLAlchemy filter (which coerces automatically) — see `Login_route.py`'s `change_password` for the pattern.

## Testing

- `Tests/unit/` — no live DB required.
- `Tests/integration/` — needs MySQL + Redis reachable via the env vars in `BackEndFlask/.env`; uses the `flask_app_mock` pytest fixture (`Tests/conftest.py`), which creates/migrates a real test database, seeds the super-admin and default roles, and yields the Flask app. Test functions take `flask_app_mock` as a parameter and open `with flask_app_mock.app_context():` before touching the DB.
- `Tests/conftest.py`'s four fixtures compose in dependency order: `flask_app_mock` (real test DB + app) → `client` (`flask_app_mock.test_client()`, for sending HTTP requests) and `sample_token` (a factory — call it with `user_id`/`email`/`is_admin` to mint a real JWT for that user via `create_access_token`, needs the app context from `flask_app_mock`) → `auth_header` (wraps whatever `sample_token` produced as `{"Authorization": f"Bearer {token}"}`, ready for `client.get(...)`/`client.post(...)`). Nothing is mocked at the HTTP or DB layer — an integration test using all four is exercising a real authenticated request against a real (test) database.
- `Tests/PopulationFunctions.py` — shared fixtures/helpers for seeding users, courses, teams, etc. Clean up any data your test inserts so the next test starts from a known state.
- Naming: `test_<snake_case_description_of_behavior>`, e.g. `test_should_fail_with_file_not_found`.
- Run a single test: `python3 -m pytest -k "test_name"` (from `BackEndFlask/`).

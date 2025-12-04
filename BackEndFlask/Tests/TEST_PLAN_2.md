# Integration & E2E Test Plan – Rubric App Backend

**Project:** Rubric App Backend  
**Framework:** Flask + SQLAlchemy + MySQL  
**Directories Covered:**  
- `models/`
- `Functions/`
- `controller/Routes/`

---

## 1. Purpose

The goal of these Integration and End-to-End (E2E) tests is to validate that:
* All **backend layers work together correctly** — models, routes, and helper functions.
* **Database operations persist and retrieve data accurately**.
* **Authentication and authorization** (JWT) behave consistently across routes.
* **File imports/exports, rubrics, feedback, and check-in workflows** execute as expected.
* The system remains stable under realistic, multi-step operations.

---

## 2. Integration Tests

Integration tests focus on the interactions between:
- Models ↔ Database  
- Routes ↔ Models  
- Functions ↔ Models

Each test uses a **test database** with **automated setup and teardown fixtures**.

### 2.1 Model Integration Tests

| Area | File | Description | Example Test |
|------|------|--------------|---------------|
| **User–Course–Team Relationships** | `models/user.py`, `models/course.py`, `models/team.py`, `models/user_course.py`, `models/team_user.py` | Validate foreign key and many-to-many relationships. | Create a teacher → course → team → student chain and verify relationships resolve correctly. |
| **Rubric and Categories** | `models/rubric.py`, `models/rubric_categories.py` | Ensure rubrics and categories link correctly. | Create rubric, attach multiple categories, query relationships. |
| **Assessments & Feedback** | `models/assessment_task.py`, `models/feedback.py`, `models/completed_assessment.py` | Verify assessments and feedback are correctly tied to users and rubrics. | Create assessment task → submit feedback → mark assessment completed. |
| **Rating Aggregation** | `models/ratings_numbers.py`, `models/feedback.py` | Ensure average rating or weighted score calculations persist correctly. | Submit multiple feedbacks and check stored averages. |
| **Observable Characteristics** | `models/observable_characteristics.py` | Verify traits or rubric items are correctly referenced. | Check that rubric references observable characteristics on load. |

---

### 2.2 Function Integration Tests (`Functions/` Folder)

These files handle imports, exports, and bulk operations — best tested with realistic data and file mocks.

| Function File | Integration Target | Description | Example Test |
|----------------|--------------------|--------------|---------------|
| `studentImport.py` | User, Course | Import CSV with students, create users and enroll them. | Upload CSV and assert users + user_course entries exist. |
| `teamBulkUpload.py` | Team, UserCourse | Create multiple teams and assign students from CSV. | Upload CSV, assert correct number of teams created. |
| `exportCsv.py` | Course, Feedback | Export all course-related data. | Generate CSV, read back file, assert header + expected rows. |
| `randAssign.py` | Team, Role | Randomly assign roles or teams. | Run random assignment and verify no duplicate team IDs. |
| `loadExistingRubrics.py` | Rubric, Category | Ensure rubrics load correctly from DB and cache. | Trigger load, assert correct number of rubrics in memory. |

---

### 2.3 Controller / Route Integration Tests

Each route interacts with authentication, models, and utility functions.
Tests simulate real requests using Flask’s test client.

| Route | Purpose | Key Tests |
|-------|----------|-----------|
| **`Login_route.py` / `Signup_route.py` / `Logout_route.py`** | Authentication lifecycle | Test valid/invalid login, signup with duplicate email, logout invalidates JWT. |
| **`Course_routes.py`** | Course management | Create, retrieve, update, delete courses. Ensure permissions enforced (teacher vs student). |
| **`Team_routes.py`** | Team operations | Create team, assign members, view team details. |
| **`Bulk_upload_routes.py` / `Team_bulk_upload_routes.py`** | File-based uploads | Simulate CSV uploads and verify DB inserts. |
| **`Rubric_routes.py` / `Feedback_routes.py` / `Rating_routes.py`** | Rubric and feedback flow | Submit rubric, post feedback, compute rating averages. |
| **`Completed_assessment_routes.py` / `Assessment_task_routes.py`** | Assessment progress | Mark assessment complete and verify completion stored. |
| **`Csv_routes.py` / `notification_routes.py`** | Exports and notifications | Export data as CSV, send notifications to team members. |
| **`Refresh_route.py`** | Token refresh | Test token refresh returns valid new JWT with correct claims. |

---

## 3. E2E Tests

These simulate **real user workflows** across multiple endpoints and DB states.

Each test runs on a clean DB and uses valid JWTs.

### 3.1 Teacher Flow
**Scenario:**
1. Teacher signs up → logs in → creates course → creates teams → adds students → assigns rubric → exports results.  
**Endpoints:** `/api/signup`, `/api/login`, `/api/course`, `/api/team`, `/api/export`  
**Validations:**  
- Course created successfully.  
- Students correctly linked to course.  
- Exported CSV contains expected course data.

### 3.2 Student Flow
**Scenario:**
1. Student logs in → fetches courses → joins a team → submits feedback.  
**Endpoints:** `/api/login`, `/api/course`, `/api/team/join`, `/api/feedback`  
**Validations:**  
- Correct course list for student.  
- Team join recorded.  
- Feedback stored and reflected in average ratings.

### 3.3 Rubric Evaluation Flow
**Scenario:**
1. Instructor loads rubric → assigns → students submit assessments → system computes averages.  
**Endpoints:** `/api/rubric`, `/api/assessment`, `/api/feedback`, `/api/rating`  
**Validations:**  
- Rubric correctly fetched.  
- Assessment entries link to rubric.  
- Ratings reflect submitted feedback.

### 3.4 Password Reset Flow
**Scenario:**
1. User requests reset → gets token → resets password.  
**Endpoints:** `/api/reset_request`, `/api/reset_password`  
**Validations:**  
- Token generated and valid.  
- Password hash updated.  
- Old password no longer valid.

---

## 4. Test Environment

* **Database:** Dedicated MySQL test DB (auto reset per session)
* **JWT Secret:** `test-secret`
* **Fixtures:**  
  - `flask_app_mock` – for isolated app context  
  - `db_session` – for DB transaction management  
  - `client` – for authorized API requests with JWT  
  - `populate_test_data()` – populates users, courses, teams, rubrics

---

## 5. Test Execution Commands

```bash
# Run Integration Tests
python3 -m pytest Tests/integration/ -v --disable-warnings

# Run End-to-End Tests
python3 -m pytest Tests/e2e/ -v --disable-warnings

# Run All Tests with Coverage
python3 -m pytest Tests/ --cov=app --cov-report=term-missing

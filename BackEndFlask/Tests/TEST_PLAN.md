# Automated Test Plan – Rubric App Backend

**Project:** Rubric App Backend (Flask, SQLAlchemy, MySQL)  
**Test Folder:** `Tests/`  
**Test Types:** Unit, Integration, End-to-End (E2E)

---

## 1. Objectives

* Ensure **core functionalities of the backend** work as expected.  
* Verify **data integrity** for all database operations, including edge cases.  
* Confirm **authentication & authorization flows** (JWT) work correctly and are secure against common attacks.  
* Validate that **API routes/controllers** handle all valid inputs and robustly manage invalid/malicious inputs.  
* Automate **population, cleanup, and teardown** for test isolation.  
* Measure and report code coverage, test execution time, and security vulnerabilities.  
* Integrate testing fully into the CI/CD pipeline to provide rapid feedback to developers.  

---

## 2. Test Scope

1. **Models & Persistence Layer**  
   * Entity CRUD Operations: Test creation, reading, updating, and deletion (CRUD) of all models: User, Course, Team, UserCourse, TeamUser, and Role.  
   * Database Constraints: Verify NOT NULL, UNIQUE, and foreign key relationships.  
   * Model Associations: Ensure relationships between models are correctly managed and queried.

2. **API Endpoints & Controllers**  
   * Core API Functionality: Validate login, password reset, course endpoints, and team operations.  
   * Authentication & Authorization:
     * Positive: Valid credentials allow access to JWT-protected endpoints.  
     * Negative: Invalid credentials, missing or expired JWT result in correct error codes (401/403).  
   * Input Validation & Edge Cases: Handle valid/missing/malformed data, required query params, and length/range constraints.

3. **End-to-End User Flows**  
   * Teacher Workflow: Login → create course → create teams → enroll students.  
   * Student Workflow: Login → fetch courses → join team.  
   * Password Reset Workflow: Request reset → update password using token.  

4. **Utility & Helper Functions**  
   * Independent Functions: Test logic in isolation.  
   * Test Data Management: Ensure clean state for every test via population and cleanup functions.  

---

## 3. Test Types

| Type            | Purpose                                                | Examples                                                                                                                    |
| --------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Unit**        | Test functions/methods/classes in isolation.          | `create_user()`, `delete_user()`, `get_user_by_email()`, utility helpers (`generate_random_password`)                        |
| **Integration** | Test how components (models, services) interact.      | `create_one_admin_ta_student_course()`, population scripts, login controller generates JWT correctly                         |
| **E2E**         | Test full user flows via HTTP requests.               | `GET /api/course?user_id=<id>` returns courses, non-existent course returns 404, authorized GET /api/user/courses returns courses |

---

## 4. Test Components

### 4.1 API & Core Business Logic

* Authentication & Authorization:
  * Login with valid/invalid credentials.  
  * Access protected routes with/without JWT.  
  * Verify JWT token claims (e.g., user_id).  
  * Role-based access control.  

* CRUD Endpoints:
  * Create, retrieve, update, delete Users, Courses, Teams.  
  * Verify relationships and DB integrity after operations.  

* Password Management:
  * Request password reset.  
  * Update password with valid/invalid token.  
  * Verify password hash updated in DB.  

### 4.2 Test Data Management

* Use pytest fixtures for users, courses, and teams.  
* Test multiple roles (teacher, TA, student).  
* Each test uses a clean, dedicated test database to prevent state leakage.  

---

## 5. Testing Workflow

1. **Test Environment Setup**  
   * Start isolated test environment (e.g., Docker) for app + test DB.  
   * Configure app to use the dedicated test DB.  

2. **Run Unit Tests**  
   * Execute all tests in `Tests/unit/`.  
   * Fast tests run first to catch core logic errors early.  
   * **Command:**  
     ```bash
     python3 -m pytest Tests/unit/
     ```

3. **Run Integration Tests**  
   * Use `flask_app_mock` fixture with MySQL test DB.  
   * Populate DB using `PopulationFunctions.py`.  
   * Test interactions across models.  
   * Clean up after each test.  
   * **Command:**  
     ```bash
     python3 -m pytest Tests/integration/
     ```

4. **Run API/E2E Tests**  
   * Use `client` fixture with JWT authentication.  
   * Populate DB (teacher/student/course) before each test.  
   * Test API endpoints using `client.get()` / `client.post()`.  
   * Verify status codes, JSON response, and DB changes.  
   * Cleanup population after test.  
   * **Command:**  
     ```bash
     python3 -m pytest Tests/e2e/
     ```

5. **Run All Tests Together**  
   ```bash
   python3 -m pytest Tests/ --disable-warnings -v

6. **Run Individual Test**
   ```bash
   python3 -m pytest -k "for_example.py"
   ```

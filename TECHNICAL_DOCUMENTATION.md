# RubricApp — Technical Documentation (entry-level)

Repository: https://github.com/Lunatic-Labs/rubricapp

Overview
--------
RubricApp is a web application for evaluating students' professional skills (teamwork, communication, etc.). The project is a typical two-part web app:

- Front end: a single-page application (SPA) built with JavaScript (React).
- Back end: a REST API written in Python using Flask.
- Additional tooling: Dockerfiles, a compose file for local multi-container runs, database scripts and OAuth2 instructions for authentication.

This document explains the project structure, the main languages used, the frameworks and tools you will encounter, and how each library contributes to the system. It is written for an entry-level developer and points out where to find exact dependency lists in the repo.

Repository layout (top-level items)
-----------------------------------
The repository contains both front-end and back-end code and support/configuration files. Important top-level files and directories you should know about (paths are relative to the repo root):

- `.gitignore`, `.dockerignore`
- `README.md` — main project readme (has project details and likely setup instructions)
- `OAuth2-instructions.md` — instructions for configuring OAuth2 authentication
- `BACKUP_SQL_INSTRUCTIONS.md` — database backup/restore instructions
- `compose.yml` — Docker Compose configuration for running services together
- `Dockerfile.frontend` — Dockerfile for front-end image
- `Dockerfile.backend` — Dockerfile for back-end image
- `FrontEndReact/` — front-end application source (React)
- `BackEndFlask/` — back-end application source (Flask)
- `dbinsert.sh` — shell script used to insert seed data into the database
- `account.db` — (present in repository) a database file (likely SQLite or similar)

Because this project mixes JavaScript and Python, the codebase is split into those directories for clarity.

Languages used
--------------
The repository is primarily written in:

- JavaScript (~55%): Front-end SPA code. The FrontEndReact directory indicates a React-based app.
- Python (~44%): Back-end API implemented in Flask (BackEndFlask directory).
- Shell (~1%): Helper scripts (e.g., `dbinsert.sh`) and Docker-related scripts.

What each language/framework brings
----------------------------------

JavaScript (Front end)
- Primary role: user interface and client-side logic.
- Framework implied by the directory name: React. React is a library for building component-based single-page applications (SPAs). It handles the UI rendering, state management in components, and user interactions.
- Typical features you will find in a React front end:
  - Routing (navigating between screens in the SPA).
  - HTTP client usage (fetch/axios) to call the back end REST API.
  - Forms and validation for submitting rubrics and evaluations.
  - Build tooling (npm or yarn) to install dependencies and run build/dev servers.

Where to find exact JS dependencies: look in FrontEndReact/package.json (not included in this document). That file lists the precise packages (React itself plus any UI libraries, router, HTTP library, build tools, etc.).

Python + Flask (Back end)
- Primary role: server-side logic, REST API endpoints, database access, authentication, and business rules.
- Flask is a lightweight Python web framework used to create HTTP endpoints. Typical responsibilities include:
  - Defining API routes for creating and reading rubrics, evaluations, users, etc.
  - Handling authentication and authorization (OAuth2 is documented in the repo).
  - Interacting with the database (queries, migrations, seeding).
  - Returning JSON to the front end.

Where to find exact Python dependencies: look for a requirements.txt, Pipfile, or pyproject.toml inside the BackEndFlask directory. These files list packages such as Flask and any extensions (ORM, OAuth libraries, CORS, etc.)

Database
- The repository contains `account.db` and database helper scripts (for inserts and backups). `account.db` suggests the project uses a file-based database, commonly SQLite for development, but the repository may support other relational DBs in production.
- `BACKUP_SQL_INSTRUCTIONS.md` and `dbinsert.sh` provide guidance for preserving and populating DB data.

Authentication
- There is a file named `OAuth2-instructions.md` in the repo. This indicates the application supports OAuth2-based authentication (e.g., allowing users to sign in with an external provider) for user identity and possibly single-sign-on (SSO).
- The back end likely integrates an OAuth2 library or uses Flask extensions to handle the OAuth flows; the front end will use the auth tokens to access protected API endpoints.

Containerization and deployment tooling
- Docker: The repo contains `Dockerfile.frontend` and `Dockerfile.backend`. These files describe how to containerize the front end and back end, respectively.
- Docker Compose: `compose.yml` is used to run multiple services together (front-end, back-end, DB) for local development or testing.
- Shell scripts: `dbinsert.sh` and other scripts automate database seeding or maintenance.

Shell scripts
- Small utilities to support setup and DB operations. These are typically run in the host shell or inside container images during build/startup.

How the pieces fit together (high-level architecture)
-----------------------------------------------------
1. The React front end runs in the user's browser. It serves the UI, collects input (rubric creation, student evaluation), and calls the back-end REST API.
2. The Flask back end exposes REST endpoints, receives requests from the front end, applies business logic, interacts with the database, and returns JSON responses.
3. Authentication (OAuth2) authenticates users and issues tokens/cookies used by the front end to call protected endpoints.
4. The database stores users, rubrics, evaluations, and other persistent data. For development, a file-based DB (account.db) is present; production deployments may use a managed SQL database.
5. Docker and Docker Compose allow running the full stack locally in containers.

Developer setup (typical steps)
------------------------------
Below are general steps to run the application locally. For exact commands and required environment variables, check README.md and the files in the FrontEndReact and BackEndFlask folders.

Prerequisites
- Git (to clone the repo)
- Docker and Docker Compose (if you will use the compose setup)
- Node.js and npm or yarn (for running the front end outside of Docker)
- Python 3.7+ and virtualenv (for running the back end outside of Docker)

Option A — Run with Docker Compose (recommended for a consistent dev environment)
1. Install Docker and Docker Compose.
2. From the repo root, run:
   - docker compose -f compose.yml up --build
   This builds the front-end and back-end images and starts containers according to compose.yml.
3. Visit the front-end URL (often localhost:3000 or whatever is configured by the compose file) and exercise the app.

Option B — Run components separately (useful when actively developing)
Front end:
1. cd FrontEndReact
2. npm install (or yarn)
3. npm start (runs a development server, typically on localhost:3000)
Back end:
1. cd BackEndFlask
2. python -m venv venv
3. source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)
4. pip install -r requirements.txt (if present)
5. export any required environment variables (e.g., FLASK_APP, FLASK_ENV, DB connection string, OAuth client secrets)
6. flask run (or python app.py) — check BackEndFlask README or main file for exact startup command

Finding the exact dependencies
-----------------------------
- Front-end JavaScript dependencies: open FrontEndReact/package.json.
- Back-end Python dependencies: open BackEndFlask/requirements.txt (or Pipfile/pyproject).
- OAuth configuration details: OAuth2-instructions.md
- Docker Compose service definitions: compose.yml
- Dockerfile details for production-ready images: Dockerfile.frontend, Dockerfile.backend

Common tasks for contributors
-----------------------------
- Adding a new API endpoint: modify BackEndFlask code, add a route, ensure tests, update documentation.
- Adding a new view/component: modify FrontEndReact code, add component files, and wire into the router/state.
- Running locally: use Docker Compose for a quick integration environment; use separate start-up if debugging with hot reloaders.
- Database maintenance: follow BACKUP_SQL_INSTRUCTIONS.md for backup/restore; use dbinsert.sh to seed development data.

Troubleshooting tips
--------------------
- If the front end cannot reach the back end, check CORS settings and the URLs in front-end API config.
- If authentication fails, follow OAuth2-instructions.md to ensure client IDs/secrets and redirect URIs are configured correctly.
- If the DB is missing data, run dbinsert.sh or follow backup/restore instructions.
- Logs: use Docker logs when using containers; when running services locally, the console will show Flask/React logs.

Where to look next in the repo
------------------------------
- README.md: the main readme (likely includes setup and developer notes).
- OAuth2-instructions.md: details for configuring authentication.
- FrontEndReact/: explore package.json and the src/ folder to see UI structure.
- BackEndFlask/: inspect the Flask app, routes, and configuration, and look for requirements.txt.

Final notes
-----------
This document provides a practical, entry-level introduction to RubricApp's codebase, its languages, and the major libraries and tools you will encounter. To get exact versions and the full list of packages used in the project, open the dependency files located inside FrontEndReact (package.json) and BackEndFlask (requirements.txt or equivalent). For authentication specifics and database operations follow the included OAuth2-instructions.md and BACKUP_SQL_INSTRUCTIONS.md files in the repository.

If you need, I can:
- Summarize the exact dependencies by opening FrontEndReact/package.json and BackEndFlask/requirements.txt (if you want a list of all libraries and versions).
- Walk you through starting the project step-by-step based on the exact compose.yml content.

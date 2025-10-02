# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillBuilder is a full-stack web application for evaluating students' professional skills in real-time using research-based or custom rubrics. The application consists of:

- **Backend**: Flask-based Python API (`BackEndFlask/`)
- **Frontend**: React application (`FrontEndReact/`)
- **Database**: MySQL with SQLAlchemy ORM
- **Caching**: Redis for session management and rate limiting
- **Email**: SendGrid for notifications

## Development Commands

### Backend Development
```bash
# Set up environment and start backend (from BackEndFlask/)
python3 setupEnv.py -irds
# Flags: -i (install deps), -r (reset DB), -d (load demo data), -s (start server)

# For subsequent runs (after initial setup)
python3 setupEnv.py -s

# Run tests
python3 setupEnv.py -t
```

### Frontend Development
```bash
# From FrontEndReact/
npm install  # First time only
npm start    # Start development server
npm test     # Run Jest tests
npm run build # Build for production
```

### Docker Development (Recommended)
```bash
# Build and start all services
docker compose build
docker compose up

# Build without cache (when Docker files change)
docker compose build --no-cache

# Clean reset (removes containers and volumes)
docker-compose down --rmi all --volumes
```

### Testing
- **Backend**: Uses pytest framework, tests in `BackEndFlask/Functions/test_files/`
- **Frontend**: Uses Jest and React Testing Library
- Test functions must start with `test_` and take `flask_mock_object` parameter for backend tests
- Clean up test data to maintain clean database state between tests

## Architecture Overview

### Backend Structure
- **`core/`**: Flask app initialization, database setup, JWT configuration
- **`models/`**: SQLAlchemy database models (User, Course, Team, Assessment, etc.)
- **`controller/`**: Route handlers and business logic
  - **`Routes/`**: API endpoint definitions
  - **`security/`**: Authentication decorators and utilities
- **`Functions/`**: Utility functions for imports, exports, and business logic
- **`migrations/`**: Database migration files (Flask-Migrate)

### Frontend Structure  
- **`src/View/`**: React components organized by user role
  - **`Admin/`**: Administrator functionality (courses, users, assessments)
  - **`Student/`**: Student functionality (team building, self-assessment)
  - **`Components/`**: Shared UI components
  - **`Login/`**: Authentication components
- **`src/__tests__/`**: Jest test files
- Uses Material-UI for component library

### Key Models
- **User**: Students, TAs, Admins with role-based permissions
- **Course**: Academic courses containing teams and assessments
- **Team**: Groups of students for collaborative assessment
- **Assessment Task**: Rubric-based evaluation activities
- **Rubric**: Custom or research-based evaluation criteria
- **Completed Assessment**: Student evaluation results

### Authentication & Security
- JWT-based authentication with refresh tokens
- Role-based access control (Student, TA, Admin)
- Rate limiting via Redis
- Custom decorators for route protection

### Database Configuration
- Uses SQLAlchemy with MySQL backend
- Environment-based configuration (`.env` files)
- Automatic migration support via Flask-Migrate

## Common Development Tasks

### Adding New API Endpoints
1. Create route handler in appropriate `controller/Routes/` file
2. Add security decorators for authentication/authorization
3. Define request/response schemas using Marshmallow
4. Add corresponding database queries in `models/queries.py`
5. Write tests in `BackEndFlask/Functions/test_files/`

### Adding Frontend Components
- Follow existing patterns in `src/View/` hierarchy
- Use Material-UI components for consistency
- Implement proper error handling and loading states
- Add Jest tests for complex components

### Database Changes
1. Modify models in `BackEndFlask/models/`
2. Generate migration: `flask db migrate -m "Description"`
3. Apply migration: `flask db upgrade`
4. Update demo data loading if needed

### Bulk Operations
- Student/Team imports via CSV upload
- Use existing utilities in `Functions/studentImport.py` and `Functions/teamBulkUpload.py`
- Custom CSV export functionality in `Functions/exportCsv.py`

## Environment Setup

### Required Environment Variables
- Database connection strings
- JWT secret keys  
- SendGrid API keys
- Redis configuration

### Local Development vs Docker
- Local: Requires manual Redis/MySQL setup
- Docker: Handles all services automatically
- Use `setupEnv.py` flags to control backend initialization

## Testing Strategy
- Backend: Focus on API endpoints and business logic
- Frontend: Component testing with user interaction simulation
- Integration: End-to-end flows via Docker environment
- Database: Use test fixtures and cleanup for isolation
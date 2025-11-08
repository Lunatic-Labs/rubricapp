import pytest
from core import db
from models.schemas import Rubric, AssessmentTask
from models.rubric import (
    get_rubrics,
    get_rubrics_for_user,
    get_rubric,
    create_rubric,
    replace_rubric,
    delete_rubric_by_id,
    InvalidRubricID,
)
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
)

from models.loadExistingRubrics import load_existing_rubrics
from models.assessment_task import create_assessment_task, delete_assessment_task

# -----------------------------------------------
# Helper function
# -----------------------------------------------
def sample_rubric(user_id):
    """Helper to create a sample rubric payload."""
    rubric_data = {
        "rubric_name": "Clarity",
        "rubric_description": "Evaluate clarity and precision",
        "owner": user_id,
    }
    rubric = create_rubric(rubric_data)
    return rubric
        
# -----------------------------------------------
# Tests
# -----------------------------------------------
def test_get_rubrics_returns_list(flask_app_mock):
    with flask_app_mock.app_context():   
        cleanup_test_users(db.session)

        load_existing_rubrics()

        rubrics = get_rubrics()
        assert isinstance(rubrics, list)
        assert len(rubrics) == 16
        assert any(r.rubric_name == "Metacognition" for r in rubrics)
        

def test_get_rubrics_for_user_includes_owner(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"])
            query = get_rubrics_for_user(result["user_id"])
            
            assert any(r.rubric_id == rubric.rubric_id for r in query)
        
        finally:
            # Cleanup
            try:
                delete_one_admin_course(result)
                delete_rubric_by_id(rubric.rubric_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_rubric_valid_id_returns_rubric(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"])
            result = get_rubric(rubric.rubric_id)
            assert result.rubric_name == "Clarity"
        
        finally:
            # Cleanup
            try:
                delete_one_admin_course(result)
                delete_rubric_by_id(rubric.rubric_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_rubric_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidRubricID):
            get_rubric(999999)


def test_create_rubric_creates_new_record(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        rubric_data = {
            "rubric_name": "Creativity",
            "rubric_description": "Measures originality",
            "owner": 1,
        }
        rubric = create_rubric(rubric_data)
        assert rubric.rubric_id is not None
        assert rubric.rubric_name == "Creativity"


def test_replace_rubric_updates_existing(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"])
            updated = replace_rubric(("Precision", "Updated desc"), rubric.rubric_id)
            assert updated.rubric_name == "Precision"
            assert updated.rubric_description == "Updated desc"

        finally:
            # Cleanup
            try:
                delete_one_admin_course(result)
                delete_rubric_by_id(rubric.rubric_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_rubric_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidRubricID):
            replace_rubric(("New", "Desc"), 999999)


def test_delete_rubric_by_id_success(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            # Create temporary rubric
            rubric_data = {
                "rubric_name": "Temp Rubric",
                "rubric_description": "To be deleted",
                "owner": result["user_id"],
            }
            rubric = create_rubric(rubric_data)
            rubric_id = rubric.rubric_id

            deleted = delete_rubric_by_id(rubric_id)
            assert deleted.rubric_id == rubric_id
            assert db.session.get(Rubric, rubric_id) is None
        
        finally:
            # Cleanup
            try:
                delete_one_admin_course(result)
                delete_rubric_by_id(rubric.rubric_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_delete_rubric_by_id_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidRubricID):
            delete_rubric_by_id(999999)


def test_delete_rubric_by_id_raises_if_used_in_assessment(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        # Link rubric to an assessment task

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"])
            payload = {
                "assessment_task_name": "Integration Test Assessment",
                "course_id": result["course_id"],
                "rubric_id": rubric.rubric_id,
                "role_id": 4,
                "due_date": "2026-01-01T12:00:00", 
                "time_zone": "EST",
                "show_suggestions": True,
                "show_ratings": True,
                "unit_of_assessment": False,
                "create_team_password": "pw123",
                "comment": "Test comment",
                "number_of_teams": 3,
                "max_team_size": 4,
                "locked": False,
                "published": False,
            }
            assessment_task = create_assessment_task(payload)

            # Attempt to delete rubric now should fail
            with pytest.raises(ValueError) as excinfo:
                delete_rubric_by_id(rubric.rubric_id)
            assert "used in one or more assessment tasks" in str(excinfo.value)
        
        finally:
            # Cleanup
            try:
                delete_one_admin_course(result)
                delete_assessment_task(assessment_task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

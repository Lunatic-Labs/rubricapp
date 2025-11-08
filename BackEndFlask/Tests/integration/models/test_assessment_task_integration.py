import pytest
from datetime import datetime
from models.assessment_task import (
    create_assessment_task,
    get_assessment_task,
    replace_assessment_task,
    toggle_lock_status,
    toggle_published_status,
    delete_assessment_task,
    toggle_notification_sent_to_true,
    load_demo_admin_assessment_task,
    get_assessment_tasks,
    get_assessment_tasks_by_course_id,
    get_assessment_tasks_by_role_id,
    get_assessment_tasks_by_team_id,
    InvalidAssessmentTaskID,
)
from models.rubric import ( create_rubric, delete_rubric_by_id )
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
)
from core import db
from sqlalchemy.exc import SQLAlchemyError
from unittest.mock import patch
from models.team import create_team, delete_team

def create_test_rubric(course_admin):
    rubric_payload = {
        "rubric_name": "Integration Test Rubric",
        "rubric_description": "A rubric for integration testing.",
        "owner": course_admin,  # course_admin is user_id
    }
    return create_rubric(rubric_payload)
    
          

def build_sample_task_payload(course_id, rubric_id, extra: dict = None):
    payload = {
        "assessment_task_name": "Integration Test Assessment",
        "course_id": course_id,
        "rubric_id": rubric_id,
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
    if extra:
        payload.update(extra)
    return payload

# -----------------------
# CREATE + GET
# -----------------------
def test_create_and_get_assessment_task(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = create_test_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            assert task.assessment_task_id is not None
            assert task.assessment_task_name == payload["assessment_task_name"]

            fetched = get_assessment_task(task.assessment_task_id)
            assert fetched.assessment_task_name == payload["assessment_task_name"]

            expected_dt = datetime.strptime("2026-01-01T12:00:00.000Z", "%Y-%m-%dT%H:%M:%S.%fZ")
            assert fetched.due_date == expected_dt

        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

# -----------------------
# INVALID GET
# -----------------------
def test_get_assessment_task_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidAssessmentTaskID):
            get_assessment_task(9999999)

# -----------------------
# REPLACE (UPDATE)
# -----------------------
def test_replace_assessment_task_updates_fields(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = create_test_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            updated = dict(payload)
            updated["assessment_task_name"] = "Updated Name"
            updated["due_date"] = "2026-02-02T09:30:00"

            replaced = replace_assessment_task(updated, task.assessment_task_id)
            assert replaced.assessment_task_name == "Updated Name"
            assert replaced.due_date == datetime.strptime("2026-02-02T09:30:00.000Z", "%Y-%m-%dT%H:%M:%S.%fZ")

        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

# -----------------------
# TOGGLE LOCK / PUBLISHED
# -----------------------
def test_toggle_lock_and_published_status(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = create_test_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            toggled = toggle_lock_status(task.assessment_task_id)
            assert toggled.locked is True

            toggled2 = toggle_published_status(task.assessment_task_id)
            assert toggled2.published is True

        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

# -----------------------
# GET ALL ASSESSMENT TASKS
# -----------------------
def test_get_all_assessment_tasks(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            # Creating multiple rubrics to satisfy foreign key constraints
            for _ in range(18): 
                r = create_test_rubric(result["user_id"])
            
            # Load sample assessment tasks into DB
            load_demo_admin_assessment_task()
            
            # Get all assessment tasks
            tasks = get_assessment_tasks()
            assert len(tasks) == 19
            assert any(t.assessment_task_name == "Critical Thinking Assessment" for t in tasks)

            # Test getting assessment tasks by course_id
            tasks_2 =  get_assessment_tasks_by_course_id(result["course_id"])
            names = [t.assessment_task_name for t in tasks_2]
            assert "Formal Communication Assessment" in names
            assert "Teamwork Assessment" in names
            assert "Management Assessment" in names
            assert "Chemistry Assessment" not in names

            # Test getting assessment tasks by role_id
            tasks_3 = get_assessment_tasks_by_role_id(5) 
            names_3 = [t.assessment_task_name for t in tasks_3]
            assert "Problem Solving Assessment" in names_3
            assert "Teamwork Assessment" in names_3
            assert "Management Assessment" not in names_3


        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_get_assessment_tasks_by_team_id(flask_app_mock): 
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = create_test_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            # Create demo teams
            team = create_team({
                "team_name": "Integration Test Team",
                "observer_id": result["user_id"],
                "date_created": "10/10/2025",
                "course_id": result["course_id"],
                "assessment_task_id": task.assessment_task_id,
            })

            tasks = get_assessment_tasks_by_team_id(team.team_id)  # team_id
            assert len(tasks) == 1
            assert tasks[0].assessment_task_name == "Integration Test Assessment"

        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_team(team.team_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")



# -----------------------
# TOGGLE NOTIFICATION SENT
# -----------------------
def test_toggle_notification_sent_to_true(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = create_test_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            date_str = "2026-03-01T08:00:00.000Z"
            updated = toggle_notification_sent_to_true(task.assessment_task_id, date_str)

            assert updated.notification_sent == datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        
        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

# -----------------------
# DELETE
# -----------------------
def test_delete_assessment_task_removes_record(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        result = create_one_admin_course(False)
        rubric = create_test_rubric(result["user_id"])

        payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
        task = create_assessment_task(payload)

        result = delete_assessment_task(task.assessment_task_id)
        assert result is True

        with pytest.raises(InvalidAssessmentTaskID):
            get_assessment_task(task.assessment_task_id)

        if result:
            try:
                delete_one_admin_course(result)
                delete_rubric_by_id(rubric.rubric_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
            
def test_delete_assessment_task_raises_sqlalchemy_error(flask_app_mock):
    """Ensure SQLAlchemyError path is triggered and handled correctly."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = create_test_rubric(result["user_id"])

            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            db.session.add(task)
            db.session.commit()

            with patch("models.assessment_task.db.session.delete", side_effect=SQLAlchemyError("DB Error")):
                result = delete_assessment_task(task.assessment_task_id)
                
            # Verify the function handled the exception and returned False
            assert result is False
        
        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_delete_assessment_task_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidAssessmentTaskID):
            delete_assessment_task(8888888)

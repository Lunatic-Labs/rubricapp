import pytest
from datetime import datetime
from models.assessment_task import *
from models.rubric import delete_rubric_by_id
from Tests.PopulationFunctions import *
from core import db
from sqlalchemy.exc import SQLAlchemyError
from unittest.mock import patch
from models.team import create_team, delete_team
from integration.integration_helpers import *
from models.queries import *
from models.user import create_user, delete_user
from models.course import create_course, delete_course


def test_create_and_get_assessment_task(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
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


def test_get_assessment_task_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidAssessmentTaskID):
            get_assessment_task(9999999)


def test_replace_assessment_task_updates_fields(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
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
                    delete_assessment_task(task.assessment_task_id)
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_replace_assessment_task_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            updated = dict(payload)
            updated["assessment_task_name"] = "Updated Name"
            updated["due_date"] = "2026-02-02T09:30:00"

            with pytest.raises(InvalidAssessmentTaskID):
                replaced = replace_assessment_task(updated, 99999)


        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_toggle_lock_and_published_status(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
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


def test_get_all_assessment_tasks(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            # Creating multiple rubrics to satisfy foreign key constraints
            for rid in range(1, 18): 
                r = sample_rubric(result["user_id"], f"Test rubric{rid}")
                db.session.add(r)
            db.session.commit()

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
            rubric = sample_rubric(result["user_id"])
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



def test_toggle_notification_sent_to_true(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
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


def test_delete_assessment_task_removes_record(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        result = create_one_admin_course(False)
        rubric = sample_rubric(result["user_id"])

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
            rubric = sample_rubric(result["user_id"])

            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            with patch("models.assessment_task.db.session.delete", side_effect=SQLAlchemyError("DB Error")):
                result = delete_assessment_task(task.assessment_task_id)
                
            # Verify the function handled the exception and returned False
            assert result is False
        
        finally:
            # Clean up
            if result:
                try:
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_delete_assessment_task_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidAssessmentTaskID):
            delete_assessment_task(8888888)


def test_get_course_from_at(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)

            task = create_assessment_task(payload)
            rslt = get_course_from_at(task.assessment_task_id)
            assert rslt[0] == result["course_id"]

        finally:
            # Clean up
            if result:
                try:
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_get_assessment_task_by_course_id_and_role_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(role_id=3)
            teacher = create_user(teacher_data)
            course_data = sample_course(teacher.user_id)
            course = create_course(course_data)
            rubric = sample_rubric(teacher.user_id)
            payload1 = build_sample_task_payload(course.course_id, rubric.rubric_id, role_id=3)
            task_name = "Integration Test Assessment 2"
            payload2 = build_sample_task_payload(course.course_id, rubric.rubric_id, role_id=3, task_name=task_name)

            task1 = create_assessment_task(payload1)
            task2 = create_assessment_task(payload2)
            results = get_assessment_task_by_course_id_and_role_id(course.course_id, role_id=3)
            assert len(results) == 2
            assert all(t.course_id == course.course_id for t in results)
            assert any(t.assessment_task_name == "Integration Test Assessment 2" for t in results)
            assert any(t.assessment_task_name == "Integration Test Assessment" for t in results)
        
        finally:
            # Clean up
            if teacher:
                try:
                    delete_assessment_task(task1.assessment_task_id)
                    delete_assessment_task(task2.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_course(course.course_id)
                    delete_user(teacher)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_get_course_name_by_at_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)

            task = create_assessment_task(payload)

            assert get_course_name_by_at_id(task.assessment_task_id) == "Summer Internship"

        finally:
            # Clean up
            if result:
                try:
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


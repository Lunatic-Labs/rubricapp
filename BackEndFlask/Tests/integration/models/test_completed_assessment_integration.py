import pytest
from core import db
from datetime import datetime, timezone
from unittest.mock import patch
from sqlalchemy.exc import SQLAlchemyError
from models.completed_assessment import (
    get_completed_assessments,
    get_completed_assessment,
    get_completed_assessments_by_assessment_task_id,
    get_completed_assessment_by_course_id,
    get_completed_assessment_count,
    completed_assessment_exists,
    completed_assessment_team_or_user_exists,
    create_completed_assessment,
    delete_completed_assessment_tasks,
    toggle_lock_status,
    make_complete_assessment_locked,
    make_complete_assessment_unlocked,
    replace_completed_assessment,
    load_demo_completed_assessment,
    InvalidCRID
)
from models.schemas import CompletedAssessment, AssessmentTask, User, Feedback, Course
from Tests.PopulationFunctions import (
    create_one_admin_ta_student_course,
    delete_one_admin_ta_student_course,
     cleanup_test_users, 
     create_one_admin_course, 
     delete_one_admin_course, 
     create_users,
     delete_users
)
from models.assessment_task import create_assessment_task, delete_assessment_task
from integration.integration_helpers import (
    build_sample_task_payload, 
    sample_completed_assessment,
    sample_rubric,
    sample_team
)
from models.rubric import delete_rubric_by_id
from models.team import delete_team
from models.queries import (
    get_completed_assessment_by_user_id,
    get_users_by_course_id_and_role_id,
    get_completed_assessment_by_ta_user_id
)


def test_create_completed_assessment(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            assert comp.completed_assessment_id is not None
            assert comp.done is True

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_get_completed_assessments(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            users = create_users(result["course_id"], result["user_id"], 5)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            for i in range(1, 14):
                payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
                task = create_assessment_task(payload)
            team = sample_team("Team Alpha", result["user_id"], result["course_id"], task.assessment_task_id) 
            load_demo_completed_assessment()

            all_comps = get_completed_assessments()
            assert len(all_comps) == 9
            assert any(c.initial_time.strftime("%Y-%m-%dT%H:%M:%S") == "2025-12-25T13:00:00" for c in all_comps)
            assert any(c.last_update.strftime("%Y-%m-%dT%H:%M:%S") == "2025-12-25T14:20:00" for c in all_comps)

        finally:
            # Clean up
            if result:
                try:
                    delete_team(team.team_id)
                    delete_users([users])
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_get_completed_assessment_valid(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            results = get_completed_assessment(comp.completed_assessment_id)
            assert results.completed_assessment_id == comp.completed_assessment_id
            assert results.user_id == result["user_id"]
        
        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_get_completed_assessment_invalid(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCRID):
            get_completed_assessment(9999)

def test_get_completed_assessment_by_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            results = get_completed_assessment_by_course_id(result["course_id"])
            assert len(results) == 1
            assert any(r.completed_assessment_id == comp.completed_assessment_id for r in results)
            assert any(r.user_id == result["user_id"] for r in results)
        
        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_get_completed_assessment_by_count(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            users = create_users(result["course_id"], result["user_id"], 3)
            user_id = []
            for user in users:
                user_id.append(user.user_id)
            rubric = sample_rubric(user_id[0], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data1 = sample_completed_assessment(user_id[0], task.assessment_task_id)
            data2 = sample_completed_assessment(user_id[1], task.assessment_task_id)
            comp1 = create_completed_assessment(data1)
            comp2 = create_completed_assessment(data2)

            results = get_completed_assessment_count(task.assessment_task_id)
            assert results == 2

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp1.completed_assessment_id)
                    delete_completed_assessment_tasks(comp2.completed_assessment_id)
                    delete_users([users])
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")



def test_get_completed_assessments_by_task_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            users = create_users(result["course_id"], result["user_id"], 3)
            user_id = []
            for user in users:
                user_id.append(user.user_id)
            rubric = sample_rubric(user_id[0], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data1 = sample_completed_assessment(user_id[0], task.assessment_task_id)
            data2 = sample_completed_assessment(user_id[1], task.assessment_task_id)
            comp1 = create_completed_assessment(data1)
            comp2 = create_completed_assessment(data2)

            results = get_completed_assessments_by_assessment_task_id(task.assessment_task_id)
            assert all(r.assessment_task_id == comp1.assessment_task_id for r in results)
            assert any(r.user_id == user_id[0] for r in results)
            assert any(r.user_id == user_id[1] for r in results)
            assert len(results) == 2

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp1.completed_assessment_id)
                    delete_completed_assessment_tasks(comp2.completed_assessment_id)
                    delete_users([users])
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_completed_assessment_exists(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team = sample_team("Team Omega", result["user_id"], result["course_id"], task.assessment_task_id)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id, team.team_id)
            comp = create_completed_assessment(data)

            results1 = completed_assessment_exists(None, task.assessment_task_id, result["user_id"])
            results2 = completed_assessment_exists(team.team_id, task.assessment_task_id, -1)
            assert results1.completed_assessment_id == comp.completed_assessment_id
            assert results1.user_id == result["user_id"]
            assert results2.completed_assessment_id == comp.completed_assessment_id

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_completed_assessment_team_or_user_exists(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team = sample_team("Team Alpha", result["user_id"], result["course_id"], task.assessment_task_id) 
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id, team.team_id)
            comp = create_completed_assessment(data)
            results1 = completed_assessment_team_or_user_exists(team.team_id)
            results2 = completed_assessment_team_or_user_exists(None, result["user_id"])
            results3 = completed_assessment_team_or_user_exists()

            assert any(r.completed_assessment_id == comp.completed_assessment_id for r in results1)
            assert any(r.user_id == result["user_id"] for r in results2)
            assert any(r.team_id == team.team_id for r in results1)
            assert len(results3) == 0

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_team(team.team_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_delete_completed_assessment_task_invalid_crid_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCRID):
            delete_completed_assessment_tasks(999999)

def test_toggle_lock_status_invalid_crid_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCRID):
            toggle_lock_status(999999)

def test_make_complete_assessment_locke_invalid_crid_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCRID):
            make_complete_assessment_locked(999999)

def test_make_complete_assessment_unlocke_invalid_crid_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCRID):
            make_complete_assessment_unlocked(999999)
        

def test_delete_completed_assessment_tasks_sqlalchemy_error(flask_app_mock):
    """Simulate SQLAlchemyError when deleting a completed assessment."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)
            
            db.session.add(comp)
            db.session.commit()

            # Force db.session.commit() to raise SQLAlchemyError
            with patch("models.completed_assessment.db.session.commit", side_effect=SQLAlchemyError("Forced DB error")):
                result = delete_completed_assessment_tasks(comp.completed_assessment_id)

            # ✅ Should have returned False because of the exception
            assert result is False

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_toggle_lock_status(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            original = comp.locked
            toggled = toggle_lock_status(comp.completed_assessment_id)
            assert toggled.locked != original

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_make_complete_assessment_locked_and_unlocked(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            locked = make_complete_assessment_locked(comp.completed_assessment_id)
            assert locked.locked is True

            unlocked = make_complete_assessment_unlocked(comp.completed_assessment_id)
            assert unlocked.locked is False
        
        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_delete_completed_assessment_tasks(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            results = delete_completed_assessment_tasks(comp.completed_assessment_id)
            assert results is True

            with pytest.raises(InvalidCRID):
                get_completed_assessment(comp.completed_assessment_id)
            
        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_replace_completed_assessment(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            payload2 = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            payload2["assessment_task_name"] = "Updated Task Name"
            task2 = create_assessment_task(payload2)
            new_data = {
                "assessment_task_id": task2.assessment_task_id,
                "team_id": None,
                "user_id": result["user_id"],
                "rating_observable_characteristics_suggestions_data": {"Updated": {}},
                "done": False
            }

            replaced = replace_completed_assessment(new_data, comp.completed_assessment_id)
            assert replaced.done is False
            assert "Updated" in replaced.rating_observable_characteristics_suggestions_data
            assert replaced.assessment_task_id == task2.assessment_task_id
            assert replaced.user_id == result["user_id"]
            assert replaced.team_id is None

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_assessment_task(task2.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_get_completed_assessment_by_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            results = get_completed_assessment_by_user_id(result["course_id"], result["user_id"])
            assert all(r.completed_assessment_id == comp.completed_assessment_id for r in results)
            assert all(r.user_id == result["user_id"] for r in results)

        
        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_get_completed_assessment_by_ta_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_ta_student_course()
            user = get_users_by_course_id_and_role_id(result["course_id"], 4)
            rubric = sample_rubric(user[0].user_id, "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp = create_completed_assessment(data)

            results = get_completed_assessment_by_ta_user_id(result["course_id"], user[0].user_id)
            assert all(r.completed_assessment_id == comp.completed_assessment_id for r in results)
            assert all(r.user_id == user[0].user_id for r in results)

        finally:
            # Clean up
            if result:
                try:
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_ta_student_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


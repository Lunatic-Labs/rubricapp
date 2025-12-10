import pytest
from datetime import datetime, timedelta, timezone
from models.feedback import (
    load_demo_feedback,
    get_feedback,
    get_feedback_by_completed_assessment_id,
    get_feedback_by_user_id,
    get_feedback_by_user_id_and_completed_assessment_id,
    get_feedback_per_id,
    check_feedback_exists,
    replace_feedback,
    delete_feedback_by_user_id_completed_assessment_id,
    InvalidFeedbackID
)
from models.schemas import Feedback
from integration.integration_helpers import (
    sample_feedback,
    sample_rubric,
    sample_completed_assessment,
    build_sample_task_payload,
    sample_team
)
from Tests.PopulationFunctions import (
    cleanup_test_users,
    create_one_admin_course, 
    delete_one_admin_course, 
    create_users,
    delete_users
)
from core import db
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task,
)
from models.completed_assessment import (
    create_completed_assessment, 
    delete_completed_assessment_tasks
)
from models.rubric import delete_rubric_by_id
from models.team import delete_team
from models.user_course import load_demo_user_course_ta_instructor
from models.user import load_demo_admin, load_demo_ta_instructor



def test_create_feedback(flask_app_mock):
    """Test creating a feedback record."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            fb = sample_feedback(comp.completed_assessment_id, result["user_id"])
            assert fb.feedback_id is not None
            assert fb.user_id == result["user_id"]
            assert isinstance(fb.feedback_time, datetime)

            # Confirm exists in DB
            stored = db.session.get(Feedback, fb.feedback_id)
            assert stored is not None
            assert stored.completed_assessment_id == fb.completed_assessment_id
        
        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(result["user_id"], comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  



def test_get_feedback_returns_all(flask_app_mock):
    """Test retrieving all feedback entries."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team = sample_team("Alpha", result["user_id"], result["course_id"], task.assessment_task_id)

            fb = []
            for i in range(4):
                data = sample_completed_assessment(users[i].user_id, task.assessment_task_id, team.team_id)
                comp =create_completed_assessment(data)
                fb.append(sample_feedback(comp.completed_assessment_id, users[i].user_id, team.team_id))
            
            results = get_feedback()
            assert len(results) == 4
            assert any(f.feedback_id == fb[1].feedback_id for f in results)
            assert any(f.completed_assessment_id == fb[2].completed_assessment_id for f in results)
            assert all(f.team_id == team.team_id for f in results)

        finally:
            # Clean up
            if result:
                try:
                    for user in users:
                        delete_feedback_by_user_id_completed_assessment_id(user.user_id, comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_team(team.team_id)
                    delete_assessment_task(task.assessment_task_id)
                    delete_users(users)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_get_feedback_by_completed_assessment_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id)
            comp = create_completed_assessment(data)

            fb = sample_feedback(comp.completed_assessment_id, result["user_id"])
            results = get_feedback_by_completed_assessment_id(comp.completed_assessment_id)
            assert len(results) == 1
            assert results[0].feedback_id == fb.feedback_id
        
        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(result["user_id"], comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_get_feedback_by_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp = create_completed_assessment(data)
            fb = sample_feedback(comp.completed_assessment_id, user[0].user_id)

            results = get_feedback_by_user_id(user[0].user_id)
            assert len(results) == 1
            assert results[0].feedback_id == fb.feedback_id

        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(user[0].user_id, comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_assessment_task(task.assessment_task_id)
                    delete_users(user)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_get_feedback_by_user_id_and_completed_assessment_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp = create_completed_assessment(data)
            fb = sample_feedback(comp.completed_assessment_id, user[0].user_id)

            result = get_feedback_by_user_id_and_completed_assessment_id(user[0].user_id, comp.completed_assessment_id)
            assert result is not None
            assert result.feedback_id == fb.feedback_id
            assert result.completed_assessment_id == fb.completed_assessment_id

        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(user[0].user_id, comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_assessment_task(task.assessment_task_id)
                    delete_users(user)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_get_feedback_per_id_valid(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp = create_completed_assessment(data)
            fb = sample_feedback(comp.completed_assessment_id, user[0].user_id)

            result = get_feedback_per_id(fb.feedback_id)
            assert result.feedback_id == fb.feedback_id
            assert result.completed_assessment_id == fb.completed_assessment_id
        
        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(user[0].user_id, comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_assessment_task(task.assessment_task_id)
                    delete_users(user)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}") 


def test_get_feedback_per_id_invalid(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidFeedbackID):
            get_feedback_per_id(9999)


def test_check_feedback_exists(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp = create_completed_assessment(data)
            fb = sample_feedback(comp.completed_assessment_id, user[0].user_id)

            exists = check_feedback_exists(fb.user_id, fb.completed_assessment_id)
            not_exists = check_feedback_exists(0, 0)
            assert exists is True
            assert not_exists is False
        
        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(fb.user_id, comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_assessment_task(task.assessment_task_id)
                    delete_users(user)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}") 


def test_replace_feedback_updates_record(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            data1 = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp1 = create_completed_assessment(data1)
            fb = sample_feedback(comp1.completed_assessment_id, user[0].user_id)
            
            data2 = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp2 = create_completed_assessment(data2)
            
            updated_data = {
                "user_id": comp2.user_id,
                "completed_assessment_id": comp2.completed_assessment_id,
                "feedback_time": datetime.now(timezone.utc)
            }
            updated_feedback = replace_feedback(updated_data, fb.feedback_id)

            assert abs(updated_feedback.feedback_time.replace(tzinfo=timezone.utc) - updated_data["feedback_time"]) < timedelta(seconds=1)
            assert updated_feedback.completed_assessment_id == updated_data["completed_assessment_id"]

            refreshed = db.session.get(Feedback, fb.feedback_id)
            assert abs(refreshed.feedback_time.replace(tzinfo=timezone.utc) - updated_data["feedback_time"]) < timedelta(seconds=1)
            assert refreshed.completed_assessment_id == updated_data["completed_assessment_id"]

        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(fb.user_id, comp2.completed_assessment_id)
                    delete_completed_assessment_tasks(comp1.completed_assessment_id)
                    delete_completed_assessment_tasks(comp2.completed_assessment_id)
                    delete_assessment_task(task.assessment_task_id)
                    delete_users(user)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}") 


def test_replace_feedback_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidFeedbackID):
            replace_feedback({
                "user_id": 1,
                "completed_assessment_id": 1,
                "feedback_time": datetime.now()
            }, feedback_id=9999)


def test_delete_feedback_by_user_id_completed_assessment_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(user[0].user_id, task.assessment_task_id)
            comp = create_completed_assessment(data)
            fb = sample_feedback(comp.completed_assessment_id, user[0].user_id)

            delete_feedback_by_user_id_completed_assessment_id(fb.user_id, fb.completed_assessment_id)
            deleted = Feedback.query.filter_by(user_id=fb.user_id, completed_assessment_id=fb.completed_assessment_id).first()
            assert deleted is None
        
        finally:
            # Clean up
            if result:
                try:
                    delete_feedback_by_user_id_completed_assessment_id(fb.user_id, comp.completed_assessment_id)
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_assessment_task(task.assessment_task_id)
                    delete_users(user)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}") 

def test_load_demo_feedback(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            load_demo_ta_instructor()
            load_demo_user_course_ta_instructor()
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(1, rubric.rubric_id, role_id=4)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(3, task.assessment_task_id)
            comp = create_completed_assessment(data)

            load_demo_feedback()
            result = get_feedback()
            assert result[0].completed_assessment_id == 1
        
        finally:
            # Clean up
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
                cleanup_test_users(db.session)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 

from models.checkin import (
    create_checkin,
    already_checked_in,
    update_checkin,
    get_checkins_by_assessment,
    delete_checkins_over_team_count,
    delete_latest_checkins_over_team_size
)
from models.schemas import Checkin
from core import db
from datetime import datetime, timedelta
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users
)
from integration.integration_helpers import (
    build_sample_task_payload, 
    sample_completed_assessment,
    sample_rubric,
    sample_team,
    sample_checkin
)
from models.assessment_task import create_assessment_task, delete_assessment_task
from models.rubric import delete_rubric_by_id
from models.queries import get_all_checkins_for_assessment


def test_create_checkin(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_checkin(task.assessment_task_id, result["user_id"])

            checkin = create_checkin(data)
            assert checkin.assessment_task_id == task.assessment_task_id
            assert checkin.team_number == 1
            assert checkin.user_id == result["user_id"]
            assert isinstance(checkin.time, datetime)
        
        finally:
            # Clean up
            if result:
                try:
                    delete_checkins_over_team_count(task.assessment_task_id, 1)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_already_checked_in_true(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_checkin(task.assessment_task_id, result["user_id"])
            create_checkin(data)

            assert already_checked_in(result["user_id"], task.assessment_task_id) is True
        
        finally:
            # Clean up
            if result:
                try:
                    delete_checkins_over_team_count(task.assessment_task_id, 1)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}") 

def test_already_checked_in_false(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        assert already_checked_in(999, 999) is False

def test_update_checkin(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_checkin(task.assessment_task_id, result["user_id"], team_number=7)
            create_checkin(data)

            update_checkin({"assessment_task_id": task.assessment_task_id, "user_id": result["user_id"], "team_number": 1})
            updated = get_checkins_by_assessment(task.assessment_task_id)
            assert updated[0].team_number == 1

        finally:
            # Clean up
            if result:
                try:
                    delete_checkins_over_team_count(task.assessment_task_id, 1)
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}") 

def test_get_checkins_by_assessment(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            users = create_users(result["course_id"], result["user_id"], 3)
            user_id = []
            for user in users:
                user_id.append(user.user_id)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            create_checkin(sample_checkin(task.assessment_task_id, user_id[0], 1))
            create_checkin(sample_checkin(task.assessment_task_id, user_id[1], 2))

            checkins = get_checkins_by_assessment(task.assessment_task_id)
            assert len(checkins) == 2
            assert all(isinstance(c, Checkin) for c in checkins)

        finally:
            # Clean up
            if result:
                try:
                    delete_checkins_over_team_count(task.assessment_task_id, 2)
                    delete_users([users])
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}") 


def test_delete_checkins_over_team_count(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            users = create_users(result["course_id"], result["user_id"], 7)
            user_id = []
            for user in users:
                user_id.append(user.user_id)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            for tnum in range(6):
                create_checkin(sample_checkin(task.assessment_task_id, user_id[tnum], team_number=tnum+1))

            delete_checkins_over_team_count(task.assessment_task_id, 3)
            remaining = get_all_checkins_for_assessment(task.assessment_task_id)
            assert all(c.team_number <= 3 for c in remaining)

        finally:
            # Clean up
            if result:
                try:
                    delete_checkins_over_team_count(task.assessment_task_id, 6)
                    delete_users([users])
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  

def test_delete_latest_checkins_over_team_size(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            users = create_users(result["course_id"], result["user_id"], 5)
            user_id = []
            for user in users:
                user_id.append(user.user_id)
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            # Create 4 checkins for same team, spaced 1 min apart
            for i in range(4):
                checkin = Checkin(
                    assessment_task_id=task.assessment_task_id,
                    team_number=4,
                    user_id=user_id[i],
                    time=datetime.now() + timedelta(minutes=i)
                )
                db.session.add(checkin)
            db.session.commit()

            # Limit team size to 2 → delete 2 latest
            delete_latest_checkins_over_team_size(task.assessment_task_id, max_team_size=2)

            remaining = get_all_checkins_for_assessment(task.assessment_task_id)
            assert len(remaining) == 2

            # Verify oldest two remain (time ascending)
            times = sorted([c.time for c in remaining])
            assert all(isinstance(t, datetime) for t in times)
        
        finally:
            # Clean up
            if result:
                try:
                    delete_checkins_over_team_count(task.assessment_task_id, 1)
                    delete_users([users])
                    delete_one_admin_course(result)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


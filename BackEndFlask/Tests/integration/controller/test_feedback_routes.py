import pytest
from core import db
from datetime import datetime, timezone
from controller.security.utility import create_tokens
from models.feedback import *
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from integration.integration_helpers import *
from models.user import create_user, delete_user
import jwt
from models.team import delete_team
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task,
)
from models.completed_assessment import (
    create_completed_assessment,
    delete_completed_assessment_tasks,
)
from models.rubric import delete_rubric_by_id


def test_create_new_feedback(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            comp = create_completed_assessment(sample_completed_assessment(
                user[0].user_id, 
                task.assessment_task_id,
                c_by=result["user_id"]
            ))

            feedback_data = {
                "completed_assessment_id": comp.completed_assessment_id,
                "user_id": user[0].user_id,
                "team_id": None,
                "feedback_time": datetime.now(timezone.utc),
            }

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/feedback?user_id={result["user_id"]}",
                headers=auth_header(token),
                json=feedback_data
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data['content']['feedbacks']
            assert len(rslt) == 1
            assert rslt[0]["feedback_id"] is not None
            assert rslt[0]["user_id"] == user[0].user_id
        
        finally:
            # Clean up
            if result:
                try:
                    Feedback.query.delete()
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_users(user)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_create_new_feedback_with_existing_feedback(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            comp = create_completed_assessment(sample_completed_assessment(
                user[0].user_id, 
                task.assessment_task_id,
                c_by=result["user_id"]
            ))

            feedback_data = {
                "completed_assessment_id": comp.completed_assessment_id,
                "user_id": user[0].user_id,
            }

            sample_feedback(comp.completed_assessment_id, user_id=user[0].user_id)

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/feedback?user_id={result["user_id"]}",
                headers=auth_header(token),
                json=feedback_data
            )

            assert response.status_code == 409
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
        
        finally:
            # Clean up
            if result:
                try:
                    Feedback.query.delete()
                    delete_completed_assessment_tasks(comp.completed_assessment_id)
                    delete_users(user)
                    delete_assessment_task(task.assessment_task_id)
                    delete_rubric_by_id(rubric.rubric_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  


def test_create_new_feedback_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/feedback?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
        
        finally:
            # Clean up
            if result:
                try:
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")  

import pytest
from core import db
from models.schemas import CompletedAssessment, Team
from models.completed_assessment import *
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from integration.integration_helpers import *
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task,
    toggle_notification_sent_to_true,
)
from models.rubric import delete_rubric_by_id
import jwt
from models.team import delete_team
from models.team_user import delete_team_user


def test_mass_notify_new_ca_users(
        flask_app_mock, 
        sample_token, 
        auth_header, 
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
            create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"],
                last_update= "2025-11-01T08:00:00.000Z"
            ))
            create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"],
                last_update= "2025-11-20T08:00:00.000Z"
            ))
            create_completed_assessment(sample_completed_assessment(
                user_id=users[2].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"],
                last_update="2025-11-20T08:00:00.000Z"
            ))
            
            toggle_notification_sent_to_true(
                task.assessment_task_id,
                "2025-11-05T08:00:00.000Z"
            )


            notification_data = {
                "date": "2025-11-28T08:00:00.000Z",
                "notification_message": "Your feedback is ready to view!"
            }

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/mass_notification?assessment_task_id={task.assessment_task_id}&team=false&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=notification_data
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 201
            assert "Message Sent" in data["content"]["Mass_notified"]
        
        finally:
            # Clean up 
            try:
                CompletedAssessment.query.delete()
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_mass_notify_new_ca_users_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/mass_notification?user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_send_single_email(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
            team1 = sample_team(
                "Alpha", 
                result["user_id"], 
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )
            team2 = sample_team(
                "Omega", 
                result["user_id"], 
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )

            sample_team_user(team1.team_id, users[0].user_id)
            sample_team_user(team1.team_id, users[1].user_id)
            sample_team_user(team2.team_id, users[2].user_id)

            comp = create_completed_assessment(sample_completed_assessment(
                user_id=None,
                task_id=task.assessment_task_id,
                c_by=result["user_id"],
                team_id=team1.team_id,
                last_update= "2025-11-01T08:00:00.000Z"
            ))
            create_completed_assessment(sample_completed_assessment(
                user_id=None,
                task_id=task.assessment_task_id,
                c_by=result["user_id"],
                team_id=team2.team_id,
                last_update= "2025-11-20T08:00:00.000Z"
            ))

            notification_data = {
                "date": "2025-11-28T08:00:00.000Z",
                "notification_message": "Your feedback is ready to view!"
            }

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/send_single_email?completed_assessment_id={comp.completed_assessment_id}&team=true&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=notification_data
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 201
            assert "Message Sent" in data["content"]["Individual/Team notified"]
        
        finally:
            # Clean up 
            try:
                CompletedAssessment.query.delete()
                Team.query.delete()
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_single_email_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/send_single_email?user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  
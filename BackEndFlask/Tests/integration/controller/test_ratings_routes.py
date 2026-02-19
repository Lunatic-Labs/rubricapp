import pytest
from core import db
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
    get_assessment_task,
    get_assessment_tasks_by_course_id,
)
from models.rubric import delete_rubric_by_id
import jwt
from models.user import get_users_by_owner_id
from models.course import create_course, delete_course
from models.user_course import create_user_course, delete_user_course
from models.team import delete_team
from models.completed_assessment import (
    create_completed_assessment,
    delete_completed_assessment_tasks,
)
from models.schemas import Feedback
from models.team_user import delete_team_user
from models.feedback import delete_feedback_by_user_id_completed_assessment_id


def test_get_ratings_with_team(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            task = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))
            team1 = sample_team("Alpha", result["user_id"], result["course_id"], task.assessment_task_id)
            team2 = sample_team("Omega", result["user_id"], result["course_id"], task.assessment_task_id)

            #for i in range(2):
                #sample_team_user(team.team_id, users[i].user_id)
            
            comp1 = create_completed_assessment(sample_completed_assessment(
                None,
                task.assessment_task_id, 
                team_id=team1.team_id, 
                rating=accurately["3"], 
                c_by=result["user_id"],
                last_update="2025-11-15T12:00:00"
            ))
            comp2 = create_completed_assessment(sample_completed_assessment( 
                None,
                task.assessment_task_id, 
                team_id=team2.team_id, 
                rating=accurately["1"], 
                c_by=result["user_id"],
                last_update="2025-11-22T12:00:00"
            ))
            sample_feedback(comp1.completed_assessment_id, team_id=team1.team_id)
            sample_feedback(comp2.completed_assessment_id, team_id=team2.team_id)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/rating?assessment_task_id={task.assessment_task_id}&team_id={team1.team_id}&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["ratings"][0]
            print(results)
            assert len(results) == 2
            assert any(r["team_id"] == team1.team_id for r in results)
            assert any(r["team_id"] == team2.team_id for r in results)
            assert any(r["rating_observable_characteristics_suggestions_data"] == "With some errors" for r in results)
            assert any(r["rating_observable_characteristics_suggestions_data"] == "Inaccurately" for r in results)
            assert any(r["team_name"] == team1.team_name for r in results)
            assert any(r["team_name"] == team2.team_name for r in results)

        finally:
            # Clean up
            try:
                Feedback.query.delete()
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_ratings_with_team_and_not_ratings(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team = sample_team("Alpha", result["user_id"], result["course_id"], task.assessment_task_id)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/rating?assessment_task_id={task.assessment_task_id}&team_id={team.team_id}&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["ratings"][0]
            assert len(results) == 0

        finally:
            # Clean up
            try:
                delete_team(team.team_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_ratings_with_users(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            
            comp1 = create_completed_assessment(sample_completed_assessment(
                users[0].user_id,
                task.assessment_task_id, 
                rating=accurately["3"], 
                c_by=result["user_id"],
                last_update="2025-11-15T12:00:00"
            ))
            comp2 = create_completed_assessment(sample_completed_assessment( 
                users[1].user_id,
                task.assessment_task_id, 
                rating=accurately["1"], 
                c_by=result["user_id"],
                last_update="2025-11-22T12:00:00"
            ))
            sample_feedback(comp1.completed_assessment_id, user_id=users[0].user_id)
            sample_feedback(comp2.completed_assessment_id, user_id=users[1].user_id)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/rating?assessment_task_id={task.assessment_task_id}&team_id=0&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["ratings"][0]
            students = get_users_by_owner_id(result["user_id"])
            print(results)
            assert len(results) == 2
            assert any(r["last_name"] == students[0].last_name for r in results)
            assert any(r["last_name"] == students[1].last_name for r in results)
            assert any(r["rating_observable_characteristics_suggestions_data"] == "With some errors" for r in results)
            assert any(r["rating_observable_characteristics_suggestions_data"] == "Inaccurately" for r in results)
            assert all(r["lag_time"] is not None for r in results)

        finally:
            # Clean up
            try:
                Feedback.query.delete()
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_get_ratings_with_not_team_and_ratings(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/rating?assessment_task_id={task.assessment_task_id}&team_id=0&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["ratings"][0]
            assert len(results) == 0

        finally:
            # Clean up
            try:
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_ratings_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/rating?user_id={result['user_id']}",
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


def test_student_view_feedback_with_team(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            
            team = sample_team("Alpha", result["user_id"], result["course_id"], task.assessment_task_id)
            comp = create_completed_assessment(sample_completed_assessment(
                None,
                task.assessment_task_id, 
                team_id=team.team_id,
                rating=accurately["3"], 
                c_by=result["user_id"],
                last_update="2025-11-15T12:00:00"
            ))
            
            feedback_data = {
                "completed_assessment_id": comp.completed_assessment_id,
                "user_id": None,
                "team_id": team.team_id,
                "feedback_time": "2025-11-22T12:00:00",
            }

            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/rating?team_id={team.team_id}&user_id={result['user_id']}",
                headers=auth_header(token),
                json=feedback_data
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data["content"]["feedbacks"]
            print(rslt)
            assert len(rslt) == 1
            assert rslt[0]["completed_assessment_id"] == comp.completed_assessment_id
            assert rslt[0]["feedback_id"] is not None
            assert rslt[0]["team_id"] == team.team_id
            assert rslt[0]["feedback_time"] == feedback_data["feedback_time"]
        
        finally:
            # Clean up
            try:
                Feedback.query.delete()
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_team(team.team_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

    
def test_student_view_feedback_with_user(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            
            comp = create_completed_assessment(sample_completed_assessment(
                user[0].user_id,
                task.assessment_task_id, 
                rating=accurately["3"], 
                c_by=result["user_id"],
                last_update="2025-11-15T12:00:00"
            ))
            
            feedback_data = {
                "completed_assessment_id": comp.completed_assessment_id,
                "user_id": user[0].user_id,
                "team_id": None,
                "feedback_time": "2025-11-22T12:00:00",
            }

            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/rating?team_id=0&user_id={result['user_id']}",
                headers=auth_header(token),
                json=feedback_data
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data["content"]["feedbacks"]
            print(rslt)
            assert len(rslt) == 1
            assert rslt[0]["completed_assessment_id"] == comp.completed_assessment_id
            assert rslt[0]["feedback_id"] is not None
            assert rslt[0]["user_id"] == user[0].user_id
            assert rslt[0]["feedback_time"] == feedback_data["feedback_time"]
        
        finally:
            # Clean up
            try:
                Feedback.query.delete()
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_users(user)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_student_view_feedback_with_existing_feedback(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            
            team = sample_team("Alpha", result["user_id"], result["course_id"], task.assessment_task_id)
            comp = create_completed_assessment(sample_completed_assessment(
                None,
                task.assessment_task_id, 
                team_id=team.team_id,
                rating=accurately["3"], 
                c_by=result["user_id"],
                last_update="2025-11-15T12:00:00"
            ))
            
            sample_feedback(comp.completed_assessment_id, team_id=team.team_id)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/rating?team_id={team.team_id}&user_id={result['user_id']}",
                headers=auth_header(token),
                json={"completed_assessment_id": comp.completed_assessment_id}
            )
            
            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 409
            assert data["success"] is False
            assert "Using server's existing data as source of truth." in data["message"]
        
        finally:
            # Clean up
            try:
                Feedback.query.delete()
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_student_view_feedback_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/rating?user_id={result['user_id']}",
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
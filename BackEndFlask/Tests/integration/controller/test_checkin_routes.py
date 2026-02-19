import pytest
from core import db
from models.checkin import *
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
)
from models.rubric import delete_rubric_by_id
import jwt
from models.team import delete_team


def test_update_checkin_user(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            task = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            team1 = sample_team(
                "Alpha", 
                result["user_id"], 
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )

            checkin = create_checkin(sample_checkin(
                task.assessment_task_id, 
                user[0].user_id,
                team_number=team1.team_id
            ))
            team2 = sample_team(
                "Omega", 
                result["user_id"], 
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )
            token = sample_token(user_id=user[0].user_id)

            response = client.post(
                f"/api/checkin?assessment_task_id={task.assessment_task_id}&team_id={team2.team_id}&user_id={user[0].user_id}",
                headers=auth_header(token)
            )


            data = response.get_json()
            assert response.status_code == 200
            assert data['success'] == True
            
            rslt = get_checkins_by_assessment(task.assessment_task_id)
            assert len(rslt) == 1
            assert rslt[0].team_number == team2.team_id 
            assert rslt[0].user_id == user[0].user_id 
            assert rslt[0].checkin_id == checkin.checkin_id
            
        finally:
            # Clean up 
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_create_checkin_user(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            task = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            team = sample_team(
                "Alpha", 
                result["user_id"], 
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )

            token = sample_token(user_id=user[0].user_id)

            response = client.post(
                f"/api/checkin?assessment_task_id={task.assessment_task_id}&team_id={team.team_id}&user_id={user[0].user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
            assert data['success'] == True

            rslt = get_checkins_by_assessment(task.assessment_task_id)
            assert len(rslt) == 1
            assert rslt[0].team_number == team.team_id 
            assert rslt[0].user_id == user[0].user_id 
            
        finally:
            # Clean up 
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team.team_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_checkin_user_raises_exception(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            token = sample_token(user_id=user[0].user_id)

            response = client.post(
                f"/api/checkin?user_id={user[0].user_id}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_users(user)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_check_ins_with_user_id_and_course_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            task = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))
    
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
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

            create_checkin(sample_checkin(
                task.assessment_task_id, 
                user[0].user_id,
                team_number=team1.team_id
            ))
            create_checkin(sample_checkin(
                task.assessment_task_id, 
                user[0].user_id,
                team_number=team2.team_id
            ))
            
            token = sample_token(user_id=user[0].user_id)

            response = client.get(
                f"/api/checkin?course_id={result["course_id"]}&user_id={user[0].user_id}",
                headers=auth_header(token)
            )


            data = response.get_json()
            assert response.status_code == 200
            
            results = data['content']['checkin'][0] 
            print(results)
            assert len(results) == 2
            assert any(r == task.assessment_task_id for r in results)
            
        finally:
            # Clean up 
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")



def test_get_check_ins_with_assessment_task_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            task = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))
    
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
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

            create_checkin(sample_checkin(
                task.assessment_task_id, 
                user[0].user_id,
                team_number=team1.team_id
            ))
            create_checkin(sample_checkin(
                task.assessment_task_id, 
                user[0].user_id,
                team_number=team2.team_id
            ))
            
            token = sample_token(user_id=user[0].user_id)

            response = client.get(
                f"/api/checkin?assessment_task_id={task.assessment_task_id}&user_id={user[0].user_id}",
                headers=auth_header(token)
            )


            data = response.get_json()
            assert response.status_code == 200
            
            results = data['content']['checkin'][0] 
            print(results)
            assert len(results) == 2
            assert any(r["user_id"] == user[0].user_id for r in results)
            assert any(r["team_number"] == team1.team_id for r in results)
            assert any(r["team_number"] == team2.team_id for r in results)
            
        finally:
            # Clean up 
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_check_in_raises_exception(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            token = sample_token(user_id=user[0].user_id)

            response = client.get(
                f"/api/checkin?user_id={user[0].user_id}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_users(user)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
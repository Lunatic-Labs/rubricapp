import pytest
from core import db
from models.user import *
from models.schemas import TeamUser, UserCourse
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from integration.integration_helpers import *
from models.course import create_course, delete_course
from models.user_course import (
    get_user_courses_by_user_id, 
    create_user_course,
    delete_user_course,
    get_user_course,
)
import jwt
from models.team import delete_team
from models.team_user import (
    delete_team_user,
    get_team_users_by_team_id,
)
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task,
)
from models.completed_assessment import (
    create_completed_assessment,
    delete_completed_assessment_tasks
)
from models.rubric import delete_rubric_by_id


def test_get_all_admin_users(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(
                email="testteacher@example.com",
                role_id=3
            ))

            token = sample_token(user_id=teacher.user_id)

            response = client.get(
                f"/api/user?isAdmin=true&user_id={teacher.user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            result = data["content"]["users"][0]
            assert len(result) == 2
            assert any(r["user_id"] == teacher.user_id for r in result)
            assert any(r["user_id"] == 1 for r in result)
            assert any(r["email"] == teacher.email for r in result)

        finally:
            # Clean up
            try:
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_teams_users(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            team1 = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            team2 = sample_team(
                team_name="Omega",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            sample_team_user(team_id=team1.team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team1.team_id, user_id=users[1].user_id)
            sample_team_user(team_id=team2.team_id, user_id=users[2].user_id)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/user?team_ids={team1.team_id},{team2.team_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            teams_users_list = data["content"]["teams_users"]
            assert len(teams_users_list[0]) == 2  
            print("teams users: ", teams_users_list[0])
            teams_users = teams_users_list[0] 
            print("teams users:", teams_users)

            team1_rslt = teams_users["1"]
            assert len(team1_rslt) == 2
            assert any(u["user_id"] == users[0].user_id for u in team1_rslt)
            assert any(u["user_id"] == users[1].user_id for u in team1_rslt)

            team2_rslt = teams_users["2"]
            assert len(team2_rslt) == 1
            assert all(u["user_id"] == users[2].user_id for u in team2_rslt)
            

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_team_users_with_course_and_team_ids(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            team1 = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            team2 = sample_team(
                team_name="Omega",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            sample_team_user(team_id=team1.team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team1.team_id, user_id=users[1].user_id)
            sample_team_user(team_id=team2.team_id, user_id=users[2].user_id)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/user?team_id={team1.team_id}&course_id={result['course_id']}&assign=true&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            team_users = data["content"]["users"][0]
            assert len(team_users) == 2
            print("teams users: ", team_users)
            assert any(u["user_id"] == users[0].user_id for u in team_users)
            assert any(u["user_id"] == users[1].user_id for u in team_users)
            assert all(u["team_id"] == team1.team_id for u in team_users)
            
        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

    
def test_get_all_non_team_users_with_course_and_team_ids(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)

            team1 = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            team2 = sample_team(
                team_name="Omega",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            sample_team_user(team_id=team1.team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team1.team_id, user_id=users[1].user_id)
            sample_team_user(team_id=team2.team_id, user_id=users[2].user_id)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/user?team_id={team1.team_id}&course_id={result['course_id']}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["users"][0]
            assert len(results) == 2
            print("teams users: ", results)
            assert any(u["user_id"] == users[2].user_id for u in results)
            assert any(u["user_id"] == users[3].user_id for u in results)
            assert any(u["team_id"] == team2.team_id for u in results)
            
        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_users_with_course_and_role_ids(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/user?course_id={result['course_id']}&role_id=5&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["users"][0]
            assert len(results) == 3
            print("teams users: ", results)
            assert any(u["user_id"] == users[0].user_id for u in results)
            assert any(u["user_id"] == users[1].user_id for u in results)
            assert any(u["user_id"] == users[2].user_id for u in results)
            assert all(u["owner_id"] == result["user_id"] for u in results)
            
        finally:
            # Clean up
            try:
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_users_with_course_id(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/user?course_id={result['course_id']}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["users"][0]
            assert len(results) == 3
            print("teams users: ", results)
            assert any(u["user_id"] == users[0].user_id for u in results)
            assert any(u["user_id"] == users[1].user_id for u in results)
            assert any(u["user_id"] == users[2].user_id for u in results)
            assert all(u["owner_id"] == result["user_id"] for u in results)
            
        finally:
            # Clean up
            try:
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_user_info(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user = create_user(sample_user(owner_id=result["user_id"]))
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/user?uid={user.user_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["users"]
            assert len(results) == 1
            print("teams users: ", results)
            assert all(u["user_id"] == user.user_id for u in results)
            assert all(u["email"] == user.email for u in results)
            assert all(u["owner_id"] == result["user_id"] for u in results)
            
        finally:
            # Clean up
            try:
                delete_user(user)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_users(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/user?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["users"][0]
            assert len(results) == 5
            print("teams users: ", results)
            assert any(u["user_id"] == users[0].user_id for u in results)
            assert any(u["user_id"] == result["user_id"] for u in results)
            assert any(u["user_id"] == 1 for u in results)
            assert any(u["user_id"] == users[1].user_id for u in results)
            assert any(u["user_id"] == users[2].user_id for u in results)
            assert any(u["owner_id"] == result["user_id"] for u in results)
            
        finally:
            # Clean up
            try:
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_users_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/user?user_id={result['user_id']}&uid=999",
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


def test_get_all_team_members_with_course_and_observer_ids(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)

            team1 = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            team2 = sample_team(
                team_name="Omega",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            sample_team_user(team_id=team1.team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team1.team_id, user_id=users[1].user_id)
            sample_team_user(team_id=team2.team_id, user_id=users[2].user_id)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/team_members?course_id={result['course_id']}&observer_id={result["user_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["team_members"][0]
            print("results: ", results)
            assert len(results) == 2
            assert any(len(u["users"]) == 2 for u in results)
            assert any(len(u["users"]) == 1 for u in results)
            assert any(u["team_name"] == team1.team_name for u in results)
            assert any(u["team_id"] == team1.team_id for u in results)
            assert any(u["team_id"] == team2.team_id for u in results)
            assert all(u["observer_id"] == result["user_id"] for u in results)
            
        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_team_members_with_course_and_user_ids(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)

            team1 = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            team2 = sample_team(
                team_name="Omega",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            sample_team_user(team_id=team1.team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team1.team_id, user_id=users[1].user_id)
            sample_team_user(team_id=team2.team_id, user_id=users[2].user_id)

            token = sample_token(user_id=users[0].user_id)

            response = client.get(
                f"/api/team_members?course_id={result['course_id']}&user_id={users[0].user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["team_members"]
            team_users = results[0]["users"]
            print("results: ", results[0]["users"])
            assert len(results) == 1
            assert any(len(u["users"]) == 2 for u in results)
            assert any(u["user_id"] == users[0].user_id for u in team_users)
            assert any(u["user_id"] == users[1].user_id for u in team_users)
            assert any(u["team_name"] == team1.team_name for u in results)
            assert any(u["team_id"] == team1.team_id for u in results)
            
        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_team_members_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/team_members?user_id={result['user_id']}",
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


def test_add_user_to_team(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            team = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )

            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/user?team_id={team.team_id}&user_ids={users[0].user_id},{users[1].user_id},{users[2].user_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 201
            assert len(data['content']["users"][0]) == 0

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_users(users)
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_add_existing_user_to_course(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(
                email="testteacher@example.com",
                role_id=3
            )) 

            course = create_course(sample_course(teacher_user_id=teacher.user_id)) 

            user = create_user(sample_user(
                email="teststudent@example.com",
                owner_id=teacher.user_id
            ))

            token = sample_token(user_id=teacher.user_id)

            response = client.post(
                f"/api/user?course_id={course.course_id}&owner_id={teacher.user_id}&user_id={teacher.user_id}",
                headers=auth_header(token),
                json={
                    "email": user.email,
                    "password": "password123",
                    "role_id": 5
                }
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            result = data["content"]["users"]
            assert result[0]["user_id"] == user.user_id
            assert result[0]["email"] == user.email

            user_course = get_user_courses_by_user_id(user.user_id)
            print("user course: ", user_course)
            assert user_course is not None

        finally:
            # Clean up
            try:
                UserCourse.query.delete()
                delete_course(course.course_id)
                delete_user(user.user_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_add_non_existing_user_to_course(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(
                email="testteacher@example.com",
                role_id=3
            )) 

            course = create_course(sample_course(teacher_user_id=teacher.user_id)) 

            user_data = sample_user(
                email="teststudent@example.com",
                owner_id=teacher.user_id
            )

            token = sample_token(user_id=teacher.user_id)

            response = client.post(
                f"/api/user?course_id={course.course_id}&owner_id={teacher.user_id}&user_id={teacher.user_id}",
                headers=auth_header(token),
                json=user_data
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            assert len(data["content"]["users"][0]) == 0
            user = get_user_by_email(user_data["email"])
            assert user is not None

            assert get_user_courses_by_user_id(user.user_id) is not None

        finally:
            # Clean up
            try:
                UserCourse.query.delete()
                delete_course(course.course_id)
                delete_user(user.user_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_add_user_course_exists_raises_exception(
        flask_app_mock, 
        sample_token, 
        auth_header, 
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(
                email="testteacher@example.com",
                role_id=3
            )) 

            user = create_user(sample_user(
                email="teststudent@example.com",
                owner_id=teacher.user_id
            ))

            course = create_course(sample_course(teacher_user_id=teacher.user_id)) 
            user_course = create_user_course(sample_user_course(
                user_id=user.user_id,
                course_id=course.course_id,
            ))

            token = sample_token(user_id=teacher.user_id)

            response = client.post(
                f"/api/user?course_id={course.course_id}&owner_id={teacher.user_id}&user_id={teacher.user_id}",
                headers=auth_header(token),
                json={
                    "email": user.email,
                    "password": "password123",
                    "role_id": 5
                }
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "User is already enrolled in course" in str(data)

        finally:
            # Clean up
            try:
                delete_user_course(user_course.user_course_id)
                delete_course(course.course_id)
                delete_user(user.user_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_add_user(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(
                email="testteacher@example.com",
                role_id=3
            )) 

            user_data = sample_user(
                email="teststudent@example.com",
                owner_id=teacher.user_id
            )

            token = sample_token(user_id=teacher.user_id)

            response = client.post(
                f"/api/user?user_id={teacher.user_id}",
                headers=auth_header(token),
                json=user_data
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 201

            result = data["content"]["users"]
            assert len(result) == 1
            assert result[0]["email"] == user_data["email"]
            assert result[0]["first_name"] == user_data["first_name"]

        finally:
            # Clean up
            try:
                delete_user(result[0]["user_id"])
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_user_role_to_ta(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)
            
            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/user?uid={users[1].user_id}&course_id={result["course_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "role_id": 4,
                }
            )

            data = response.get_json()
            print('data: ', data)
            assert response.status_code == 201

            rslt = data["content"]["users"]
            assert len(rslt) == 1
            assert rslt[0]["user_id"] == users[1].user_id
            assert rslt[0]["role_id"] == 4

        finally:
            # Clean up
            try:
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_user_status_to_unenroll(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(
                email="testteacher@example.com",
                role_id=3
            )) 

            user = create_user(sample_user(
                email="teststudent@example.com",
                owner_id=teacher.user_id
            ))

            course = create_course(sample_course(teacher_user_id=teacher.user_id)) 
            user_course = create_user_course(sample_user_course(
                user_id=user.user_id,
                course_id=course.course_id,
            ))

            token = sample_token(user_id=teacher.user_id)

            response = client.put(
                f"/api/user?uid={user.user_id}&unenroll_user=true&course_id={course.course_id}&user_id={teacher.user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print('data: ', data)
            assert response.status_code == 201

            assert len(data["content"]["users"][0]) == 0

            user_course = get_user_course(user_course.user_course_id)
            print("user course: ", user_course)
            assert user_course.active == False
            assert user_course.user_id == user.user_id

        finally:
            # Clean up
            try:
                delete_user_course(user_course.user_course_id)
                delete_course(course.course_id)
                delete_user(user.user_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_remove_users_from_team(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)

            team = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )

            for i in range(4):
                sample_team_user(
                    team_id=team.team_id,
                    user_id=users[i].user_id
                )
            
            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/user?team_id={team.team_id}&user_ids={users[0].user_id},{users[1].user_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 201
            assert data["success"] is True
            assert len(data["content"]["users"][0]) == 0

            assert len(get_team_users_by_team_id(team.team_id)) == 2
        
        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team.team_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_user_to_admin_with_new_email(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            ta = create_users(result["course_id"], result["user_id"], number_of_users=2, role_id=4)
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)
            
            replaced_ta_data = sample_user(
                email="testnewadmin@example.com",
                role_id=3,
                owner_id=result["user_id"]
            )
            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/user?uid={ta[0].user_id}&new_email=testnewadmin@example.com&owner_id={result["user_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=replaced_ta_data
            )

            data = response.get_json()
            assert response.status_code == 201

            rslt = data["content"]["users"]
            print("result: ", rslt)
            assert len(rslt) == 1
            assert  rslt[0]["user_id"] == ta[0].user_id
            assert rslt[0]["email"] == "testnewadmin@example.com"
            assert rslt[0]["is_admin"] is True

        finally:
            # Clean up
            try:
                delete_users(users)
                delete_users(ta)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_unmake_admin_user(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(role_id=2))
            result = create_one_admin_course(True)
            teacher = create_user(sample_user(
                email="testuser@example.com",
                role_id=3,
                owner_id=user.user_id
            ))

            replaced_teacher_data = sample_user(
                email="testuser@example.com",
                role_id=4,
                owner_id=result["user_id"]
            )

            token = sample_token(user_id=user.user_id)

            response = client.put(
                f"/api/user?uid={teacher.user_id}&new_email=None&owner_id=None&user_id={user.user_id}",
                headers=auth_header(token),
                json=replaced_teacher_data
            )

            data = response.get_json()
            assert response.status_code == 201

            rslt = data["content"]["users"]
            print("result: ", rslt)
            assert len(rslt) == 1
            assert  rslt[0]["user_id"] == teacher.user_id
            assert rslt[0]["email"] == "testuser@example.com"
            assert rslt[0]["is_admin"] is False

        finally:
            # Clean up
            try:
                delete_user(teacher.user_id)
                delete_one_admin_course(result)
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_user_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(role_id=2))
    
            token = sample_token(user_id=user.user_id)

            response = client.put(
                f"/api/user?uid=999&new_email=None&owner_id=None&user_id={user.user_id}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "An error occurred replacing a user_id" in str(data)

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_delete_selected_user(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            admin = create_user(sample_user(
                email="testadmin@example.com",
                role_id=2
            ))

            user = create_user(sample_user(
                email="testuser@example.com",
                role_id=5
            ))

            token = sample_token(user_id=admin.user_id)

            response = client.delete(
                f"/api/user?uid={user.user_id}&user_id={admin.user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
            assert data["success"] is True
            assert len(data["content"]["users"][0]) == 0
        
            with pytest.raises(InvalidUserID):
                get_user(user.user_id)

        finally:
            # Clean up
            try:
                delete_user(admin.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_cannot_delete_user_with_associated_task(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            admin = create_user(sample_user(
                email="testadmin@example.com",
                role_id=2
            ))
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = sample_completed_assessment(
                user_id=user[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            )
            comp = create_completed_assessment(payload)

            token = sample_token(user_id=admin.user_id)

            response = client.delete(
                f"/api/user?uid={user[0].user_id}&user_id={admin.user_id}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "Cannot delete user with associated tasks" in str(data)

        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
                delete_user(admin.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
                

def test_delete_selected_user_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(role_id=2))
    
            token = sample_token(user_id=user.user_id)

            response = client.delete(
                f"/api/user?uid=999&new_email=None&owner_id=None&user_id={user.user_id}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "An error occurred deleting a user" in str(data)

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 
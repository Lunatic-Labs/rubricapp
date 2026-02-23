import pytest
from core import db
from models.team import *
from models.team_user import *
from models.schemas import (
    TeamUser,
    Team, 
    CompletedAssessment,
    Checkin
)
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from models.user import create_user, delete_user
from integration.integration_helpers import *
from models.course import create_course, delete_course
from models.user import get_user_first_name
import jwt

from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task,
)
from models.completed_assessment import (
    create_completed_assessment,
    delete_completed_assessment_tasks
)
from models.rubric import delete_rubric_by_id
from models.checkin import create_checkin


def test_get_all_teams_with_course_id(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team_name = ["Alpha", "Omega", "Bison"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"]
                ))

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/team?course_id={result["course_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            assert len(results) == 3
            assert any(t["team_id"] == team[0].team_id for t in results)
            assert any(t["team_id"] == team[1].team_id for t in results)
            assert any(t["team_id"] == team[2].team_id for t in results)
            assert any(t["team_name"] == "Alpha" for t in results)
            assert all(t["observer_id"] == result["user_id"] for t in results)

        finally:
            # Clean up
            try:
                Team.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_teams(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team_name = ["Alpha", "Omega", "Bison"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"]
                ))

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/team?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            assert len(results) == 3
            assert any(t["team_id"] == team[0].team_id for t in results)
            assert any(t["team_id"] == team[1].team_id for t in results)
            assert any(t["team_id"] == team[2].team_id for t in results)
            assert all(t["observer_id"] == result["user_id"] for t in results)

        finally:
            # Clean up
            try:
                Team.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

# FAILED TEST
def test_get_all_teams_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(role_id=3))
    
            token = sample_token(user_id=user.user_id)

            response = client.get(
                f"/api/team?course_id=888&user_id={user.user_id}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "An error occurred retrieving all teams" in str(data)

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_all_teams_by_user(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team_name = ["Alpha", "Omega", "Bison"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"]
                ))
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
            sample_team_user(team_id=team[0].team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team[0].team_id, user_id=users[1].user_id)
            sample_team_user(team_id=team[1].team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team[2].team_id, user_id=users[2].user_id)

            token = sample_token(user_id=users[0].user_id)

            response = client.get(
                f"/api/team_by_user?course_id={result["course_id"]}&adhoc_mode=false&user_id={users[0].user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            print("results: ", results)
            assert len(results) == 2
            assert any(t["team_id"] == team[0].team_id for t in results)
            assert any(t["team_id"] == team[1].team_id for t in results)
            assert any(t["team_name"] == "Omega" for t in results)
            assert all(t["course_id"] == result["course_id"] for t in results)
            assert all(t["observer_id"] == result["user_id"] for t in results)

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_users(users)
                Team.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_adhoc_teams_by_user(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team_name = ["Alpha", "Omega", "Bison"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"],
                    assessment_task_id=task.assessment_task_id
                ))
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)
            sample_team_user(team_id=team[0].team_id, user_id=users[0].user_id)
            sample_team_user(team_id=team[0].team_id, user_id=users[1].user_id)
            sample_team_user(team_id=team[1].team_id, user_id=users[3].user_id)
            sample_team_user(team_id=team[2].team_id, user_id=users[2].user_id)

            create_checkin(sample_checkin(task.assessment_task_id, users[0].user_id, team_number=team[1].team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[0].user_id, team_number=team[2].team_id))

            token = sample_token(user_id=users[0].user_id)

            response = client.get(
                f"/api/team_by_user?course_id={result["course_id"]}&adhoc_mode=true&user_id={users[0].user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            print("results: ", results)
            assert len(results) == 2
            assert any(t["team_id"] == team[1].team_id for t in results)
            assert any(t["team_id"] == team[2].team_id for t in results)
            assert any(t["team_name"] == "Bison" for t in results)
            assert all(t["course_id"] == result["course_id"] for t in results)
            assert all(t["observer_id"] == result["user_id"] for t in results)

        finally:
            # Clean up
            try:
                Checkin.query.delete()
                TeamUser.query.delete()
                delete_users(users)
                Team.query.delete()
                delete_assessment_task(task.assessment_Task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

# FAILED TEST
def test_get_all_teams_by_user_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(role_id=3))
    
            token = sample_token(user_id=user.user_id)

            response = client.get(
                f"/api/team_by_user?user_id={user.user_id}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "No parameter's given to retrieve teams" in str(data)

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_all_teams_by_observer(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team_name = ["Alpha", "Omega", "Bison"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"]
                ))

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/team_by_observer?course_id={result["course_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            assert len(results) == 3
            assert any(t["team_id"] == team[0].team_id for t in results)
            assert any(t["team_id"] == team[1].team_id for t in results)
            assert any(t["team_id"] == team[2].team_id for t in results)
            assert all(t["observer_id"] == result["user_id"] for t in results)

        finally:
            # Clean up
            try:
                Team.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_teams_by_observer_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(role_id=3))
    
            token = sample_token(user_id=user.user_id)

            response = client.get(
                f"/api/team_by_observer?user_id={user.user_id}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "An error occurred retrieving all teams" in str(data)

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 

# FAILED TEST
def test_get_one_team(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/one_team?team_id={team.team_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data["content"]["teams"]
            print("result: ", rslt)
            assert len(rslt) == 1
            assert rslt[0]["team_id"] == team.team_id 
            assert rslt[0]["team_name"] == "Alpha"

        finally:
            # Clean up
            try:
                Team.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

# FAILED TEST
def test_get_one_team_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/one_team?team_id=999&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "An error occurred fetching a team" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_adhoc_team_data(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team_name = ["Team 1", "Team 2", "Team 3"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"],
                    assessment_task_id=task.assessment_task_id
                ))
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)
            sample_team_user(team_id=team[0].team_id, user_id=users[0].user_id)

            create_checkin(sample_checkin(task.assessment_task_id, users[1].user_id, team_number=team[1].team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[2].user_id, team_number=team[2].team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[3].user_id, team_number=team[2].team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[0].user_id, team_number=team[1].team_id))

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/team/adhoc?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            print("results: ", results)
            assert len(results) == 2
            assert any(t["team_id"] == team[1].team_id for t in results)
            assert any(t["team_id"] == team[2].team_id for t in results)
            assert any(t["team_name"] == "Team 3" for t in results)
            assert all(t["course_id"] == result["course_id"] for t in results)
            assert all(t["observer_id"] == result["user_id"] for t in results)

        finally:
            # Clean up
            try:
                Checkin.query.delete()
                TeamUser.query.delete()
                delete_users(users)
                Team.query.delete()
                delete_assessment_task(task.assessment_Task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_adhoc_team_data_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/team/adhoc?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "An error occurred getting adhoc teams" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 

# FAILED TEST
def test_get_nonfull_adhoc_teams(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team_name = ["Team 1", "Team 2", "Team 3"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"],
                    assessment_task_id=task.assessment_task_id
                ))
            users = create_users(result["course_id"], result["user_id"], number_of_users=12)
            sample_team_user(team_id=team[0].team_id, user_id=users[0].user_id)

            for i in range(5):
                create_checkin(sample_checkin(task.assessment_task_id, users[i].user_id, team_number=team[0].team_id))
            for i in range(5, 8):
                create_checkin(sample_checkin(task.assessment_task_id, users[i].user_id, team_number=team[1].team_id))
            for i in range(8, 11):
                create_checkin(sample_checkin(task.assessment_task_id, users[i].user_id, team_number=team[2].team_id))

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/nonfull-adhoc?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            print("results: ", results)
            assert len(results) == 2
            assert any(t["team_id"] == team[1].team_id for t in results)
            assert any(t["team_id"] == team[2].team_id for t in results)
            assert any(t["team_name"] == "Team 3" for t in results)
            assert all(t["course_id"] == result["course_id"] for t in results)
            assert all(t["observer_id"] == result["user_id"] for t in results)

        finally:
            # Clean up
            try:
                Checkin.query.delete()
                TeamUser.query.delete()
                delete_users(users)
                Team.query.delete()
                delete_assessment_task(task.assessment_Task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_nonfull_adhoc_teams_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/nonfull-adhoc?&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "No parameter's given to retrieve nonfull adhoc teams" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_how_many_adhoc_teams_exist(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team_name = ["Team 1", "Team 2", "Team 3"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"],
                    assessment_task_id=task.assessment_task_id
                ))
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)
            sample_team_user(team_id=team[0].team_id, user_id=users[0].user_id)

            create_checkin(sample_checkin(task.assessment_task_id, users[1].user_id, team_number=team[1].team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[2].user_id, team_number=team[2].team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[3].user_id, team_number=team[2].team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[0].user_id, team_number=team[1].team_id))

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/adhoc_amount?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            assert results == 2

        finally:
            # Clean up
            try:
                Checkin.query.delete()
                TeamUser.query.delete()
                delete_users(users)
                Team.query.delete()
                delete_assessment_task(task.assessment_Task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

# FAILED TEST
def test_get_howmany_adhoc_teams_exist_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/adhoc_amount?&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "No parameter's given to retrieve adhoc teams amount" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_add_team(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team_data = {
                "team_name": "Alpha",
                "observer_id": result["user_id"],
                "date_created": datetime.now().strftime('%m/%d/%Y'),
                "course_id": result["course_id"],
                "assessment_task_id": None
            }

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/team?user_id={result["user_id"]}",
                headers=auth_header(token),
                json=team_data
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data["content"]["teams"]
            assert len(rslt) == 1
            assert rslt[0]["team_id"] is not None
            assert rslt[0]["team_name"] == "Alpha"
            assert rslt[0]["course_id"] == result["course_id"]

        finally:
            # Clean up
            try:
                delete_team(rslt[0]["team_id"])
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_add_team_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/team?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "An error occurred adding a team" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_update_team(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team(
                team_name="Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"],
            )

            replaced_team_data = {
                "team_name": "Omega",
                "observer_id": result["user_id"],
                "date_created": datetime.now().strftime('%m/%d/%Y'),
                "course_id": result["course_id"],
                "assessment_task_id": None
            }
        
            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/team?team_id={team.team_id}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=replaced_team_data
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data["content"]["teams"]
            assert len(rslt) == 1
            assert rslt[0]["team_id"] == team.team_id
            assert rslt[0]["team_name"] == "Omega"
            assert rslt[0]["course_id"] == result["course_id"]

        finally:
            # Clean up
            try:
                delete_team(rslt[0]["team_id"])
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_update_team_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/team?team_id=999&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "An error occurred retrieving replacing a team" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 

# FAILED TEST
def test_update_team_user_by_edit(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            team_name = ["Team 1", "Team 2", "Team 3"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"],
                    assessment_task_id=task.assessment_task_id
                ))
            users = create_users(result["course_id"], result["user_id"], number_of_users=7)
            for i in range(4):
                sample_team_user(team_id=team[0].team_id, user_id=users[i].user_id)

            sample_team_user(team_id=team[1].team_id, user_id=users[4].user_id)
            sample_team_user(team_id=team[2].team_id, user_id=users[5].user_id)

            edit_data = [users[3].user_id, users[4].user_id, users[5].user_id]

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/team_user?user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "team_id": team[0].team_id,
                    "userEdits": edit_data
                }
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            results = data["content"]["team_users"][0]
            print("results: ", results)
            assert len(results) == 3
            assert all(t["team_id"] == team[0].team_id for t in results)
            assert any(t["user_id"] == users[3].user_id for t in results)
            assert any(t["user_id"] == users[4].user_id for t in results)
            assert any(t["user_id"] == users[5].user_id for t in results)

            assert len(get_team_users_by_team_id(team[0].team_id)) == 3

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_users(users)
                Team.query.delete()
                delete_assessment_task(task.assessment_Task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_team_user_by_edit_raises_exception(
        flask_app_mock, 
        sample_token, 
        auth_header, 
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/team_user?team_id=999&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "An error occurred updating a team" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 

# FAILED TEST
def test_delete_selected_teams(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            team_name = ["Team 1", "Team 2", "Team 3"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"],
                    assessment_task_id=task.assessment_task_id
                ))

            comp = create_completed_assessment(sample_completed_assessment(
                user_id=None,
                task_id=task.assessment_task_id,
                team_id=team[0].team_id,
                rating=completely["3"],
                c_by=result["user_id"]
            ))

            token = sample_token(user_id=result["user_id"])

            response = client.delete(
                f"/api/team?user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "team_ids": [team[1].team_id, team[2].team_id]
                }
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            assert len(data["content"]["teams"][0]) == 0
            
            with pytest.raises(InvalidTeamID):
                get_team(team[1].team_id)
            
            with pytest.raises(InvalidTeamID):
                get_team(team[2].team_id)

        finally:
            # Clean up
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_task_id)
                Team.query.delete()
                delete_assessment_task(task.assessment_Task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

# FAILED TEST
def test_cannot_delete_selected_teams_with_completed_assessment(
        flask_app_mock, 
        sample_token, 
        auth_header, 
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            team_name = ["Team 1", "Team 2", "Team 3"]

            team = []
            for i in range(3):
                team.append(sample_team(
                    team_name=team_name[i],
                    observer_id=result["user_id"],
                    course_id=result["course_id"],
                    assessment_task_id=task.assessment_task_id
                ))

            create_completed_assessment(sample_completed_assessment(
                user_id=None,
                task_id=task.assessment_task_id,
                team_id=team[0].team_id,
                rating=completely["3"],
                c_by=result["user_id"]
            ))

            create_completed_assessment(sample_completed_assessment(
                user_id=None,
                task_id=task.assessment_task_id,
                team_id=team[1].team_id,
                rating=completely["5"],
                c_by=result["user_id"]
            ))

            token = sample_token(user_id=result["user_id"])

            response = client.delete(
                f"/api/team?user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "team_ids": [team[2].team_id, team[1].team_id]
                }
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert f"Cannot delete team {team[1].team_id} with associated tasks" in str(data)

        finally:
            # Clean up
            try:
                CompletedAssessment.query.delete()
                Team.query.delete()
                delete_assessment_task(task.assessment_Task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

# FAILED TEST
def test_delete_non_existing_selected_teams_raises_exception(
        flask_app_mock, 
        sample_token, 
        auth_header, 
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            token = sample_token(user_id=result["user_id"])

            response = client.delete(
                f"/api/team?user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "team_ids": 999
                }
            )

            data = response.get_json()
            assert response.status_code == 400
            assert data['success'] == False
            assert "An error occurred deleting a team" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_all_team_users(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
        
            team = sample_team(
                team_name= "Alpha",
                observer_id=result["user_id"],
                course_id=result["course_id"]
            )
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
            for i in range(3):
                sample_team_user(team_id=team.team_id, user_id=users[i].user_id)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/get_all_team_users?course_id={result["course_id"]}&team_id={team.team_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            results = data["content"]["teams"][0]
            print("results: ", results)
            assert len(results) == 3

            user1_name = get_user_first_name(users[0].user_id)
            assert any(t["name"] == user1_name for t in results)

            user2_name = get_user_first_name(users[1].user_id)
            assert any(t["name"] == user2_name for t in results)

            user3_name = get_user_first_name(users[2].user_id)
            assert any(t["name"] == user3_name for t in results)
            

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_users(users)
                Team.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
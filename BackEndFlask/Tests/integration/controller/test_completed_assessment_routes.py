import pytest
from core import db
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
)
from models.rubric import delete_rubric_by_id
import jwt
from models.team import delete_team
from models.team_user import delete_team_user


def test_toggle_complete_assessment_lock_status(
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

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            comp = create_completed_assessment(sample_completed_assessment(
                user_id=user[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/completed_assessment_toggle_lock?assessment_task_id={task.assessment_task_id}&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 201
        
            rslt = data['content']['completed_assessments'] 
            assert rslt[0] == None

            ca = get_completed_assessment(comp.completed_assessment_id)
            assert ca.completed_assessment_id == comp.completed_assessment_id
            assert ca.locked is True
            
        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_toggle_complete_assessment_lock_status_raises_exception(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/completed_assessment_toggle_lock?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_rubric_by_id(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_lock_complete_assessment(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            comp = create_completed_assessment(sample_completed_assessment(
                user_id=user[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/completed_assessment_lock?assessment_task_id={task.assessment_task_id}&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 201
        
            rslt = data['content']['completed_assessments'] 
            assert rslt[0] == None

            ca = get_completed_assessment(comp.completed_assessment_id)
            assert ca.completed_assessment_id == comp.completed_assessment_id
            assert ca.locked is True
            
        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_lock_complete_assessment_raises_exception(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/completed_assessment_lock?user_id={result["user_id"]}",
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


def test_unlock_complete_assessment(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            comp = create_completed_assessment(sample_completed_assessment(
                user_id=user[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            toggle_lock_status(comp.completed_assessment_id)

            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/completed_assessment_unlock?assessment_task_id={task.assessment_task_id}&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 201
        
            rslt = data['content']['completed_assessments'] 
            assert rslt[0] == None

            ca = get_completed_assessment(comp.completed_assessment_id)
            assert ca.completed_assessment_id == comp.completed_assessment_id
            assert ca.locked is False
            
        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_users(user)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_lunlock_complete_assessment_raises_exception(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/completed_assessment_unlock?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_rubric_by_id(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_lock_complete_assessment_raises_exception(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/completed_assessment_lock?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_rubric_by_id(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_course_id_and_only_course(
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
            task = []
            task.append(create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id)))
            task.append(create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 2"
            )))
            task.append(create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 3"
            )))

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp = []
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task[0].assessment_task_id,
                c_by=result["user_id"]
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task[0].assessment_task_id,
                c_by=result["user_id"]
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task[1].assessment_task_id,
                c_by=result["user_id"]
            )))

            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/completed_assessment?course_id={result["course_id"]}&user_id={result['user_id']}&only_course=true",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200
        
            results = data['content']['completed_assessments'][0]
            print(results)
            assert len(results) == 3
            assert results[0]["assessment_task_id"] == task[0].assessment_task_id
            assert results[0]["completed_count"] == 2
            assert results[1]["assessment_task_id"] == task[1].assessment_task_id
            assert results[1]["completed_count"] == 1
            assert results[2]["assessment_task_id"] == task[2].assessment_task_id
            assert results[2]["completed_count"] == 0
            
        finally:
            # Clean up 
            try:
                for i in range(3):
                    delete_completed_assessment_tasks(comp[i].completed_assessment_id)
                delete_users(users)
                for i in range(3):
                    delete_assessment_task(task[i].assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_course_id_and_role_id(
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
            rubric = sample_rubric(ta[0].user_id, "Critical Thinking")
            task = []
            task.append(create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id)))
            task.append(create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 2"
            )))
            task.append(create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 3"
            )))

            user = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp = []
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=user[0].user_id,
                task_id=task[0].assessment_task_id,
                c_by=ta[0].user_id
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=user[1].user_id,
                task_id=task[0].assessment_task_id,
                c_by=ta[0].user_id
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=user[1].user_id,
                task_id=task[1].assessment_task_id,
                c_by=ta[0].user_id
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=user[0].user_id,
                task_id=task[2].assessment_task_id,
                c_by=result["user_id"]
            )))

            token = sample_token(user_id=ta[0].user_id)
            
            response = client.get(
                f"/api/completed_assessment?course_id={result["course_id"]}&role_id={4}&user_id={ta[0].user_id}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200
        
            results = data['content']['completed_assessments'][0]
            print(results)
            assert len(results) == 3
            assert results[0]["completed_assessment_id"] == comp[0].completed_assessment_id
            assert results[0]["assessment_task_id"] == task[0].assessment_task_id
            assert results[1]["completed_assessment_id"] == comp[1].completed_assessment_id
            assert results[1]["assessment_task_id"] == task[0].assessment_task_id
            assert results[2]["completed_assessment_id"] == comp[2].completed_assessment_id
            assert results[2]["assessment_task_id"] == task[1].assessment_task_id
            
        finally:
            # Clean up 
            try:
                for i in range(3):
                    delete_completed_assessment_tasks(comp[i].completed_assessment_id)
                delete_users(user)
                for i in range(3):
                    delete_assessment_task(task[i].assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_users(ta)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_course_id_and_assessment_task_id(
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
            task = []
            task.append(create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id)))
            task.append(create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 2"
            )))
            task.append(create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 3"
            )))

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp = []
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task[0].assessment_task_id,
                c_by=result["user_id"]
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task[0].assessment_task_id,
                c_by=result["user_id"]
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task[1].assessment_task_id,
                c_by=result["user_id"]
            )))

            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/completed_assessment?course_id={result["course_id"]}&user_id={result['user_id']}&assessment_id={task[0].assessment_task_id}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200
        
            results = data['content']['completed_assessments'][0]
            print(results)
            assert results == 2
            
        finally:
            # Clean up 
            try:
                for i in range(3):
                    delete_completed_assessment_tasks(comp[i].completed_assessment_id)
                delete_users(users)
                for i in range(3):
                    delete_assessment_task(task[i].assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

    
def test_get_all_completed_assessments_with_course_id_and_user_id(
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
            task1 = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))
            task2 = create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 2"
            ))

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp = []
            comp.append(create_completed_assessment(sample_completed_assessment(
                users[0].user_id, 
                task1.assessment_task_id,
                c_by=result["user_id"]
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                users[1].user_id, 
                task1.assessment_task_id,
                c_by=result["user_id"]
            )))
            comp.append(create_completed_assessment(sample_completed_assessment(
                users[0].user_id, 
                task2.assessment_task_id,
                c_by=result["user_id"]
            )))

            token = sample_token(user_id=users[0].user_id)

            response = client.get(
                f"/api/completed_assessment?course_id={result["course_id"]}&user_id={users[0].user_id}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments'][0]
            print(results)
            assert len(results) == 2
            assert any(r["completed_assessment_id"] == comp[0].completed_assessment_id for r in results)
            assert any(r["completed_assessment_id"] == comp[2].completed_assessment_id for r in results)
            assert all(r["user_id"] == users[0].user_id for r in results)
            assert any(r["assessment_task_id"] == task1.assessment_task_id for r in results)
            assert any(r["assessment_task_id"] == task2.assessment_task_id for r in results)

        finally:
            # Clean up 
            try:
                for i in range(3):
                    delete_completed_assessment_tasks(comp[i].completed_assessment_id)
                delete_users(users)
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_assessment_task_id_and_team(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
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
            tu1 = sample_team_user(team1.team_id, users[0].user_id)
            tu2 = sample_team_user(team2.team_id, users[1].user_id)

            comp1 = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                team_id=team1.team_id,
                c_by=result["user_id"]
            ))
            comp2 = create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task.assessment_task_id,
                team_id=team2.team_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/completed_assessment?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}&unit=team",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments'][0]
            print(results)
            assert len(results) == 2
            assert any(r["completed_assessment_id"] == comp1.completed_assessment_id for r in results)
            assert any(r["completed_assessment_id"] == comp2.completed_assessment_id for r in results)
            assert {r["user_id"] for r in results} == {users[0].user_id, users[1].user_id}
            assert all(r["assessment_task_id"] == task.assessment_task_id for r in results)
            assert {r["team_name"] for r in results} == {team1.team_name, team2.team_name}

        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_team_user(tu1.team_user_id)
                delete_team_user(tu2.team_user_id)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_assessment_task_id_and_not_team(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp1 = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            comp2 = create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/completed_assessment?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}&unit=noteam",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments'][0]
            print(results)
            assert len(results) == 2
            assert any(r["completed_assessment_id"] == comp1.completed_assessment_id for r in results)
            assert any(r["completed_assessment_id"] == comp2.completed_assessment_id for r in results)
            assert {r["user_id"] for r in results} == {users[0].user_id, users[1].user_id}
            assert all(r["assessment_task_id"] == task.assessment_task_id for r in results)
            assert {r["first_name"] for r in results} == {users[0].first_name, users[1].first_name}

        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_assessment_task_id(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp1 = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            comp2 = create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/completed_assessment?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments'][0]
            print(results)
            assert len(results) == 2
            assert any(r["completed_count"] == 2 for r in results)
            assert any(r["completed_assessment_id"] == comp1.completed_assessment_id for r in results)
            assert any(r["completed_assessment_id"] == comp2.completed_assessment_id for r in results)
            assert {r["user_id"] for r in results} == {users[0].user_id, users[1].user_id}
            assert all(r["assessment_task_id"] == task.assessment_task_id for r in results)
            assert {r["first_name"] for r in results} == {users[0].first_name, users[1].first_name}

        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_completed_assessment_task_id(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp1 = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            comp2 = create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/completed_assessment?completed_assessment_task_id={comp1.completed_assessment_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments']
            print(results)
            assert len(results) == 1
            assert all(r["completed_assessment_id"] == comp1.completed_assessment_id for r in results)
            assert {r["user_id"] for r in results} == {users[0].user_id}
            assert all(r["assessment_task_id"] == task.assessment_task_id for r in results)

        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            comp1 = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            comp2 = create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task.assessment_task_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/completed_assessment?user_id={result["user_id"]}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments'][0]
            print(results)
            assert len(results) == 2
            assert any(r["completed_assessment_id"] == comp1.completed_assessment_id for r in results)
            assert any(r["completed_assessment_id"] == comp2.completed_assessment_id for r in results)
            assert {r["user_id"] for r in results} == {users[0].user_id, users[1].user_id}
            assert all(r["assessment_task_id"] == task.assessment_task_id for r in results)


        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_completed_assessments_with_assessment_task_id_raises_exception(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/completed_assessment?assessment_task_id=999&user_id={result["user_id"]}&unit=team",
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


def test_get_completed_assessment_by_team_or_user_id_with_team(
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
            task1 = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))
            task2 = create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 2"
            ))

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            team = sample_team(
                "Alpha",
                result["user_id"],
                result["course_id"],
                assessment_task_id=task1.assessment_task_id
            )
            comp = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task1.assessment_task_id,
                team_id=team.team_id,
                c_by=result["user_id"]
            ))
            comp1 = create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task2.assessment_task_id,
                team_id=team.team_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=result["user_id"])
        
            response = client.get(
                f"/api/completed_assessment_by_team_or_user?completed_assessment_id={comp.completed_assessment_id}&user_id={result["user_id"]}&unit=team&team_id={team.team_id}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments'][0]
            assert len(results) == 2
            print([r for r in results])
            assert results[0]["completed_assessment_id"] == comp.completed_assessment_id
            assert results[0]["user_id"] == users[0].user_id
            assert results[0]["assessment_task_id"] == task1.assessment_task_id
            assert results[1]["assessment_task_id"] == task2.assessment_task_id
            assert results[0]["team_id"] == team.team_id
    
        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_team(team.team_id)
                delete_users(users)
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_completed_assessment_by_team_or_user_id_with_user(
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
            task1 = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))
            task2 = create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 2"
            ))

            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            team = sample_team(
                "Alpha",
                result["user_id"],
                result["course_id"],
                assessment_task_id=task1.assessment_task_id
            )
            comp = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task1.assessment_task_id,
                team_id=team.team_id,
                c_by=result["user_id"]
            ))
            comp1 = create_completed_assessment(sample_completed_assessment(
                user_id=users[1].user_id,
                task_id=task2.assessment_task_id,
                team_id=team.team_id,
                c_by=result["user_id"]
            ))
            comp2 = create_completed_assessment(sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task2.assessment_task_id,
                team_id=team.team_id,
                c_by=result["user_id"]
            ))
            
            token = sample_token(user_id=users[0].user_id)
        
            response = client.get(
                f"/api/completed_assessment_by_team_or_user?completed_assessment_id={comp.completed_assessment_id}&user_id={users[0].user_id}&unit=user",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200

            results = data['content']['completed_assessments'][0]
            assert len(results) == 2
            print([r for r in results])
            assert results[0]["completed_assessment_id"] == comp.completed_assessment_id
            assert results[1]["completed_assessment_id"] == comp2.completed_assessment_id
            assert results[0]["assessment_task_id"] == task1.assessment_task_id
            assert all(r["user_id"] == users[0].user_id for r in results)
    
        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_team(team.team_id)
                delete_users(users)
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_completed_assessment_by_team_or_user_id_with_not_comp_ass_id(
    flask_app_mock,
    sample_token,
    auth_header,
    client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/completed_assessment_by_team_or_user?user_id={result["user_id"]}",
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


def test_get_completed_assessment_by_team_or_user_id_with_not_team_and_user(
    flask_app_mock,
    sample_token,
    auth_header,
    client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/completed_assessment_by_team_or_user?completed_assessment_id=999&user_id={result["user_id"]}",
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


def test_replaced_completed_assessment_with_team_id_and_not_user_id(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=2)
            team = sample_team(
                "Alpha",
                result["user_id"],
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )
            comp = create_completed_assessment(sample_completed_assessment(
                user_id=None,
                task_id=task.assessment_task_id,
                team_id=team.team_id,
                c_by=result["user_id"]
            ))
            payload = sample_completed_assessment(
                user_id=-1,
                task_id=task.assessment_task_id,
                team_id=team.team_id,
                rating=completely["3"],
                c_by=result["user_id"]
            )
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/completed_assessment?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=payload
            )
            
            data = response.get_json()
            assert response.status_code == 201

            rslt = data['content']['completed_assessments']
            print(rslt)
            assert len(rslt) == 1
            assert rslt[0]["completed_assessment_id"] == comp.completed_assessment_id 
            assert rslt[0]["rating_observable_characteristics_suggestions_data"] == "Partially"
            assert rslt[0]["assessment_task_id"] == task.assessment_task_id


        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_team(team.team_id)
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

        
def test_add_completed_assessment_with_user_id_and_not_team_id(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                team_id=-1,
                c_by=result["user_id"]
            )
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/completed_assessment?assessment_task_id={task.assessment_task_id}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=payload
            )
            
            data = response.get_json()
            assert response.status_code == 201

            rslt = data['content']['completed_assessments']
            print(rslt)
            assert len(rslt) == 1
            assert rslt[0]["completed_assessment_id"] is not None 
            assert rslt[0]["rating_observable_characteristics_suggestions_data"] == "Completely"
            assert rslt[0]["assessment_task_id"] == task.assessment_task_id
            assert rslt[0]["user_id"] == users[0].user_id
            assert rslt[0]["team_id"] is None


        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(rslt[0]["completed_assessment_id"])
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

        
def test_add_completed_assessment_with_assessment_task_id_raises_exception(
    flask_app_mock,
    sample_token,
    auth_header,
    client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/completed_assessment?user_id={result["user_id"]}",
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


def test_update_completed_assessment_with_comp_ass_id_team_id_and_not_user_id(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=2)
            team = sample_team(
                "Alpha",
                result["user_id"],
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )
            comp = create_completed_assessment(sample_completed_assessment(
                user_id=None,
                task_id=task.assessment_task_id,
                team_id=team.team_id,
                c_by=result["user_id"]
            ))
            payload = sample_completed_assessment(
                user_id=-1,
                task_id=task.assessment_task_id,
                team_id=team.team_id,
                rating=completely["3"],
                c_by=result["user_id"]
            )
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/completed_assessment?completed_assessment_id={comp.completed_assessment_id}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=payload
            )
            
            data = response.get_json()
            assert response.status_code == 201

            rslt = data['content']['completed_assessments']
            print(rslt)
            assert len(rslt) == 1
            assert rslt[0]["completed_assessment_id"] == comp.completed_assessment_id 
            assert rslt[0]["rating_observable_characteristics_suggestions_data"] == "Partially"
            assert rslt[0]["assessment_task_id"] == task.assessment_task_id


        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_team(team.team_id)
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_completed_assessment_with_user_id_and_not_comp_ass_id_and_team_id(
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

            users = create_users(result["course_id"], result["user_id"], number_of_users=2)
            payload = sample_completed_assessment(
                user_id=users[0].user_id,
                task_id=task.assessment_task_id,
                team_id=-1,
                c_by=result["user_id"]
            )
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/completed_assessment?user_id={result["user_id"]}",
                headers=auth_header(token),
                json=payload
            )
            
            data = response.get_json()
            assert response.status_code == 201

            rslt = data['content']['completed_assessments']
            print(rslt)
            assert len(rslt) == 1
            assert rslt[0]["completed_assessment_id"] is not None 
            assert rslt[0]["rating_observable_characteristics_suggestions_data"] == "Completely"
            assert rslt[0]["assessment_task_id"] == task.assessment_task_id
            assert rslt[0]["user_id"] == users[0].user_id
            assert rslt[0]["team_id"] is None


        finally:
            # Clean up 
            try:
                delete_completed_assessment_tasks(rslt[0]["completed_assessment_id"])
                delete_users(users)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_completed_assessment_with_not_completed_assessment_id_raises_exception(
    flask_app_mock,
    sample_token,
    auth_header,
    client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/completed_assessment?user_id={result["user_id"]}",
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
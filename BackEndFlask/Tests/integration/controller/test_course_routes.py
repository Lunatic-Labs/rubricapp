import pytest
from core import db
from models.course import *
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
from models.user_course import (
    create_user_course, 
    delete_user_course,
    delete_user_course_by_user_id_course_id,
)


def test_get_all_courses_with_admin_id(
        flask_app_mock,
        sample_token, 
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            admin = create_user(sample_user(email="testadmin@example.com", role_id=2))
            teacher1 = create_user(sample_user(email="testteacher1@example.com", role_id=3, owner_id=admin.user_id))
            course1 = create_course(sample_course(teacher1.user_id))
            course2 = create_course(sample_course(teacher1.user_id, course_number="CRS002"))

            teacher2 = create_user(sample_user(email="testteacher2@example.com", role_id=3, owner_id=admin.user_id))
            course3 = create_course(sample_course(teacher2.user_id, course_number="CRS003"))

            token = sample_token(user_id=admin.user_id)

            response = client.get(
                f"/api/course?admin_id={teacher1.user_id}&user_id={admin.user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
        
            results = data['content']['courses'][0]
            assert len(results) == 2
            assert any(c["course_id"] == course1.course_id for c in results)
            assert any(c["course_id"] == course2.course_id for c in results)
            assert any(c["course_number"] == course1.course_number for c in results)
            assert any(c["course_number"] == course2.course_number for c in results)
            assert all(c["admin_id"] == teacher1.user_id for c in results)

        finally:
            # Clean up
            try:
                delete_course(course1.course_id)
                delete_course(course2.course_id)
                delete_course(course3.course_id)
                delete_user(teacher1.user_id)
                delete_user(teacher2.user_id)
                delete_user(admin.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
            

def test_get_all_courses_with_course_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            team1 = sample_team("Alpha", result["user_id"], result["course_id"])
            team2 = sample_team("Alpha", result["user_id"], result["course_id"])
            
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/course?course_id={result["course_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
        
            results = data['content']['course_count'][0]
            print(results)
            assert len(results) == 2
            assert results[0] == 3
            assert results[1] == 2

        finally:
            # Clean up
            try:
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_courses_with_user_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher1 = create_user(sample_user(email="testteacher1@example.com", role_id=3))
            course1 = create_course(sample_course(teacher1.user_id))
            course2 = create_course(sample_course(teacher1.user_id, course_number="CRS002"))

            teacher2 = create_user(sample_user(email="testteacher2@example.com", role_id=3))
            course3 = create_course(sample_course(teacher2.user_id, course_number="CRS003"))

            users = []
            for i in range(1, 3):
                users.append(create_user(sample_user(
                    email=f"teststudent{i}example.com"
                )))
            uc = []
            uc.append(create_user_course(sample_user_course(
                users[0].user_id, 
                course1.course_id,
            )))
            uc.append(create_user_course(sample_user_course(
                users[1].user_id, 
                course1.course_id,
            )))
            uc.append(create_user_course(sample_user_course(
                users[0].user_id, 
                course2.course_id,
            )))
            uc.append(create_user_course(sample_user_course(
                users[0].user_id, 
                course3.course_id,
            )))
            
            token = sample_token(user_id=users[0].user_id)

            response = client.get(
                f"/api/course?user_id={users[0].user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
        
            results = data['content']['courses'][0]
            print(results)
            assert len(results) == 3
            assert any(c["course_id"] == course1.course_id for c in results)
            assert any(c["course_id"] == course2.course_id for c in results)
            assert any(c["course_id"] == course3.course_id for c in results)
            assert any(c["admin_id"] == teacher1.user_id for c in results)

        finally:
            # Clean up
            try:
                for i in range(4):
                    delete_user_course(uc[i])
                for i in range(2):
                    delete_user(users[i])
                delete_course(course1.course_id)
                delete_course(course2.course_id)
                delete_course(course3.course_id)
                delete_user(teacher1.user_id)
                delete_user(teacher2.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

        
def test_get_all_courses_raises_exception(
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
                f"/api/course?admin_id=999&user_id={result["user_id"]}",
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
            

def test_one_course_with_course_id(
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

            response = client.get(
                f"/api/one_course?course_id={result["course_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data['content']['courses']
            assert len(rslt) == 1
            assert rslt[0]["course_id"] == result["course_id"]
            assert rslt[0]["course_number"] == "CRS001"
        
        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_one_course_with_not_course_id_raises_exception(
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

            response = client.get(
                f"/api/one_course?user_id={result["user_id"]}",
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

        
def test_add_course(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(email="testteacher@example.com", role_id=3))
            payload = sample_course(teacher.user_id)

            token = sample_token(user_id=teacher.user_id)

            response = client.post(
                f"/api/course?user_id={teacher.user_id}",
                headers=auth_header(token),
                json=payload
            )

            data = response.get_json()
            assert response.status_code == 201

            result = data['content']['courses']
            assert len(result) == 1
            assert result[0]["course_number"] == payload["course_number"]
            assert result[0]["course_name"] == payload["course_name"]
        
        finally:
            # Clean up
            try:
                delete_user_course_by_user_id_course_id(teacher.user_id, result[0]["course_id"])
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

            
def test_add_course_raises_exception(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(email="testteacher@example.com", role_id=3))

            token = sample_token(user_id=teacher.user_id)

            response = client.post(
                f"/api/course?user_id={teacher.user_id}",
                headers=auth_header(token)
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
        
        finally:
            # Clean up
            try:
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_course_with_course_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            teacher = create_user(sample_user(email="testteacher@example.com", role_id=3))
            payload = sample_course(teacher.user_id, course_number="Math01")

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/course?course_id={result["course_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json=payload
            )


            data = response.get_json()
            assert response.status_code == 201

            updated = data['content']['courses']
            assert len(updated) == 1
            assert updated[0]["course_id"] == result["course_id"]
            assert updated[0]["course_number"] == "Math01"
            assert updated[0]["admin_id"] == teacher.user_id

        finally:
            # Clean up
            try:
                delete_course(result["course_id"])
                delete_user(teacher.user_id)
            except Exception as e:
                 print(f"Cleanup skipped: {e}")


def test_update_course_with_not_course_id_raises_exception(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(email="testteacher@example.com", role_id=3))
            payload = sample_course(teacher.user_id, course_number="Math01")

            token = sample_token(user_id=teacher.user_id)

            response = client.put(
                f"/api/course?user_id={teacher.user_id}",
                headers=auth_header(token),
                json=payload
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
        
        finally:
            # Clean up
            try:
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
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


def test_get_all_roles_with_course_and_user_ids(
        flask_app_mock, 
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            token = sample_token(user_id=user[0].user_id)

            response = client.get(
                f"/api/role?course_id={result["course_id"]}&user_id={user[0].user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data["content"]["roles"]
            assert rslt[0]["role_id"] == 5
            assert rslt[0]["role_name"] == "Student"

        finally:
            # Clean up
            try:
                delete_users(user)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

        
def test_get_all_roles(
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
                f"/api/role?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200

            rslt = data["content"]["roles"][0]
            print("result: ", rslt)
            assert any(r["role_id"] == 5 for r in rslt)
            assert any(r["role_id"] == 4 for r in rslt)
            assert any(r["role_name"] == "Admin" for r in rslt)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_post_details(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            token = sample_token(user_id=user[0].user_id)

            response = client.get(
                f"/api/role_id?role_id=5&user_id={user[0].user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200

            rslt = data["content"]["roles"]
            print("result: ", rslt)
            assert rslt[0]["role_id"] == 5
            assert rslt[0]["role_name"] == "Student"

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_post_details_raises_except(
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
                f"/api/role_id?user_id={result["user_id"]}",
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
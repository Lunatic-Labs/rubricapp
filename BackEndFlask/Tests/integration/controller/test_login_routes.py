import pytest
from core import db
from werkzeug.security import generate_password_hash
from models.feedback import *
from Tests.PopulationFunctions import cleanup_test_users
from integration.integration_helpers import *
from models.user import create_user, delete_user, set_reset_code
import jwt


def test_login_success(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            response = client.post(
                "/api/login",
                json={"email": user.email, "password": "password123"}
            )

            assert response.status_code == 200

            data = response.get_json()
            assert data["success"] is True
            assert "access_token" in data["headers"]
            assert "refresh_token" in data["headers"]

            result = data["content"]["login"]
            print(result)
            assert result[0]["email"] == user.email
            assert result[0]["user_id"] == user.user_id
             

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_login_with_missing_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
            
        response = client.post(
            "/api/login",
            json={"email": None, "password": "password123"}
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


def test_login_with_invalid_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
            
        response = client.post(
            "/api/login",
            json={"email": "testuser@example.com", "password": "password123"}
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


def test_set_new_password(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user_data = sample_user()
            del user_data["password"]
            user = create_user(user_data)

            response = client.put(
                "/api/password",
                json={"email": user.email, "password": "password123"}
            )

            assert response.status_code == 200

            data = response.get_json()
            print(data)
            msg = data["content"]["201"][0]
            assert f"Successfully set new password for user {user.user_id}" in msg
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_set_new_password_missing_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
            
        response = client.put(
            "/api/password",
            json={"email": None, "password": "password123"}
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


def test_set_new_password_with_invalid_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
            
        response = client.put(
            "/api/password",
            json={"email": "testuser@example", "password": "password123"}
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


def test_send_reset_code(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            response = client.get(
                f"/api/reset_code?email={user.email}"
            )

            assert response.status_code == 200

            data = response.get_json()
            msg = data["content"]["201"][0]
            assert f"Successfully sent reset code to {user.email}!" in msg
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_send_reset_code_missing_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        response = client.get(
            f"/api/reset_code?email=None"
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


def test_send_reset_code_with_invalid_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        response = client.get(
            f"/api/reset_code?email=testuser@example.com"
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


def test_check_reset_code(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            hash = generate_password_hash("password?123")
            set_reset_code(user.user_id, hash)

            response = client.post(
                f"/api/reset_code?email={user.email}&code=password?123"
            )

            assert response.status_code == 200

            data = response.get_json()
            msg = data["content"]["200"][0]
            assert f"Successfully matched passed in code with stored code for email: {user.email}!" in msg
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_check_reset_code_missing_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        response = client.post(
            f"/api/reset_code?email=None&code=password?123"
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


def test_check_reset_code_with_invalid_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        response = client.post(
            f"/api/reset_code?email=testuser@example.com&code=password?123"
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)
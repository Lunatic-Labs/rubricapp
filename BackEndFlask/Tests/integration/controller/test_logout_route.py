import pytest
from core import db
from werkzeug.security import generate_password_hash
from models.feedback import *
from Tests.PopulationFunctions import cleanup_test_users
from integration.integration_helpers import *
from models.user import create_user, delete_user, set_reset_code
import jwt


def test_logout(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            response = client.post(
                "/api/login",
                json={"email": user.email, "password": "password123"}
            )

            data = response.get_json()
            access_token = data["headers"]["access_token"]
            refresh_token = data["headers"]["refresh_token"]
            
            resp = client.post(
                f"/api/logout?user_id={user.user_id}",
                json={"access_token": access_token, "refresh_token": refresh_token}
            )

            assert resp.status_code == 200
            data = response.get_json()
            assert data['success'] is True

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
                
        
def test_logout_raises_exception(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            
            response = client.post(
                f"/api/logout?user_id={user.user_id}",
            )
            
            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
            
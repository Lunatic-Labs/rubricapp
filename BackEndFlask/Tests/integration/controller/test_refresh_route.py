import pytest
from core import db
from werkzeug.security import generate_password_hash
from Tests.PopulationFunctions import cleanup_test_users
from integration.integration_helpers import *
from models.user import create_user, delete_user, set_reset_code
import jwt


def test_refresh_token(flask_app_mock, auth_header, client):
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
                f"/api/refresh?user_id={user.user_id}",
                headers=auth_header(refresh_token)
            )

            data = resp.get_json()
            assert resp.status_code == 200
            assert data['success'] is True
            assert data["headers"]["access_token"] is not None

            result = data["content"]["user"]
            assert result[0]["email"] == user.email
            assert result[0]["user_id"] == user.user_id

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

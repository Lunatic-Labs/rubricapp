import pytest
from datetime import datetime, timedelta, timezone
from core import db
from werkzeug.security import generate_password_hash, check_password_hash
from models.feedback import *
from Tests.PopulationFunctions import cleanup_test_users
from integration.integration_helpers import *
from models.user import create_user, delete_user, set_reset_code, get_user_by_email
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

            reset_code = "password?123"
            set_reset_code(
                user.user_id,
                generate_password_hash(reset_code),
                datetime.now(timezone.utc) + timedelta(minutes=15)
            )

            response = client.put(
                "/api/password",
                json={"email": user.email, "password": "password123", "code": reset_code}
            )

            assert response.status_code == 201

            data = response.get_json()
            print(data)
            msg = data["content"]["password"][0]
            assert f"Successfully set new password for user {user.user_id}" in msg

            reloaded_user = get_user_by_email(user.email)
            assert reloaded_user.reset_code is None

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
        assert data["message"] == "An error occurred: Missing Email or Code"


def test_set_new_password_with_invalid_credentials(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
            
        response = client.put(
            "/api/password",
            json={"email": "testuser@example", "password": "password123", "code": "000000"}
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
        assert "error" in data or "An error occurred" in str(data)


# The three tests below cover the vulnerability this endpoint was hardened
# against. The invalid-credentials test above only exercises the unknown-email
# branch, so on its own it would still pass against the vulnerable version.
def test_set_new_password_rejects_reset_for_user_who_requested_none(flask_app_mock, client):
    """The original attack: a real account, no code ever requested, password replaced anyway."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            assert user.reset_code is None

            response = client.put(
                "/api/password",
                json={"email": user.email, "password": "attacker_password", "code": "000000"}
            )

            assert response.status_code == 400
            assert response.get_json()['success'] is False

            reloaded_user = get_user_by_email(user.email)
            assert check_password_hash(reloaded_user.password, "password123")
            assert not check_password_hash(reloaded_user.password, "attacker_password")

        finally:
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_set_new_password_rejects_wrong_code(flask_app_mock, client):
    """A code is outstanding, but the one supplied does not match it."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            set_reset_code(
                user.user_id,
                generate_password_hash("realcode"),
                datetime.now(timezone.utc) + timedelta(minutes=15)
            )

            response = client.put(
                "/api/password",
                json={"email": user.email, "password": "attacker_password", "code": "wrongcode"}
            )

            assert response.status_code == 400
            assert response.get_json()['success'] is False

            reloaded_user = get_user_by_email(user.email)
            assert check_password_hash(reloaded_user.password, "password123")

            # A failed attempt must not burn the real code.
            assert reloaded_user.reset_code is not None

        finally:
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_set_new_password_rejects_expired_code(flask_app_mock, client):
    """The right code, offered after its lifetime has run out."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            set_reset_code(
                user.user_id,
                generate_password_hash("realcode"),
                datetime.now(timezone.utc) - timedelta(minutes=1)
            )

            response = client.put(
                "/api/password",
                json={"email": user.email, "password": "attacker_password", "code": "realcode"}
            )

            assert response.status_code == 400
            assert response.get_json()['success'] is False

            reloaded_user = get_user_by_email(user.email)
            assert check_password_hash(reloaded_user.password, "password123")

        finally:
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_set_new_password_invalidates_existing_sessions(flask_app_mock, auth_header, client):
    """A reset locks out whoever was already holding a session for the account."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            login_response = client.post(
                "/api/login",
                json={"email": user.email, "password": "password123"}
            )
            stolen_token = login_response.get_json()["headers"]["access_token"]

            # The session works before the reset.
            assert client.put(
                "/api/password/change",
                json={"password": "some_other_password"},
                headers=auth_header(stolen_token)
            ).status_code == 201

            set_reset_code(
                user.user_id,
                generate_password_hash("realcode"),
                datetime.now(timezone.utc) + timedelta(minutes=15)
            )

            assert client.put(
                "/api/password",
                json={"email": user.email, "password": "recovered_password", "code": "realcode"}
            ).status_code == 201

            # And is refused afterwards.
            response = client.put(
                "/api/password/change",
                json={"password": "attacker_password"},
                headers=auth_header(stolen_token)
            )

            assert response.status_code != 201
            assert response.get_json().get('success') is not True

            reloaded_user = get_user_by_email(user.email)
            assert check_password_hash(reloaded_user.password, "recovered_password")

        finally:
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_change_password_returns_usable_replacement_tokens(flask_app_mock, auth_header, client):
    """Changing a password invalidates the caller's own pair, so a fresh one comes back."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            login_response = client.post(
                "/api/login",
                json={"email": user.email, "password": "password123"}
            )
            original_token = login_response.get_json()["headers"]["access_token"]

            change_response = client.put(
                "/api/password/change",
                json={"password": "newpassword456"},
                headers=auth_header(original_token)
            )

            assert change_response.status_code == 201

            replacement_token = change_response.get_json()["headers"]["access_token"]
            assert replacement_token

            # The replacement is accepted.
            assert client.put(
                "/api/password/change",
                json={"password": "newpassword789"},
                headers=auth_header(replacement_token)
            ).status_code == 201

        finally:
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_check_reset_code_rejects_expired_code(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            set_reset_code(
                user.user_id,
                generate_password_hash("realcode"),
                datetime.now(timezone.utc) - timedelta(minutes=1)
            )

            response = client.post(
                f"/api/reset_code?email={user.email}&code=realcode"
            )

            assert response.status_code == 400
            assert response.get_json()['success'] is False

        finally:
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_change_password(flask_app_mock, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            login_response = client.post(
                "/api/login",
                json={"email": user.email, "password": "password123"}
            )
            access_token = login_response.get_json()["headers"]["access_token"]

            response = client.put(
                "/api/password/change",
                json={"password": "newpassword456"},
                headers=auth_header(access_token)
            )

            assert response.status_code == 201

            data = response.get_json()
            msg = data["content"]["password"][0]
            assert f"Successfully set new password for user {user.user_id}" in msg

            reloaded_user = get_user_by_email(user.email)
            assert check_password_hash(reloaded_user.password, "newpassword456")

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_change_password_missing_credentials(flask_app_mock, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            login_response = client.post(
                "/api/login",
                json={"email": user.email, "password": "password123"}
            )
            access_token = login_response.get_json()["headers"]["access_token"]

            response = client.put(
                "/api/password/change",
                json={"password": None},
                headers=auth_header(access_token)
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


def test_change_password_missing_token(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        response = client.put(
            "/api/password/change",
            json={"password": "newpassword456"}
        )

        assert response.status_code == 401
        data = response.get_json()
        assert data.get('success') is not True


def test_change_password_invalid_token(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        response = client.put(
            "/api/password/change",
            json={"password": "newpassword456"},
            headers={"Authorization": "Bearer not-a-real-token"}
        )

        assert response.status_code == 422
        data = response.get_json()
        assert data.get('success') is not True


def test_send_reset_code(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            response = client.get(
                f"/api/reset_code?email={user.email}"
            )

            assert response.status_code == 201

            data = response.get_json()
            msg = data["content"]["reset_code"][0]
            assert msg == "Successfully sent reset code!"
        
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
            set_reset_code(user.user_id, hash, datetime.now(timezone.utc) + timedelta(minutes=15))

            response = client.post(
                f"/api/reset_code?email={user.email}&code=password?123"
            )

            assert response.status_code == 200

            data = response.get_json()
            msg = data["content"]["reset_code"][0]
            assert msg == "Successfully validated reset code!"
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_check_reset_code_after_code_already_cleared(flask_app_mock, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            # reset_code is None here, as it is for any user who hasn't requested a
            # reset code yet, or one who already consumed theirs via a successful
            # password change (see set_new_password, which clears it after use).

            response = client.post(
                f"/api/reset_code?email={user.email}&code=password?123"
            )

            assert response.status_code == 400

            data = response.get_json()
            assert data['success'] == False
            assert "An error occurred: Invalid Credentials" in data["message"]

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
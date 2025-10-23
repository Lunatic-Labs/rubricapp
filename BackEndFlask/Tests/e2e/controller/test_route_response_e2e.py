import pytest
import json
from flask_jwt_extended import create_access_token

@pytest.fixture
def client(flask_app_mock):
    """Flask test client with JWT obtained from test user."""
    app = flask_app_mock
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = 'test-secret'

    with app.app_context():
        # Ensure test user exists
        from models.user import get_user_by_email, User
        from werkzeug.security import generate_password_hash
        test_email = "testuser@example.com"
        test_password = "testpassword"
        if not get_user_by_email(test_email):
            user = User(
                email=test_email,
                password=generate_password_hash(test_password),
                first_name="Test",
                last_name="User",
                is_admin=False,
                has_set_password=True
            )
            app.db.session.add(user)
            app.db.session.commit()
            user_id = user.user_id
        else:
            user_id = get_user_by_email(test_email).user_id

        # Create JWT manually
        token = create_access_token(identity=user_id)

        with app.test_client() as client:
            client.environ_base['HTTP_AUTHORIZATION'] = f'Bearer {token}'
            yield client



def test_create_response_e2e(client):
    resp = client.get("/api/course?user_id=42")  # adjust user_id to match test user
    json_data = resp.get_json()

    assert resp.status_code == 200
    assert json_data["success"] is True
    assert "courses" in json_data["content"]
    assert isinstance(json_data["content"]["courses"], list)


def test_create_bad_response_e2e(client):
    resp = client.get("/api/course?course_id=9999&user_id=42")
    json_data = resp.get_json()

    assert resp.status_code == 400
    assert json_data["success"] is False
    assert "An error occurred" in json_data["message"]

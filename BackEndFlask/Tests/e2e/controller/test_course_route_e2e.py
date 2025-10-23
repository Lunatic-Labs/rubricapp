import pytest
from flask_jwt_extended import create_access_token
from integration.functions.PopulationFunctions import create_one_admin_ta_student_course, delete_one_admin_ta_student_course

@pytest.fixture
def client(flask_app_mock):
    """Flask test client with JWT from a populated test user + course."""
    app = flask_app_mock
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = 'test-secret'  # override for testing

    with app.app_context():  # ✅ Make sure DB/population is inside app context
        # Create population: teacher + student + course
        result = create_one_admin_ta_student_course(use_tas=True)
        test_user_id = result["user_id"]  # student user_id

        # Create JWT for the student
        token = create_access_token(identity=test_user_id)

        # Create test client
        with app.test_client() as client:
            client.environ_base['HTTP_AUTHORIZATION'] = f"Bearer {token}"
            yield client, result  # yield both client and populated data

        # Cleanup after test
        delete_one_admin_ta_student_course(result, use_tas=True)




def test_create_response_e2e(client):
    client, result = client
    user_id = result["user_id"]

    resp = client.get(f"/api/course?user_id={user_id}")  # use actual test user_id
    json_data = resp.get_json()

    assert resp.status_code == 200
    assert json_data["success"] is True
    assert "courses" in json_data["content"]
    assert isinstance(json_data["content"]["courses"], list)


def test_create_bad_response_e2e(client):
    client, result = client
    user_id = result["user_id"]

    resp = client.get(f"/api/course?course_id=9999&user_id={user_id}")
    json_data = resp.get_json()

    assert resp.status_code == 400
    assert json_data["success"] is False
    assert "An error occurred" in json_data["message"]

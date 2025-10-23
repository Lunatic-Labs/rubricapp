# Tests/integration/controller/test_route_response_integration.py
import pytest
from flask import Flask
from controller import Route_response


@pytest.fixture
def app():
    """Flask app for testing Route_response."""
    app = Flask(__name__)
    app.config['TESTING'] = True
    return app


@pytest.fixture
def client(app):
    """Flask test client (test routes that call Route_response)."""
    return app.test_client()


def test_create_good_response(app):
    """Integration test for create_good_response."""
    data = {"course_id": 101}

    # Simulate a request context (needed for request.args access)
    with app.test_request_context("/?user_id=42"):
        response, status = Route_response.create_good_response(data, 200, "course")

        assert status == 200
        assert response["success"] is True
        assert "course" in response["content"]
        assert response["content"]["course"][0] == data
        # Optional: check headers
        assert "Content-Type" in response["headers"]


def test_create_bad_response(app):
    """Integration test for create_bad_response."""
    with app.test_request_context("/?user_id=42"):
        response, status = Route_response.create_bad_response("Invalid ID", "course", 400)

        assert status == 400
        assert response["success"] is False
        assert "Invalid ID" in response["message"]
        assert "course" in response["content"]
        # Optional: check headers
        assert "Content-Type" in response["headers"]


def test_route_response_called_from_route(app, client):
    """
    test a Flask route that internally calls Route_response.
    This assumes you have a route like /api/test that calls create_good_response.
    """
    # Example: define a temporary test route
    @app.route("/api/test")
    def test_route():
        data = {"item": "test"}
        resp, status = Route_response.create_good_response(data, 200, "item")
        return resp, status

    response = client.get("/api/test")
    json_data = response.get_json()

    assert response.status_code == 200
    assert json_data["success"] is True
    assert "item" in json_data["content"]
    assert json_data["content"]["item"][0] == {"item": "test"}

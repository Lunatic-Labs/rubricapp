"""
This file essentially creates the app in a test-like environment
for all test cases. This allows for all test cases to reuse this code
so that this portion of a test is not repeated throughout every single
test case.
"""

import pytest
from app import create_app
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from app import Library


@pytest.fixture()
def test_client():
    flask_app = create_app()
    db = SQLAlchemy()
    login_manager = LoginManager()
    login_manager.login_view = "users.login"
    files_dir = "."
    register = Library()
    def initialize_extensions(flask_app):
        bootstrap = Bootstrap(flask_app)
        db.init_app(flask_app)
        login_manager.init_app(flask_app)
    # Create a test client using the Flask application configured for testing
    with flask_app.test_client() as testing_client:
        yield testing_client # this is where the testing happens

"""
This might be a method for implementing authetication... Look at later

class AuthActions(object):
    def __init__(self, client):
        self._client = client

    def login(self, username='test', password='test'):
        return self._client.post(
            '/auth/login',
            data={'username': username, 'password': password}
        )

    def logout(self):
        return self._client.get('/auth/logout')


@pytest.fixture
def auth(client):
    return AuthActions(client)
"""
"""
This file essentially creates the app in a test-like environment
for all test cases. This allows for all test cases to reuse this code
so that this portion of a test is not repeated throughout every single
test case.
"""

import pytest
from flask import Flask
from app import create_app
from flask_login import LoginManager, UserMixin
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from app import Library
from app import User
from app import db
from app import Permission


@pytest.fixture()
def test_client():
    flask_app = create_app()
    flask_app.testing = True

    db = SQLAlchemy()
    login_manager = LoginManager()
    login_manager.login_view = "users.login"
    files_dir = "."
    register = Library()

    # Create a test client using the Flask application configured for testing
    with flask_app.test_client() as testing_client:
        yield testing_client # this is where the testing happens
        
    def initialize_extensions(testing_client):
        bootstrap = Bootstrap(testing_client)
        db.init_app(testing_client)
        db.create_all()

    login_manager.init_app(testing_client)
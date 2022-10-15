import pytest

from app import create_app
from flask_login import LoginManager, UserMixin
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from app import Library
from app import User

@pytest.fixture()
def app():
    app = create_app()
    app.config.update ({
        "TESTING": True,
    })

    db = SQLAlchemy()
    login_manager = LoginManager()
    login_manager.login_view = "users.login"
    files_dir = "."
    register = Library()

    yield app

    def initialize_extensions(app):
        bootstrap = Bootstrap(app)
        db.init_app(app)
        login_manager.init_app(app)

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


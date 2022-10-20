import pytest

from app import create_app
from flask_login import LoginManager, UserMixin
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from app import Library
from app import User
import sys

@pytest.fixture()
def app():

    # if len(sys.argv) > 1:
    #     files_dir = sys.argv[1]
    # elif platform.node() in ['rubric.cs.uiowa.edu', 'rubric-dev.cs.uiowa.edu']:
    #     files_dir = "/var/www/wsgi-scripts/rubric"
    # else:
    #     print(
    #         "Requires argument: path to put files and database (suggestion is `pwd` when already in directory containing app.py)")
    #     sys.exit(1)

    app = create_app()

    db = SQLAlchemy()
    login_manager = LoginManager()
    login_manager.login_view = "users.login"
    files_dir = "."
    register = Library()

    app.config.update ({
        'TESTING': True,
        'DATABASE': files_dir,
        'LOGIN_DISABLED': True,
    })

    # bootstrap = Bootstrap(app)
    # db.init_app(app)
    # login_manager.init_app(app)
    # with app.app_context():
    #     db.create_all(app)

    yield app
    
    # initialize_extensions(app)

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


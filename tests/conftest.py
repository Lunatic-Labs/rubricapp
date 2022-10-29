import pytest
from flask import Flask
from app import *
from flask_login import LoginManager, UserMixin
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import FlaskLoginClient

@pytest.fixture()
def app():

    app = create_app()
    
    db = SQLAlchemy(app)
    login_manager = LoginManager()
    login_manager.login_view = "users.login"
    files_dir = "."
    register = Library()

    app.config.update ({
        'TESTING': True,
    })

    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(
            files_dir)
    db.init_app(app)


    with app.app_context():
        db.create_all()
        # app.test_client_class = FlaskLoginClient
        # user = User.query.get(1)
        

    yield app



@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

# @pytest.fixture(autouse=True)
# def set_up(request):
#     return {"user": user}

# @pytest.mark.fixture
# def app_ctx(app):
#     with app.app_context():
#         yield

# @pytest.mark.usefixtures("app_ctx")
# def test_user_model(app):
#     user = User()
#     db.session.add(user)
#     db.session.commit()

# @pytest.fixture()
# def user_login(app):
#     client = app.test_client()




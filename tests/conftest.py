import pytest
from flask import Flask
from app import *
from flask_login import LoginManager, UserMixin
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import FlaskLoginClient

@pytest.fixture()
def client():

    app = create_app()
    app.test_client_class = FlaskLoginClient
    app.config.update ({
        'TESTING': True
    })
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(
            files_dir)
    with app.app_context():
        db.create_all()
        user = load_user(1)
        with app.test_client(user=user) as client:
            yield client    
    
    # db = SQLAlchemy(app)
    # login_manager = LoginManager()
    # login_manager.login_view = "users.login"
    # files_dir = "."
    # register = Library()

    
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(
    #         files_dir)
    # db.init_app(app)


    # with app.app_context():
    #     db.create_all()
        





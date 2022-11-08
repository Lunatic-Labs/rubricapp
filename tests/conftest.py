"""
This file (conftest.py) creates the instance of a testing client.
"""

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
        user = load_user(2)
        current_user = user
        # project_profile('test@email.comtest@email.comTestfull', 'sucess')

        with app.test_client(user=user) as client:
            yield client

@pytest.fixture()
def choose_project(client):
    project_id = 'test@email.comtest@email.comTestfull'
    msg = 'success'
    project = Permission.query.filter_by(project_id=project_id).first()
        





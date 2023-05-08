"""
This file (conftest.py) creates the instance of a testing client.
"""
import sys
from os.path import dirname, abspath
d = dirname(dirname(dirname(abspath(__file__))))
sys.path.append(d)
from core import *
import pytest
from flask import Flask
from BackEndFlask.objects import load_user
from BackEndFlask.functions import *
from flask_login import LoginManager, UserMixin
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import FlaskLoginClient

@pytest.fixture()
def client():

    flask_app = app
    flask_app.test_client_class = FlaskLoginClient
    flask_app.config.update ({
        'TESTING': True,
        'LOGIN_DISABLED' : True
    })
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///account.db'
            
        
    with flask_app.app_context():
        db.create_all()
        user = load_user(2)
        # current_user = user
        # project_profile('test@email.comtest@email.comTestfull', 'sucess')

        with flask_app.test_client(user=user) as client:
            yield client

# @pytest.fixture()
# def choose_project(client):
#     project_id = 'test@email.comtest@email.comTestfull'
#     msg = 'success'
#     project = Permission.query.filter_by(project_id=project_id).first()
        





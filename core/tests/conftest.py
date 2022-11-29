"""
This file (conftest.py) creates the instance of a testing client.
"""
import sys
import pytest
from os.path import dirname, abspath
d = dirname(dirname(dirname(abspath(__file__))))
sys.path.append(d)
from flask import Flask
from core import *
from migrations import *
from objects import load_user
from functions import *
from flask_login import LoginManager, UserMixin
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import FlaskLoginClient

@pytest.fixture()
def client():
    # file_path = os.path.abspath(os.getcwd()) +"/core/account.db"

    app = create_app()
    app.test_client_class = FlaskLoginClient
    app.config.update ({
        'TESTING': True
    })
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///account.db'
        
    with app.app_context():
        db.create_all()
        user = load_user(2)
        # project_profile('test@email.comtest@email.comTestfull', 'sucess')

        with app.test_client(user=user) as client:
            yield client


"""
    Possible Solutions to make testing work:
    - Take a look at the os pathway to the database. There might be something that needs to be changed here.
    - Maybe more things need to be included?
    - Database pathway could be completely wrong. Look up the assert 404 problems instead??
    - Possbily change the order of some of the things in __init__.py
    - Possibly add things to _init__.py that were in the previous unmodularized environment 
"""
        





import pytest
from models.user import *
from models.schemas import *
from core import app, db
from flask import Flask
from models.role import *
from test_files.population_functions import *
import os
from sqlalchemy.orm.session import close_all_sessions

def deleteDB():
    accountDBPath = os.path.join(os.sep, "account.db")
    coreFile = os.getcwd() + os.path.join(os.sep, "core")
    instanceFile = os.getcwd() + os.path.join(os.sep, "instance")
    # If the instance directory exists, use that directory,
    # Else use the core directory.
    if os.path.exists(instanceFile):
        accountDBPath = instanceFile + accountDBPath
    else:
        accountDBPath = coreFile + accountDBPath
    # Attempts to rm account.db
    if os.path.exists(accountDBPath):
        try:
            os.system("rm " + accountDBPath)
        except:
            try:
                # Depending on the operating system,
                #   if the rm command fails,
                #   try the del command to remove the existing account.db
                os.system("del " + "\"" + accountDBPath + "\"")
            except:
                pass

@pytest.fixture
def flask_app_mock():
    """Flask application set up."""
    deleteDB()
    mock_app =  app
    mock_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///account_test.db'
    with mock_app.app_context():
        db.create_all()
        load_SuperAdminUser()
        load_existing_roles()
    yield mock_app
    with mock_app.app_context():
        db.session.close()
        engine_container = db.engine
        engine_container.dispose()
    close_all_sessions()
    deleteDB()


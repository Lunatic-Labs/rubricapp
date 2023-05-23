import pytest
import os
from sqlalchemy.orm.session import close_all_sessions
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

@pytest.fixture
def flask_app_mock():
    """Flask application set up."""
    mock_app = Flask(__name__)
    mock_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    mock_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///account_test.db'
    mock_app.config['JSON_SORT_KEYS'] = False
    db = SQLAlchemy()
    db.init_app(mock_app)
    with mock_app.app_context():
        db.create_all()
    yield mock_app
    with mock_app.app_context():
        db.session.close()
        engine_container = db.engine
        engine_container.dispose()
    close_all_sessions()
    accountDBPath = os.path.join(os.sep, "account.db")
    coreFile = os.getcwd() + os.path.join(os.sep, "core")
    instanceFile = os.getcwd() + os.path.join(os.sep, "instance")
    if os.path.exists(instanceFile): # Locate instance folder, else locate core folder
        accountDBPath = instanceFile + accountDBPath
    else:
        accountDBPath = coreFile + accountDBPath
    if os.path.exists(accountDBPath): # tries to rm account.db
        try:
            os.system("rm " + accountDBPath)
        except:
            try:
                os.system("del " + "\"" + accountDBPath + "\"") # if rm fails, try del account.db
            except:
                pass
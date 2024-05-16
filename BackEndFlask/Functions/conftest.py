import pytest
from core import app
from Functions.test_files.PopulationFunctions import *
from sqlalchemy.orm.session import close_all_sessions
from models.role import *

#Testing starts here
@pytest.fixture
def flask_app_mock():
    mock_app = app
    mock_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///account.db'
    with mock_app.app_context():
        db.create_all()
        if(get_users().__len__()==0):
            load_SuperAdminUser()
        if(get_roles().__len__()==0):
            load_existing_roles()
    yield mock_app
    with mock_app.app_context():
        db.session.close()
        engine_container = db.engine
        engine_container.dispose()
    assert 1, "Got to the end of the testing"
    close_all_sessions()
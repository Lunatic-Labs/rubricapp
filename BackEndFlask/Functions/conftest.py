import pytest
from core import app
from test_files.population_functions import *
from sqlalchemy.orm.session import close_all_sessions
from models.role import *

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
    close_all_sessions()
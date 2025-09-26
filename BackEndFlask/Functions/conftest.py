import pytest
import os
import pymysql
from core import app
from Functions.test_files.PopulationFunctions import *
from sqlalchemy.orm.session import close_all_sessions
from models.role import *
from sqlalchemy import create_engine, text

@pytest.fixture
def flask_app_mock():
    import uuid
    
    mock_app = app

    MYSQL_HOST=os.getenv('MYSQL_HOST')

    MYSQL_USER="root"

    MYSQL_PASSWORD="rootpassword"

    # Create unique database name for each test run to ensure isolation
    unique_id = uuid.uuid4().hex[:8]
    MYSQL_DATABASE=f"TestDB_{unique_id}"

    # Create engine without specifying a database
    base_uri = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}"
    engine = create_engine(base_uri)

    # Create the test database
    with engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DATABASE}`"))

    # Configure Flask app to use the test database
    db_uri = f"{base_uri}/{MYSQL_DATABASE}"
    mock_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri

    with mock_app.app_context():
        db.create_all()
        if(get_users().__len__()==0):
            load_SuperAdminUser()
        if(get_roles().__len__()==0):
            load_existing_roles()
    mock_app.db = db
    yield mock_app

    # Clean up: Drop the test database
    try:
        with engine.connect() as conn:
            conn.execute(text(f"DROP DATABASE IF EXISTS `{MYSQL_DATABASE}`"))
    except Exception as e:
        print(f"Warning: Could not drop test database {MYSQL_DATABASE}: {e}")

    try:
        with app.app_context():
            db.session.close()
            db.engine.dispose()
        close_all_sessions()
    except Exception as e:
        print(f"Warning: Could not clean up database connections: {e}")
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
    mock_app = app

    MYSQL_HOST=os.getenv('MYSQL_HOST')

    MYSQL_USER="root"

    MYSQL_PASSWORD="rootpassword"

    MYSQL_DATABASE="TestDB"

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

    # Drop the test database
    with engine.connect() as conn:
        conn.execute(text(f"DROP DATABASE IF EXISTS `{MYSQL_DATABASE}`"))

    with app.app_context():
        db.session.close()
        db.engine.dispose()
    close_all_sessions()
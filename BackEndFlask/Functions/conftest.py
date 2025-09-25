import pytest
from urllib.parse import quote_plus
from core import app, db
from Functions.test_files.PopulationFunctions import *
from sqlalchemy.orm.session import close_all_sessions
from models.role import *
from sqlalchemy import create_engine, text
from core import config
from dotenv import load_dotenv
import os

load_dotenv()  

@pytest.fixture
def flask_app_mock():
    mock_app = app

    # Disable email sending in tests
    config.rubricapp_running_locally = True
  
    MYSQL_PASSWORD_ENC = quote_plus(os.getenv('MYSQL_PASSWORD'))
    base_uri = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{MYSQL_PASSWORD_ENC}@{os.getenv('MYSQL_HOST')}"
    engine = create_engine(base_uri)

    # Create database safely
    with engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{os.getenv('MYSQL_DATABASE')}`"))

    # Configure Flask app to use the test database
    db_uri = f"{base_uri}/{os.getenv('MYSQL_DATABASE')}"
    mock_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri

    with mock_app.app_context():
        db.create_all()
        if len(get_users()) == 0:
            load_SuperAdminUser()
        if len(get_roles()) == 0:
            load_existing_roles()

    mock_app.db = db
    yield mock_app

    # Drop the database after test
    with engine.connect() as conn:
        conn.execute(text(f"DROP DATABASE IF EXISTS `{os.getenv('MYSQL_DATABASE')}`"))

    with app.app_context():
        db.session.close()
        db.engine.dispose()
    close_all_sessions()

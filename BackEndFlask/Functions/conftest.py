import pytest
from urllib.parse import quote_plus
from core import app, db
from Functions.test_files.PopulationFunctions import *
from sqlalchemy.orm.session import close_all_sessions
from models.role import *
from sqlalchemy import create_engine, text

@pytest.fixture
def flask_app_mock():
    mock_app = app

    MYSQL_HOST = "localhost"
    MYSQL_USER = "rubricapp_test"  
    MYSQL_PASSWORD = 'TestPass123!'
    MYSQL_DATABASE = "TestDB"

    MYSQL_PASSWORD_ENC = quote_plus(MYSQL_PASSWORD)
    base_uri = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD_ENC}@{MYSQL_HOST}"
    engine = create_engine(base_uri)

    # Create database safely
    with engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DATABASE}`"))

    # Configure Flask app to use the test database
    db_uri = f"{base_uri}/{MYSQL_DATABASE}"
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
        conn.execute(text(f"DROP DATABASE IF EXISTS `{MYSQL_DATABASE}`"))

    with app.app_context():
        db.session.close()
        db.engine.dispose()
    close_all_sessions()

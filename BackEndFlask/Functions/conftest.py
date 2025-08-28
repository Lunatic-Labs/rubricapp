import pytest
import os
import pymysql
from core import app
from Functions.test_files.PopulationFunctions import *
from sqlalchemy.orm.session import close_all_sessions
from models.role import *

@pytest.fixture
def flask_app_mock():
    mock_app = app

    MYSQL_HOST=os.getenv('MYSQL_HOST')

    MYSQL_USER="root"

    MYSQL_PASSWORD="rootpassword"

    MYSQL_DATABASE="TestDB"

    connection = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD
    )

    # Make temp db
    with connection.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE {MYSQL_DATABASE}")
    connection.commit()
    connection.close()

    db_uri = (f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DATABASE}")

    mock_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    with mock_app.app_context():
        db.create_all()
        if(get_users().__len__()==0):
            load_SuperAdminUser()
        if(get_roles().__len__()==0):
            load_existing_roles()
    mock_app.db = db
    yield mock_app

    connection = pymysql.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD
        )
    with connection.cursor() as cursor:
        cursor.execute(f"DROP DATABASE IF EXISTS `{MYSQL_DATABASE}`")
    connection.commit()
    connection.close()

    with mock_app.app_context():
        db.session.close()
        engine_container = db.engine
        engine_container.dispose()
    close_all_sessions()
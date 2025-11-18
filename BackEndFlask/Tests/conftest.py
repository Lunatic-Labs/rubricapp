import pytest
from urllib.parse import quote_plus
from core import app, db
from urllib.parse import quote_plus
from PopulationFunctions import *
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

    # Cleanup
    with app.app_context():
        # Remove session and rollback any pending transactions
        try:
            db.session.remove()
        except Exception as e:
            print(f"Session cleanup warning: {e}")
        
        # Dispose of engine connections
        try:
            db.engine.dispose()
        except Exception as e:
            print(f"Engine dispose warning: {e}")
    
    # Close all sessions safely
    try:
        close_all_sessions()
    except Exception as e:
        print(f"Close all sessions warning: {e}")
    
    # Drop the database after sessions are closed
    try:
        with engine.connect() as conn:
            conn.execute(text(f"DROP DATABASE IF EXISTS `{os.getenv('MYSQL_DATABASE')}`"))
    except Exception as e:
        print(f"Database drop warning: {e}")
    
    # Dispose of the temporary engine
    try:
        engine.dispose()
    except Exception as e:
        print(f"Temp engine dispose warning: {e}")

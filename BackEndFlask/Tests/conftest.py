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
from flask_jwt_extended import create_access_token
from models.user import create_user, get_user, get_users
from integration.integration_helpers import sample_user
import os

load_dotenv()  
# Disable email sending in tests
config.rubricapp_running_locally = True


@pytest.fixture
def flask_app_mock():
    mock_app = app
  
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


@pytest.fixture
def client(flask_app_mock):
    """Create a test client for making HTTP requests"""
    return flask_app_mock.test_client()

@pytest.fixture
def sample_token(flask_app_mock):
    """Factory to generate JWT tokens for different test users"""
    def _create_token(email=None, user_id=None, is_admin=None):
        with flask_app_mock.app_context():
            if user_id:
                user = get_user(user_id)
            elif email:
                user = get_users_by_email(email)
            else:
                user = get_users()[0]
            
            # Create token ONCE with all claims
            token = create_access_token(
                identity=str(user.user_id),  # Convert to string
                additional_claims={
                    "user_id": user.user_id,  # Add this - AuthCheck needs it
                    "is_admin": is_admin if is_admin is not None else user.is_admin
                }
            )
            return token
    
    return _create_token


@pytest.fixture
def auth_header():
    """Helper function to create auth headers"""
    def _auth_header(token):
        return {"Authorization": f"Bearer {token}"}
    return _auth_header

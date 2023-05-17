from uuid import uuid4
import pytest

from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base


from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from models.user import *
from models.schemas import *
from core import app

@pytest.fixture
def flask_app_mock():
    """Flask application set up."""
    # engine = create_engine('sqlite:///instance/account.db')
    # _SessionFactory = sessionmaker(bind=engine)
    # Base = declarative_base()
    # Base.metadata.create_all(engine)
    # meta = MetaData()

    mock_app = app
    mock_app.config.from_mapping({"SQLALCHEMY_DATABASE_URI": "sqlite:///../instance/account_test.db"})
    
    # app_mock = Flask(__name__)
    # app_mock.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/testaccount.db'
    # testdb = SQLAlchemy(app_mock)
    # testdb.init_app(app_mock)
    return mock_app

@pytest.fixture
def mock_get_sqlachemy(mocker):
    mock = mocker.patch("flask_sqlalchemy._QueryProperty.__get__").return_value = mocker.Mock()
    return mock
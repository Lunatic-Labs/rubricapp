from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime
from sqlalchemy.exc import IntegrityError

import pytest
import os
from models.user import *
from models.schemas import *
from models.role import load_existing_roles
from studentImport import studentcsvToDB



"""
Ensures studentcsvToDB can read in a csv file and update the Users table accordingly
or appropriately handles errors when encountered

Database class is derives from models/tests.py - am using as cleaning up table when testing is finished.
"""


def test_onetest(flask_app_mock):
    with flask_app_mock.app_context():
        db.create_all()
        load_existing_roles()
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "Valid.csv")
        studentcsvToDB(dir)
        one_student = get_user(1)
        # one_student = Users.query.filter_by(user_id=1).first()
        fname = one_student.fname
        # one_student = Users.query.all()

        print()
        print("------------BEGIN--------------")
        print(fname)
        print("------------END--------------")
        print()
        
    assert one_student






























# @pytest.fixture(scope="module")
# def db_session():
    
#     engine = sqlalchemy.create_engine('sqlite:///instance/account.db')
#     Base.metadata.create_all(engine)
#     session = Session()
#     yield session
#     session.rollback()
#     session.close()

def multiply(a, b):
    return a * b


def divide(a, b):
    return a * 1.0 / b

def multiply_by_two(x):
    return multiply(x, 2)


def divide_by_two(x):
    return divide(x, 2)


@pytest.fixture
def numbers():
    a = 10
    b = 20
    return [a,b]


class TestApp:
    def test_multiplication(self, numbers):
        res = multiply_by_two(numbers[0])
        assert res == numbers[1]

    def test_division(self, numbers):
        res = divide_by_two(numbers[1])
        assert res == numbers[0]

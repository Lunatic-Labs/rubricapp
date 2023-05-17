from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime
from sqlalchemy.exc import IntegrityError

import pytest
from studentImport import studentcsvToDB



"""
Ensures studentcsvToDB can read in a csv file and update the Users table accordingly
or appropriately handles errors when encountered

Database class is derives from models/tests.py - am using as cleaning up table when testing is finished.
"""


@pytest.fixture(scope="module")
def db_session():
    
    engine = sqlalchemy.create_engine('sqlite:///instance/account.db')
    Base.metadata.create_all(engine)
    session = Session()
    yield session
    session.rollback()
    session.close()

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

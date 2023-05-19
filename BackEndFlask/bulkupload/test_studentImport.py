import os
from models.user import *
from models.schemas import *
from studentImport import *

"""
Ensures studentcsvToDB can read in a csv file and update the Users table accordingly
or appropriately handles errors when encountered

Database class is derives from models/tests.py - am using as cleaning up table when testing is finished.
"""


def test_valid(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "Valid.csv")
        studentcsvToDB(dir)
        first_student = get_user(1)
        last_student = get_user(21)

        first_fname = first_student.first_name
        last_fname = last_student.first_name
    assert first_fname == 'Jeremy' and last_fname == 'Maxwell'

def test_WrongFormat(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "WrongFormat.csv")
        assert studentcsvToDB(dir) == "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."

def test_WrongFileType(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "WrongFileType.pdf")
        assert studentcsvToDB(dir) == "Wrong filetype submitted! Please submit a .csv file."

def test_WrongFileTypeExcel(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "ExcelFile.xlsx")
        assert studentcsvToDB(dir) == "Wrong filetype submitted! Please submit a .csv file."

def test_TooManyColumns(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "TooManyCol.csv")
        assert studentcsvToDB(dir) == "File contains more the the 4 expected columns: \"lname, fname\", lms_id, email, owner_id"

def test_NotEnoughCol(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "NotEnoughCol.csv")
        assert studentcsvToDB(dir) == "File has less than the 4 expected columns: \"lname, fname\", lms_id, email, owner_id"

def test_FileNotFound(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "NonExistentFile.csv")
        assert studentcsvToDB(dir) == "File not found or does not exist!"
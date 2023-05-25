import os
from models.user import *
from models.schemas import *
from studentImport import *

"""
Ensures studentcsvToDB can read in a csv file and update the Users table accordingly
or appropriately handles errors when encountered

Database class is derives from models/tests.py - am using as cleaning up table when testing is finished.
"""


def test_valid_first_student_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "Valid.csv")
        studentcsvToDB(dir, 1)
        first_student = get_user(1)
        first_fname = first_student.first_name
    assert first_fname == 'Jeremy' 

def test_valid_last_student_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "Valid.csv")
        studentcsvToDB(dir, 1)
        last_student = get_user(21)
        last_fname = last_student.first_name
    assert last_fname == 'Maxwell'

def test_first_user_course_recorded(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "Valid.csv")
        studentcsvToDB(dir, 1) 
        record1 = get_user_course(1)
        expectedStudent1 = Users.query.filter(Users.first_name=='Jeremy').first()
    assert record1.user_id==expectedStudent1.user_id 

def test_first_user_course_recorded(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "Valid.csv")
        studentcsvToDB(dir, 1) 
        record2 = get_user_course(21)
        expectedStudent2 = Users.query.filter(Users.first_name=='Maxwell').first()
    assert record2.user_id==expectedStudent2.user_id
    

def test_WrongFormat(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "WrongFormat.csv")
        assert studentcsvToDB(dir, 1) == "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."

def test_WrongFileType(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "WrongFileType.pdf")
        assert studentcsvToDB(dir, 1) == "Wrong filetype submitted! Please submit a .csv file."

def test_WrongFileTypeExcel(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "ExcelFile.xlsx")
        assert studentcsvToDB(dir, 1) == "Wrong filetype submitted! Please submit a .csv file."

def test_TooManyColumns(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "TooManyCol.csv")
        assert studentcsvToDB(dir, 1) == "File contains more the the 4 expected columns: \"lname, fname\", lms_id, email, owner_id"

def test_NotEnoughCol(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "NotEnoughCol.csv")
        assert studentcsvToDB(dir, 1) == "File has less than the 4 expected columns: \"lname, fname\", lms_id, email, owner_id"

def test_FileNotFound(flask_app_mock):
    with flask_app_mock.app_context():
        dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "NonExistentFile.csv")
        assert studentcsvToDB(dir, 1) == "File not found or does not exist!"
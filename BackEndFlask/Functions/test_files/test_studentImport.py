import os
import pytest
from models.user import *
from models.course import *
from models.schemas import *
from studentImport import *
from population_functions import create_testcourse

"""
    Ensures studentcsvToDB() can
        - read in a csv file and update the Users table accordingly
        - appropriately handles errors when encountered
"""

def retrieveFilePath(fileName):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, fileName)

"""
test_valid_first_student_in_table()
    - calls create_testcourse() with one parameter:
        - the test course does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retrieved file path to the Valid.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that the first name of the retrieved user with the id of 2 is Jeremy
"""
def test_valid_first_student_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        studentcsvToDB(retrieveFilePath("Valid.csv"), 1, 1)
        assert get_user_first_name(2) == 'Jeremy'

"""
test_valid_last_student_in_table()
    - calls create_testcourse() with one parameter:
        - the test course does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retieved file path to the Valid.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    asserts that the first name of the retrieved user with the id of 22 is Maxwell
"""
def test_valid_last_student_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        studentcsvToDB(retrieveFilePath("Valid.csv"), 1, 1)
        assert get_user_first_name(22) == 'Maxwell'

"""
test_first_user_course_recorded()
    - stores the file path to the Valid.csv file
    - calls studentcsvToDB() with three paremeters:
        - the retrieved file path to the Valid.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that the retrieved user_course id of 1 contains the user_id of the first
        user added who has the first name of Jeremy
"""
def test_first_user_course_recorded(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        studentcsvToDB(retrieveFilePath("Valid.csv"), 1, 1) 
        assert get_user_course_user_id(1) == get_user_user_id_by_first_name('Jeremy')

"""
test_last_user_course_recorded()
    - calls studentcsvToDB() with three parameters:
        - the retrieved file path to the Valid.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that the retrieved user_course id of 21 contains the user_id of the last
        user added who has the first name of Maxwell
"""
def test_last_user_course_recorded(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        studentcsvToDB(retrieveFilePath("Valid.csv"), 1, 1) 
        assert get_user_course_user_id(21) == get_user_user_id_by_first_name('Maxwell')

"""
test_student_exists_added_to_course_and_not_created_again()
    - creates a test course that does not use TAs
    - creates a test user
    - calls studentcsvToDB() with three paremeters:
        - the retrieved file path to the Valid.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that there is only one user in the Users table with the email of
        jcallison1@lipscomb.mail.edu and the user with that email is enrolled
        once in the course!
"""
def test_student_exists_added_to_course_and_not_created_again(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        create_user({
            "first_name": "Jeremy",
            "last_name": "Allison",
            "email": "jcallison1@lipscomb.mail.edu",
            "password": "Skillbuilder",
            "role_id": 5,
            "lms_id": 50717,
            "consent": None,
            "owner_id": 1            
        })
        studentcsvToDB(retrieveFilePath("Valid.csv"), 1, 1) 
        assert get_users_by_email('jcallison1@lipscomb.mail.edu').__len__()==1
        assert get_user_courses_by_user_id_and_course_id(get_user_user_id_by_email('jcallison1@lipscomb.mail.edu'), 1).__len__() == 1

"""
test_students_imported_via_separate_files_all_in_coures()
    - stores the file path to the Valid2.csv file
    - creates a test course that does not use TAs (False)
    - calls studentcsvToDB() with three paremeters:
        - the retrieved file path to the Valid.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - calls studentcsvToDB() again with three paremeters:
        - the file path to the Valid2.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that there are only 25 students enrolled in the course_id of 1
"""
def test_students_imported_via_separate_files_all_in_course(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        studentcsvToDB(retrieveFilePath("Valid.csv"), 1, 1)
        studentcsvToDB(retrieveFilePath("Valid2.csv"), 1, 1)
        assert get_user_courses_by_course_id(1).__len__() == 25

"""
test_invalid_inserts_no_students_in_table()
    - creates a test course that does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retrieved file path to the Invalid.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that no users with the role_id of 5 (aka Student) exist in the Users table
        and that no students are enrolled in a course in the UserCourse table
"""
def test_invalid_inserts_no_students_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)  
        studentcsvToDB(retrieveFilePath("Invalid.csv"), 1, 1)
        assert get_users_by_role_id(5).__len__() == 0
        assert get_user_courses().__len__() == 0

"""
test_WrongFormat()
    - create a test course that does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retrieved file path to the WrongFormat.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that when calling studentcsvToDB(), an error message is returned
        because the specified file has the wrong format
"""
def test_WrongFormat(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        assert studentcsvToDB(retrieveFilePath("WrongFormat.csv"), 1, 1) == "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."

"""
test_WrongFileType()
    - creates a test course that does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the file path to the WrongFileType.pdf file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that when calling studentcsvToDB(), an error message is returned
        because the specified file has the wrong extension
"""
def test_WrongFileType(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        assert studentcsvToDB(retrieveFilePath("WrongFileType.pdf"), 1, 1) == "Wrong filetype submitted! Please submit a .csv file."

"""
test_WrongFileTypeExcel()
    - creates a test course that does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retrieved file path to the ExcelFile.xlsx file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that when calling studentcsvToDB(), an error message is returned
        because the specified file has the wrong extension
"""
def test_WrongFileTypeExcel(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        assert studentcsvToDB(retrieveFilePath("ExcelFile.xlsx"), 1, 1) == "Wrong filetype submitted! Please submit a .csv file."

"""
test_TooManyColumns()
    - creates a test course that does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retrieved file path to the TooManyCol.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that when calling studentcsvToDB(), an error message is returned
        because the specified file has too many columns, expects the following 3 columns:
            - "last_name, first_name"
            - lms_id
            - email
"""
def test_TooManyColumns(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        assert studentcsvToDB(retrieveFilePath("TooManyCol.csv"), 1, 1) == "File contains more than the 3 expected columns: \"last_name, first_name\", lms_id, email"

"""
test_NotEnoughCol()
    - creates a test course that does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retireved file path to the NotEnoughCol.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that when calling studentcsvToDB(), an error message is returned
        because the specified file does not have enough columns
"""
def test_NotEnoughCol(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        assert studentcsvToDB(retrieveFilePath("NotEnoughCol.csv"), 1, 1) == "File has less than the 3 expected columns: \"last_name, first_name\", lms_id, email"

"""
test_FileNotFound()
    - creates a test course that does not use TAs (False)
    - calls studentcsvToDB() with three parameters:
        - the retrieved file path to the NonExistentFile.csv file
        - the test teacher id (owner_id) of 1
        - the test course_id of 1
    - asserts that when calling studentcsvToDB(), an error message is returned
        because the specified file does not exist
"""
def test_FileNotFound(flask_app_mock):
    with flask_app_mock.app_context():
        create_testcourse(False)
        assert studentcsvToDB(retrieveFilePath("NonExistentFile.csv"), 1, 1) == "File not found or does not exist!"
import os
from models.schemas import Users, UserCourse
from models.user import create_user, get_user
from models.user_course import get_user_course
from studentImport import studentcsvToDB
from population_functions import create_testcourse

"""
    Ensures studentcsvToDB can
        - read in a csv file and update the Users table accordingly
        - appropriately handles errors when encountered
"""

def test_valid_first_student_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "Valid.csv")
        create_testcourse(False)
        studentcsvToDB(studentcsv, owner_id, course_id)
        first_student = get_user(2)
        first_fname = first_student.first_name
    assert first_fname == 'Jeremy' 

def test_valid_last_student_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "Valid.csv")
        create_testcourse(False)
        studentcsvToDB(studentcsv, owner_id, course_id)
        last_student = get_user(22)
        last_fname = last_student.first_name
    assert last_fname == 'Maxwell'

def test_first_user_course_recorded(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "Valid.csv")
        create_testcourse(False)
        studentcsvToDB(studentcsv, owner_id, course_id) 
        record1 = get_user_course(1)
        expectedStudent1 = Users.query.filter(Users.first_name=='Jeremy').first()
    assert record1.user_id==expectedStudent1.user_id 

def test_last_user_course_recorded(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "Valid.csv")
        create_testcourse(False)
        studentcsvToDB(studentcsv, owner_id, course_id) 
        record2 = get_user_course(21)
        expectedStudent2 = Users.query.filter(Users.first_name=='Maxwell').first()
    assert record2.user_id==expectedStudent2.user_id

def test_student_exists_added_to_course_and_not_created_again(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "Valid.csv")
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
        studentcsvToDB(studentcsv, owner_id, course_id) 
        Jeremys = Users.query.filter(Users.email=="jcallison1@lipscomb.mail.edu").all()
        Jeremy = Users.query.filter(Users.email=="jcallison1@lipscomb.mail.edu").first()
        JeremyInCourse = UserCourse.query.filter(UserCourse.user_id==Jeremy.user_id and UserCourse.course_id==1).all()
    assert len(Jeremys)==1 and len(JeremyInCourse)==1

def test_students_imported_via_separate_files_all_in_course(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "Valid.csv")
        studentcsv2 = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, "Valid2.csv")
        create_testcourse(False)
        studentcsvToDB(studentcsv, owner_id, course_id)
        owner_id = 1
        course_id = 1
        studentcsvToDB(studentcsv2, owner_id, course_id)
        students = UserCourse.query.filter(UserCourse.course_id==1).all()
    assert len(students) == 25

def test_invalid_inserts_no_students_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "Invalid.csv")
        create_testcourse(False)  
        studentcsvToDB(studentcsv, owner_id, course_id)
        users = Users.query.filter(Users.role_id==5).all()
        usercourses = UserCourse.query.all()
    assert len(users)==0 and len(usercourses)==0

def test_WrongFormat(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "WrongFormat.csv")
        create_testcourse(False)
        assert studentcsvToDB(studentcsv, owner_id, course_id) == "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."

def test_WrongFileType(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "WrongFileType.pdf")
        create_testcourse(False)
        assert studentcsvToDB(studentcsv, owner_id, course_id) == "Wrong filetype submitted! Please submit a .csv file."

def test_WrongFileTypeExcel(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "ExcelFile.xlsx")
        create_testcourse(False)
        assert studentcsvToDB(studentcsv, owner_id, course_id) == "Wrong filetype submitted! Please submit a .csv file."

def test_TooManyColumns(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "TooManyCol.csv")
        create_testcourse(False)
        assert studentcsvToDB(studentcsv, owner_id, course_id) == "File contains more than the 3 expected columns: \"last_name, first_name\", lms_id, email"

def test_NotEnoughCol(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "NotEnoughCol.csv")
        create_testcourse(False)
        assert studentcsvToDB(studentcsv, owner_id, course_id) == "File contains less than the 3 expected columns: \"last_name, first_name\", lms_id, email"

def test_FileNotFound(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 1
        course_id = 1
        studentcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        studentcsv += os.path.join(os.path.sep, "NonExistentFile.csv")
        create_testcourse(False)
        assert studentcsvToDB(studentcsv, owner_id, course_id) == "File not found or does not exist!"
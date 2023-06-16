from Functions.customExceptions import *
from models.user_course import *
from studentImport import *
from population_functions import *
import os

def retrieveFilePath(fileName):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, fileName)

# test_valid_student_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the oneStudent.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the Upload Successful! message is returned
#       - assert the test student retrieved by email is returned
#       - assert the test student is enrolled in the test course
#       - unenroll the test student from the test course
#       - delete the test student, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test student from the test course
#       - deletes any test student, test teacher, and test course
def test_valid_student_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "oneStudent.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected success message!"
            assert message == "Upload Successful!", errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() did not correctly create the valid test student"
            assert user is not None, errorMessage
            user_id = get_user_user_id_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_user_id_by_email() encountered an unexpected error!"
            assert type(user_id) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user_id
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_valid_student_not_added_twice_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() twice with three parameters:
#           - the retrieved file path to the oneStudent.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert both times the Upload Successful! message is returned
#       - assert both times the test student retrieved by email is returned
#       - assert both times the test student is enrolled in the test course
#             ensuring that the test student is enrolled only once in the test course
#       - unenroll the test student from the test course
#       - delete the test student, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test student from the test course
#       - deletes any test student, test teacher, and test course
def test_valid_student_not_added_twice_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "oneStudent.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected success message!"
            assert message == "Upload Successful!", errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() did not correctly create the valid test student"
            assert user is not None, errorMessage
            user_id = get_user_user_id_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_user_id_by_email() encountered an unexpected error!"
            assert type(user_id) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user_id
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "oneStudent.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected success message!"
            assert message == "Upload Successful!", errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() did not correctly create the valid test student"
            assert user is not None, errorMessage
            user_id = get_user_user_id_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_user_id_by_email() encountered an unexpected error!"
            assert type(user_id) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user_id
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_wrong_file_extension()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the WrongFileType.pdf file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the WrongFileType error message is returned
#       - assert the test student retrieved by email is returned None
#       - assert the test student is not enrolled in the test course
#       - assert there are no students enrolled in the test course
#       - delete the test teacher, and test course
#     - if anything fails:
#       - unenrolles and deletes any test students in the test course
#       - deletes any test teacher, and test course
def test_wrong_file_extension(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "WrongFileType.pdf"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected error of WrongExtension"
            assert message == WrongExtension.error, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have created the invalid test student"
            assert user is None, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert get_user_courses_by_course_id(
                result["course_id"]
            ).__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_file_not_found()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the NonExistentFile.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the FileNotFound error message is returned
#       - assert the test student retrieved by email is returned None
#       - assert the test student is not enrolled in the test course
#       - assert there are no students enrolled in the test course
#       - delete the test teacher, and test course
#   - if anything fails:
#       - unenrolles and deletes any test students in the test course
#       - deletes any test teacher, and test course
def test_file_not_found(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "NonExistentFile.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected error of FileNotFound"
            assert message == FileNotFound.error, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have created the invalid test student"
            assert user is None, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert get_user_courses_by_course_id(
                result["course_id"]
            ).__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_too_many_columns()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the oneStudentTooManyColumns.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the TooManyColumns error message is returned
#       - assert the test student retrieved by email is returned None
#       - assert the test student is not enrolled in the test course
#       - assert there are no students enrolled in the test course
#       - delete the test teacher, and test course
#   - if anything fails:
#       - unenrolles and deletes any test students in the test course
#       - deletes any test teacher, and test course
def test_too_many_columns(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "oneStudentTooManyColumns.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected error of TooManyColumns"
            assert message == TooManyColumns.error, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have created the invalid test student"
            assert user is None, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert get_user_courses_by_course_id(
                result["course_id"]
            ).__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_not_enough_columns()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the oneStudentNotEnoughColumns.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the NotEnoughColumns error message is returned
#       - assert the test student retrieved by email is returned None
#       - assert the test student is not enrolled in the test course
#       - assert there are no students enrolled in the test course
#       - delete the test teacher, and test course
#   - if anything fails:
#       - unenrolles and deletes any test students in the test course
#       - deletes any test teacher, and test course
def test_not_enough_columns(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "oneStudentNotEnoughColumns.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected error of NotEnoughColumns"
            assert message == NotEnoughColumns.error, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have created the invalid test student"
            assert user is None, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert get_user_courses_by_course_id(
                result["course_id"]
            ).__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_suspected_misformatting_invalid_student_email()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the invalidStudent.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the SuspectedMisformatting error message is returned
#       - assert the invalid test student retrieved by email is returned None
#       - assert the invalid test student is not enrolled in the test course
#       - assrt there are no students enrolled in the test course
#       - delete the test teacher, and test course
#   - if anything fails:
#       - unenrolles and deletes any test students in the test course
#       - deletes any test teacher, and test course
def test_suspected_misformatting_invalid_student_email(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "invalidStudent.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected error of SuspectedMisformatting"
            assert message == SuspectedMisformatting.error, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have created the invalid test student"
            assert user is None, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert get_user_courses_by_course_id(
                result["course_id"]
            ).__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_suspected_misformatting_lms_id_not_a_number()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the invalidLMSID.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the SuspectedMisFormatting error message is returned
#       - assert the invalid test student retrieved by email is returned None
#       - assert the invalid test student is not enrolled in the test course
#       - assert there are no students enrolled in the test course
#       - delete the test teacher, and test course
#   - if anything fails:
#       - unenrolles and deletes any test students in the test course
#       - deletes any test teacher, and test course
def test_suspected_misformatting_lms_id_not_a_number(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "invalidLMSID.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected error of SuspectedMisformatting"
            assert message == SuspectedMisformatting.error, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have created the invalid test student"
            assert user is None, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert get_user_courses_by_course_id(
                result["course_id"]
            ).__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise

# test_suspected_misformatting_space_in_student_email()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call studentcsvToDB() with three parameters:
#           - the retrieved file path to the invalidStudentEmailWithSpace.csv file
#           - the id of the test teacher (owner_id)
#           - the id of the test course (course_id)
#       - assert the SuspectedMisFormatting error message is returned
#       - assert the invalid test student retrieved by email is returned None
#       - assert the invalid test student is not enrolled in the test course
#       - assert there are no students enrolled in the test course
#       - delete the test teacher, and test course
#   - if anything fails:
#       - unenrolles and deletes any test students in the test course
#       - deletes any test teacher, and test course
def test_suspected_misformatting_space_in_student_email(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            errorMessage = "createOneAdminCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            message = studentcsvToDB(
                retrieveFilePath(
                    "invalidStudentEmailWithSpace.csv"
                ),
                result["user_id"],
                result["course_id"]
            )
            errorMessage = "studentcsvToDB() did not return the expected error of SuspectedMisformatting"
            assert message == SuspectedMisformatting.error, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have created the invalid test student"
            assert user is None, errorMessage
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            errorMessage = "get_user_by_email() encountered an unexpected error!"
            assert type(user) is not type(""), errorMessage
            user_courses = get_user_courses_by_user_id(
                user
            )
            errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
            assert type(user_courses) is not type(""), errorMessage
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert get_user_courses_by_course_id(
                result["course_id"]
            ).__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
            raise
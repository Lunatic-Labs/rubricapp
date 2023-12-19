from Functions.customExceptions import *
from models.user_course import *
from studentImport import *
from population_functions import *
import os


def retrieveFilePath(fileName):
    return (
        os.getcwd()
        + os.path.join(os.path.sep, "Functions")
        + os.path.join(os.path.sep, "sample_files")
        + os.path.join(os.path.sep, fileName)
    )


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

            message = studentcsvToDB(
                retrieveFilePath("oneStudent.csv"),
                result["user_id"],
                result["course_id"],
            )
            errorMessage = (
                "studentcsvToDB() did not return the expected success message!"
            )
            assert message == "Upload Successful!", errorMessage

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = (
                "studentcsvToDB() did not correctly create the valid test student"
            )
            assert user is not None, errorMessage
            user_id = get_user_user_id_by_email("teststudent1@gmail.com")

            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "studentcsvToDB() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise e


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
            message = studentcsvToDB(
                retrieveFilePath("oneStudent.csv"),
                result["user_id"],
                result["course_id"],
            )
            errorMessage = (
                "studentcsvToDB() did not return the expected success message!"
            )
            assert message == "Upload Successful!", errorMessage
            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = (
                "studentcsvToDB() did not correctly create the valid test student"
            )
            assert user is not None, errorMessage

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")

            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "studentcsvToDB() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage

            message = studentcsvToDB(
                retrieveFilePath("oneStudent.csv"),
                result["user_id"],
                result["course_id"],
            )

            errorMessage = (
                "studentcsvToDB() did not return the expected success message!"
            )
            assert message == "Upload Successful!", errorMessage

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = (
                "studentcsvToDB() did not correctly create the valid test student"
            )
            assert user is not None, errorMessage

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")

            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "studentcsvToDB() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise e


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

            try:
                message = studentcsvToDB(
                    retrieveFilePath("WrongFileType.pdf"),
                    result["user_id"],
                    result["course_id"],
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, WrongExtension), f"Expected WrongExtension but got {e}"
            
            user = get_user_by_email("teststudent1@gmail.com")
                        
            errorMessage = (
                "studentcsvToDB() should not have created the invalid test student"
            )
            assert user is None, errorMessage
            
            user = get_user_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user)

            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage

            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert (
                get_user_courses_by_course_id(result["course_id"]).__len__() == 0
            ), errorMessage
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise e


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
            
            try:
                message = studentcsvToDB(
                    retrieveFilePath("NonExistentFile.csv"),
                    result["user_id"],
                    result["course_id"],
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, FileNotFoundError), f"Expected FileNotFound but got {e}"
                

            user = get_user_by_email("teststudent1@gmail.com")
            
            errorMessage = (
                "studentcsvToDB() should not have created the invalid test student"
            )
            assert user is None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user)
            
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert (
                get_user_courses_by_course_id(result["course_id"]).__len__() == 0
            ), errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise e


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

            try:
                message = studentcsvToDB(
                    retrieveFilePath("oneStudentTooManyColumns.csv"),
                    result["user_id"],
                    result["course_id"],
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, TooManyColumns), f"Expected TooManyColumns but got {e}"
            
            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = (
                "studentcsvToDB() should not have created the invalid test student"
            )
            assert user is None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user)

            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage

            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert (
                get_user_courses_by_course_id(result["course_id"]).__len__() == 0
            ), errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except Exception as e:
            
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
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
            try:
                message = studentcsvToDB(
                    retrieveFilePath("oneStudentNotEnoughColumns.csv"),
                    result["user_id"],
                    result["course_id"],
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, NotEnoughColumns), f"Expected NotEnoughColumns but got {e}"

            user = get_user_by_email("teststudent1@gmail.com")
            
            errorMessage = (
                "studentcsvToDB() should not have created the invalid test student"
            )
            assert user is None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user)
            
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage

            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert (
                get_user_courses_by_course_id(result["course_id"]).__len__() == 0
            ), errorMessage

            deleteAllUsersUserCourses(result["course_id"])              
            deleteOneAdminCourse(result)
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])              
            deleteOneAdminCourse(result)
            raise e


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

            try: 
                message = studentcsvToDB(
                    retrieveFilePath("invalidStudent.csv"),
                    result["user_id"],
                    result["course_id"],
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, SuspectedMisformatting), f"Expected SuspectedMisformatting but got {e}"

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = (
                "studentcsvToDB() should not have created the invalid test student"
            )
            assert user is None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user)
            
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage

            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert (
                get_user_courses_by_course_id(result["course_id"]).__len__() == 0
            ), errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise e


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

            try: 
                message = studentcsvToDB(
                    retrieveFilePath("invalidLMSID.csv"),
                    result["user_id"],
                    result["course_id"],
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, SuspectedMisformatting), f"Expected SuspectedMisformatting but got {e}"

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = (
                "studentcsvToDB() should not have created the invalid test student"
            )
            assert user is None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")
                        
            user_courses = get_user_courses_by_user_id(user)
            
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage

            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert (
                get_user_courses_by_course_id(result["course_id"]).__len__() == 0
            ), errorMessage

            
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise e


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
            try:
                message = studentcsvToDB(
                    retrieveFilePath("invalidStudentEmailWithSpace.csv"),
                    result["user_id"],
                    result["course_id"],
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, SuspectedMisformatting), f"Expected SuspectedMisformatting but got {e}"
            
            user = get_user_by_email("teststudent1@gmail.com")
            
            errorMessage = (
                "studentcsvToDB() should not have created the invalid test student"
            )
            assert user is None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user)
            
            errorMessage = "studentcsvToDB() should not have enrolled the invalid test student in the test course"
            assert user_courses.__len__() == 0, errorMessage
            
            errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
            assert (
                get_user_courses_by_course_id(result["course_id"]).__len__() == 0
            ), errorMessage
            
            
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except Exception as e:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise e

from Functions.customExceptions import *
from Functions.genericImport import *
from population_functions import *
import os


def retrieveFilePath(fileName):
    return os.getcwd () +  os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, fileName)

# test_valid_student_with_no_lms_id_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the oneStudentNoLMSID.csv file
#           - the id of the test teacher (user_id)
#           - the id of the test course (course_id)
#       - assert none type is returned. This means success!
#       - assert the test student retrieved by email is returned
#       - assert the test student is enrolled in the test course
#       - unenroll the test student from the test course
#       - delete the test student, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test student from the test course
#       - deletes any test student, test teacher, and test course
def test_valid_student_with_no_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            message = genericcsv_to_db(
                retrieveFilePath("oneStudentNoLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # genericcsv_to_db() returns none when successful

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test student"
            assert user is not None, errorMessage

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise

# test_valid_student_with_lms_id_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the oneStudentWithLMSID.csv file
#           - the id of the test teacher (user_id)
#           - the id of the test course (course_id)
#       - assert none type is returned. This means success!
#       - assert the test student retrieved by email is returned
#       - assert the test student has an lms_id
#       - assert the test student is enrolled in the test course
#       - unenroll the test student from the test course
#       - delete the test student, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test student from the test course
#       - deletes any test student, test teacher, and test course
def test_valid_student_with_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            message = genericcsv_to_db(
                retrieveFilePath("oneStudentWithLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )

            assert message is None, message # genericcsv_to_db() returns none when successful

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test student"
            assert user is not None, errorMessage

            errorMessage = "upload failed to assign lms_id attribute to student when expected."
            assert user.lms_id is not None, errorMessage

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
            deleteOneAdminCourse(result)

        except:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise

# test_valid_ta_with_no_lms_id_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (True)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the oneTANoLMSID.csv file
#           - the id of the test teacher (user_id)
#           - the id of the test course (course_id)
#       - assert none type is returned. This means success!
#       - assert the test TA retrieved by email is returned
#       - assert the test TA is enrolled in the test course
#       - unenroll the test TA from the test course
#       - delete the test TA, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test TA from the test course
#       - deletes any test TA, test teacher, and test course
def test_valid_ta_with_no_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(True)
            message = genericcsv_to_db(
                retrieveFilePath("oneTANoLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # genericcsv_to_db() returns none when successful
            user = get_user_by_email("testTA1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test TA"
            assert user is not None, errorMessage

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise

# test_valid_ta_with_lms_id_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (True)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the oneTAWithLMSID.csv file
#           - the id of the test teacher (user_id)
#           - the id of the test course (course_id)
#       - assert none type is returned. This means success!
#       - assert the test TA retrieved by email is returned
#       - assert the test TA has an lms_id
#       - assert the test TA is enrolled in the test course
#       - unenroll the test TA from the test course
#       - delete the test TA, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test TA from the test course
#       - deletes any test TA, test teacher, and test course
def test_valid_ta_with_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(True)
            message = genericcsv_to_db(
                retrieveFilePath("oneTAWithLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # genericcsv_to_db() returns none when successful

            user = get_user_by_email("testTA1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test TA"
            assert user is not None, errorMessage

            errorMessage = "upload failed to assign lms_id attribute to TA when expected."
            assert user.lms_id is not None, errorMessage

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise

# test_valid_student_and_ta_with_no_lms_id_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (True)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the StudentAndTANoLMSID.csv file
#           - the id of the test teacher (user_id)
#           - the id of the test course (course_id)
#       - assert none type is returned. This means success!
#       - assert the test TA retrieved by email is returned
#       - assert the test Student retrieved by email is returned
#       - assert the test TA is enrolled in the test course
#       - assert the test Student is enrolled in the test course
#       - unenrolls any test TA or Student from the test course
#       - deletes any test TA, Student, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test TA or Student from the test course
#       - deletes any test TA, Student, test teacher, and test course
def test_valid_student_and_ta_with_no_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(True)
            message = genericcsv_to_db(
                retrieveFilePath("StudentAndTANoLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # genericcsv_to_db() returns none when successful
            user = get_user_by_email("testTA1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test TA"
            assert user is not None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test student"
            assert user is not None, errorMessage

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, errorMessage

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise

# test_valid_student_and_ta_with_lms_id_in_table()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (True)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the StudentAndTAWithLMSID.csv file
#           - the id of the test teacher (user_id)
#           - the id of the test course (course_id)
#       - assert none type is returned. This means success!
#       - assert the test TA retrieved by email is returned
#       - assert the test TA has an lms_id
#       - assert the test Student retrieved by email is returned
#       - assert the test Student has an lms_id
#       - assert the test TA is enrolled in the test course
#       - assert the test Student is enrolled in the test course
#       - unenrolls any test TA or Student from the test course
#       - deletes any test TA, Student, test teacher, and test course
#   - if anything fails:
#       - unenrolls any test TA or Student from the test course
#       - deletes any test TA, Student, test teacher, and test course
def test_valid_students_and_tas_with__and_without_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(True)
            message = genericcsv_to_db(
                retrieveFilePath("StudentAndTAWithLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # genericcsv_to_db() returns none when successful
            user = get_user_by_email("testTA1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test TA"
            assert user is not None, errorMessage

            errorMessage = "upload failed to assign lms_id attribute to TA when expected."
            assert user.lms_id is not None, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")

            errorMessage = "genericcsv_to_db() did not correctly create the valid test student"
            assert user is not None, errorMessage

            errorMessage = "upload failed to assign lms_id attribute to student when expected."
            assert user.lms_id is not None, errorMessage                        

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, errorMessage

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            errorMessage = "genericcsv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, errorMessage

            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except:
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            raise

# test_file_not_found()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_DB() with three parameters:
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
# def test_file_not_found(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminCourse(False)
#             errorMessage = "createOneAdminCourse() encountered an unexpected error!"
#             assert type(result) is not type(""), errorMessage
#             message = genericcsv_to_db(
#                 retrieveFilePath(
#                     "NonExistentFile.csv"
#                 ),
#                 result["user_id"],
#                 result["course_id"]
#             )
#             errorMessage = "genericcsv_to_DB() did not return the expected error of FileNotFound"
#             assert message == FileNotFound.error, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_DB() should not have created the invalid test student"
#             assert user is None, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             user_courses = get_user_courses_by_user_id(
#                 user
#             )
#             errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
#             assert type(user_courses) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_DB() should not have enrolled the invalid test student in the test course"
#             assert user_courses.__len__() == 0, errorMessage
#             errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
#             assert get_user_courses_by_course_id(
#                 result["course_id"]
#             ).__len__() == 0, errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
#             assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#             raise

# test_wrong_file_extension()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
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
# def test_wrong_file_extension(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminCourse(False)
#             errorMessage = "createOneAdminCourse() encountered an unexpected error!"
#             assert type(result) is not type(""), errorMessage
#             message = genericcsv_to_db(
#                 retrieveFilePath(
#                     "WrongFileType.pdf"
#                 ),
#                 result["user_id"],
#                 result["course_id"]
#             )
#             errorMessage = "genericcsv_to_db() did not return the expected error of WrongExtension"
#             assert message == WrongExtension.error, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have created the invalid test student"
#             assert user is None, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             user_courses = get_user_courses_by_user_id(
#                 user
#             )
#             errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
#             assert type(user_courses) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have enrolled the invalid test student in the test course"
#             assert user_courses.__len__() == 0, errorMessage
#             errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
#             assert get_user_courses_by_course_id(
#                 result["course_id"]
#             ).__len__() == 0, errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
#             assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#             raise

# test_too_many_columns()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the tooManyColumns.csv file
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
# def test_too_many_columns(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminCourse(False)
#             errorMessage = "createOneAdminCourse() encountered an unexpected error!"
#             assert type(result) is not type(""), errorMessage
#             message = genericcsv_to_db(
#                 retrieveFilePath(
#                     "tooManyColumns.csv"
#                 ),
#                 result["user_id"],
#                 result["course_id"]
#             )
#             errorMessage = "genericcsv_to_db() did not return the expected error of TooManyColumns"
#             assert message == TooManyColumns.error, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have created the invalid test student"
#             assert user is None, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             user_courses = get_user_courses_by_user_id(
#                 user
#             )
#             errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
#             assert type(user_courses) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have enrolled the invalid test student in the test course"
#             assert user_courses.__len__() == 0, errorMessage
#             errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
#             assert get_user_courses_by_course_id(
#                 result["course_id"]
#             ).__len__() == 0, errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
#             assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#             raise

# test_not_enough_columns()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the notEnoughColumns.csv file
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
# def test_not_enough_columns(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminCourse(False)
#             errorMessage = "createOneAdminCourse() encountered an unexpected error!"
#             assert type(result) is not type(""), errorMessage
#             message = genericcsv_to_db(
#                 retrieveFilePath(
#                     "notEnoughColumns.csv"
#                 ),
#                 result["user_id"],
#                 result["course_id"]
#             )
#             errorMessage = "genericcsv_to_db() did not return the expected error of NotEnoughColumns"
#             assert message == NotEnoughColumns.error, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have created the invalid test student"
#             assert user is None, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             user_courses = get_user_courses_by_user_id(
#                 user
#             )
#             errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
#             assert type(user_courses) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have enrolled the invalid test student in the test course"
#             assert user_courses.__len__() == 0, errorMessage
#             errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
#             assert get_user_courses_by_course_id(
#                 result["course_id"]
#             ).__len__() == 0, errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
#             assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#             raise

# test_suspected_misformatting_invalid_student_email()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the invalidStudentEmail.csv file
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
# def test_suspected_misformatting_invalid_student_email(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminCourse(False)
#             errorMessage = "createOneAdminCourse() encountered an unexpected error!"
#             assert type(result) is not type(""), errorMessage
#             message = genericcsv_to_db(
#                 retrieveFilePath(
#                     "invalidStudentEmail.csv"
#                 ),
#                 result["user_id"],
#                 result["course_id"]
#             )
#             errorMessage = "genericcsv_to_db() did not return the expected error of SuspectedMisformatting"
#             assert message == SuspectedMisformatting.error, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have created the invalid test student"
#             assert user is None, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             user_courses = get_user_courses_by_user_id(
#                 user
#             )
#             errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
#             assert type(user_courses) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have enrolled the invalid test student in the test course"
#             assert user_courses.__len__() == 0, errorMessage
#             errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
#             assert get_user_courses_by_course_id(
#                 result["course_id"]
#             ).__len__() == 0, errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
#             assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#             raise

# test_suspected_misformatting_lms_id_not_a_number()
#   - calls createOneAdminCourse() with one parameter:
#       - whether the test course uses TAs (False)
#   - creates a test teacher and test course
#   - tries to:
#       - call genericcsv_to_db() with three parameters:
#           - the retrieved file path to the invalidStudentLMSID.csv file
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
# def test_suspected_misformatting_lms_id_not_a_number(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminCourse(False)
#             errorMessage = "createOneAdminCourse() encountered an unexpected error!"
#             assert type(result) is not type(""), errorMessage
#             message = genericcsv_to_db(
#                 retrieveFilePath(
#                     "invalidStudentLMSID.csv"
#                 ),
#                 result["user_id"],
#                 result["course_id"]
#             )
#             errorMessage = "genericcsv_to_db() did not return the expected error of SuspectedMisformatting"
#             assert message == SuspectedMisformatting.error, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have created the invalid test student"
#             assert user is None, errorMessage
#             user = get_user_by_email(
#                 "teststudent1@gmail.com"
#             )
#             errorMessage = "get_user_by_email() encountered an unexpected error!"
#             assert type(user) is not type(""), errorMessage
#             user_courses = get_user_courses_by_user_id(
#                 user
#             )
#             errorMessage = "get_user_courses_by_user_id() encountered an unexpected error!"
#             assert type(user_courses) is not type(""), errorMessage
#             errorMessage = "genericcsv_to_db() should not have enrolled the invalid test student in the test course"
#             assert user_courses.__len__() == 0, errorMessage
#             errorMessage = "Unexpected error, there should not be any students enrolled in the test course"
#             assert get_user_courses_by_course_id(
#                 result["course_id"]
#             ).__len__() == 0, errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
#             assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminCourse(result)) is not type(""), errorMessage
#             raise

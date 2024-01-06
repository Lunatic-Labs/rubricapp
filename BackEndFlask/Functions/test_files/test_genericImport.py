from Functions.customExceptions import *
from Functions.genericImport import *
from population_functions import *
import os


def retrieveFilePath(fileName):
    return os.getcwd () +  os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, fileName)


def test_should_fail_with_file_not_found(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            genericcsv_to_db(
                retrieveFilePath("NonExistentFile.csv"),
                result["user_id"],
                result["course_id"]
            )
        except Exception as e:
            deleteOneAdminCourse(result)
            assert isinstance(e, FileNotFound)
        except Exception as e:
            deleteOneAdminCourse(result)
            assert False, f'Unexpected exception: {e}. Expected: FileNotFound'
            raise e


def test_should_fail_with_wrong_extension(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            genericcsv_to_db(
                retrieveFilePath("wrongExtension.txt"),
                result["user_id"],
                result["course_id"]
            )
        except Exception as e:
            deleteOneAdminCourse(result)
            assert isinstance(e, WrongExtension)
        except Exception as e:
            deleteOneAdminCourse(result)
            assert False, f'Unexpected exception: {e}. Expected: WrongExtension'
            raise e


def test_should_fail_with_not_enough_columns(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            genericcsv_to_db(
                retrieveFilePath("notEnoughColumns.csv"),
                result["user_id"],
                result["course_id"]
            )
        except Exception as e:
            deleteOneAdminCourse(result)
            assert isinstance(e, NotEnoughColumns)
        except Exception as e:
            deleteOneAdminCourse(result)
            assert False, f'Unexpected exception: {e}. Expected: NotEnoughColumns'
            raise e


def test_should_fail_with_misformatted_student_email(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            genericcsv_to_db(
                retrieveFilePath("invalidStudentEmail.csv"),
                result["user_id"],
                result["course_id"]
            )
        except Exception as e:
            deleteOneAdminCourse(result)
            assert isinstance(e, SuspectedMisformatting)
        except Exception as e:
            deleteOneAdminCourse(result)
            assert False, f'Unexpected exception: {e}. Expected: SuspectedMisformatting'
            raise e


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


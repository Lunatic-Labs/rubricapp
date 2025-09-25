from Functions.customExceptions import *
from Functions.genericImport import *
from Functions.test_files.PopulationFunctions import *
import pytest
import os


def retrieve_file_path(file_name):
    return os.getcwd () +  os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, "genericImport-files") + os.path.join(os.path.sep, file_name)


def test_should_fail_with_file_not_found(flask_app_mock):
    with flask_app_mock.app_context():
            
        result = create_one_admin_course(False)

        with pytest.raises(FileNotFound):
            generic_csv_to_db(
                retrieve_file_path("NonExistentFile.csv"),
                result["user_id"],
                result["course_id"]
            )
        
        if result:
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_should_fail_with_wrong_extension(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        result = create_one_admin_course(False)

        with pytest.raises(WrongExtension):
            generic_csv_to_db(
                retrieve_file_path("wrongExtension.txt"),
                result["user_id"],
                result["course_id"]
            )

        if result:
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_should_fail_with_not_enough_columns(flask_app_mock):
    with flask_app_mock.app_context():

        result = create_one_admin_course(False)

        with pytest.raises(NotEnoughColumns):
            generic_csv_to_db(
                retrieve_file_path("notEnoughColumns.csv"),
                result["user_id"],
                result["course_id"]
            )

        if result:
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_should_fail_with_misformatted_student_email(flask_app_mock):
    with flask_app_mock.app_context():

        result = create_one_admin_course(False)

        with pytest.raises(InvalidEmail): 
            generic_csv_to_db(
                retrieve_file_path("invalidStudentEmail.csv"),
                result["user_id"],
                result["course_id"]
            )

        if result:
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_valid_student_with_no_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        
        try:
            result = create_one_admin_course(False)
            message = generic_csv_to_db(
                retrieve_file_path("oneStudentNoLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # generic_csv_to_db() returns none when successful

            user = get_user_by_email("teststudent1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test student"
            assert user is not None, error_message

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            error_message = "generic_csv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, error_message
        
        finally:
            if result:
                try:
                    delete_all_users_user_courses(result["course_id"])
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_valid_student_with_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
       
        try:
            result = create_one_admin_course(False)
            message = generic_csv_to_db(
                retrieve_file_path("oneStudentWithLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )

            assert message is None, message # generic_csv_to_db() returns none when successful

            user = get_user_by_email("teststudent1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test student"
            assert user is not None, error_message

            error_message = "upload failed to assign lms_id attribute to student when expected."
            assert user.lms_id is not None, error_message

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            error_message = "generic_csv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, error_message

        finally:
            if result:
                try:
                    delete_all_users_user_courses(result["course_id"])
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_valid_ta_with_no_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
       
        try:
            result = create_one_admin_course(True)
            message = generic_csv_to_db(
                retrieve_file_path("oneTANoLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # generic_csv_to_db() returns none when successful
            user = get_user_by_email("testTA1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test TA"
            assert user is not None, error_message

            error_message = "upload failed to assign lms_id attribute to student when expected."
            assert user.lms_id is None, error_message

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            

            error_message = "generic_csv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, error_message

        finally:
            if result:
                try:
                    delete_all_users_user_courses(result["course_id"])
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_valid_ta_with_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_course(True)
            message = generic_csv_to_db(
                retrieve_file_path("oneTAWithLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # generic_csv_to_db() returns none when successful

            user = get_user_by_email("testTA1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test TA"
            assert user is not None, error_message

            error_message = "upload failed to assign lms_id attribute to TA when expected."
            assert user.lms_id is not None, error_message

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            error_message = "generic_csv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, error_message

        finally:
            if result:
                try:
                    delete_all_users_user_courses(result["course_id"])
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_valid_student_and_ta_with_no_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            result = create_one_admin_course(True)
            message = generic_csv_to_db(
                retrieve_file_path("StudentAndTANoLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # generic_csv_to_db() returns none when successful
            user = get_user_by_email("testTA1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test TA"
            assert user is not None, error_message

            user = get_user_by_email("teststudent1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test student"
            assert user is not None, error_message

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            error_message = "generic_csv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, error_message

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            error_message = "generic_csv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, error_message

        finally:
            if result:
                try:
                    delete_all_users_user_courses(result["course_id"])
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_valid_students_and_tas_with_lms_id_in_table(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
     
        try:
            result = create_one_admin_course(True)
            message = generic_csv_to_db(
                retrieve_file_path("StudentAndTAWithLMSID.csv"),
                result["user_id"],
                result["course_id"]
            )
            assert message is None, message # generic_csv_to_db() returns none when successful
            user = get_user_by_email("testTA1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test TA"
            assert user is not None, error_message

            error_message = "upload failed to assign lms_id attribute to TA when expected."
            assert user.lms_id is not None, error_message

            user = get_user_by_email("teststudent1@gmail.com")

            error_message = "generic_csv_to_db() did not correctly create the valid test student"
            assert user is not None, error_message

            error_message = "upload failed to assign lms_id attribute to student when expected."
            assert user.lms_id is not None, error_message

            user_id = get_user_user_id_by_email("testTA1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            error_message = "generic_csv_to_db() did not correctly enroll the valid test TA in the test course"
            assert user_courses.__len__() == 1, error_message

            user_id = get_user_user_id_by_email("teststudent1@gmail.com")
            user_courses = get_user_courses_by_user_id(user_id)

            error_message = "generic_csv_to_db() did not correctly enroll the valid test student in the test course"
            assert user_courses.__len__() == 1, error_message

        finally:
            if result:
                try:
                    delete_all_users_user_courses(result["course_id"])
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")
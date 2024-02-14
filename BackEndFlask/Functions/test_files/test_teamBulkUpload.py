from Functions.customExceptions import *
from Functions.teamBulkUpload import team_bulk_upload
from population_functions import *
import os

def retrieve_file_path(file_name):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")+ os.path.join(os.path.sep, "teamBulkUpload-files") + os.path.join(os.path.sep, file_name)


def test_should_fail_with_wrong_extention_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            f = "test_file.txt"
            team_bulk_upload(f, 0, 0)
        except WrongExtension:
            assert True
        except Exception as e:
            assert False, f"team_bulk_upload did not return WrongExtension. It instead returned: {str(e)}"


def test_should_fail_with_non_existant_ta_email(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course()
            team_bulk_upload(
                retrieve_file_path("f-add-1-team-non-existant-ta-email.csv"),
                result["admin_id"],
                result["course_id"]
            )
            error_message = "student_team_to_db() did not correctly return NonExistentTA.error"
            assert False, error_message
        except UserDoesNotExist as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            assert True
        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise


def test_should_fail_with_suspected_misformatting_error_given_misformatted_ta_email(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course()
            team_bulk_upload(
                retrieve_file_path("f-add-3-people-misformatted-ta-email.csv"),
                result["admin_id"],
                result["course_id"]
            )
            error_message = "student_team_to_db() did not correctly return SuspectedMisformatting.error"
            assert False, error_message
        except SuspectedMisformatting as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            assert True
        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise


def test_should_fail_with_empty_team_members(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course()
            res = team_bulk_upload(
                retrieve_file_path("f-no-students-in-team.csv"),
                result["admin_id"],
                result["course_id"]
            )
            error_message = "student_team_to_db() did not correctly return EmptyTeamMembers.error"
            assert False, error_message
        except EmptyTeamMembers as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            assert True
        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise


def test_should_fail_with_file_not_found_error_given_non_existent_file(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course()
            try:
                team_bulk_upload(
                    retrieve_file_path("NonExistentFile.csv"),
                    result["admin_id"],
                    result["course_id"]
                )
                assert False, "unreachable"

            except Exception as e:
                assert isinstance(e, FileNotFoundError)

            teams = get_team_by_course_id(result["course_id"])

            error_message = "team_csv_to_db() should not assign a test team to a test course!"
            assert teams.__len__() == 0, error_message

            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise


def test_should_pass_when_given_one_team(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course()
            team_bulk_upload(
                retrieve_file_path("s-insert-1-team-1-ta.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            error_message = "team_csv_to_db() should assign a test team to a test course!"
            assert teams.__len__() == 1, error_message

            user = get_user_by_email("teststudent1@gmail.com")
            error_message = "team_csv_to_db() should assign a test team to a test course!"
            assert user.first_name == "fname1", error_message

            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise


def test_should_pass_when_given_two_teams_one_ta(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course()
            team_bulk_upload(
                retrieve_file_path("s-insert-2-teams-1-ta.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            error_message = "team_csv_to_db() should assign a test team to a test course!"
            assert teams.__len__() == 2, error_message
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])

        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise


def test_should_pass_when_given_three_teams_one_ta(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course()
            team_bulk_upload(
                retrieve_file_path("s-insert-3-teams-1-ta.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            error_message = "team_csv_to_db() should assign a test team to a test course!"
            assert teams.__len__() == 3, error_message
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])

        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise


def test_should_pass_when_given_2_teams_2_tas(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_two_admin_two_ta_student_course()
            team_bulk_upload(
                retrieve_file_path("s-insert-2-teams-2-tas.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            error_message = "team_csv_to_db() should assign a test team to a test course!"
            assert teams.__len__() == 2, error_message
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])

        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_one_admin_ta_student_course(result)
            delete_all_users_user_courses(result["course_id"])
            raise
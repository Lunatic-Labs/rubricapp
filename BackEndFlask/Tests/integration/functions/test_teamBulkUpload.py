from Functions.customExceptions import *
from Functions.teamBulkUpload import team_bulk_upload
from Tests.PopulationFunctions import *
from unittest.mock import patch
import pytest
import os


# May not work with CI/CD pipelines, but works locally
def retrieve_file_path(file_name: str) -> str:
    """Return absolute path to sample file in the same directory as this file."""
    base_dir = os.path.dirname(__file__)
    sample_dir = os.path.join(base_dir, "sample_files", "teamBulkUpload-files")
    return os.path.join(sample_dir, file_name)


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
        cleanup_test_users(db.session)
        result = create_one_admin_ta_student_course()

        with pytest.raises(UserDoesNotExist):
            team_bulk_upload(
                retrieve_file_path("f-add-1-team-non-existant-ta-email.csv"),
                result["admin_id"],
                result["course_id"]
            )

        # Clean up
        if result:
            try:
                delete_all_teams_team_members(result["course_id"])
                delete_one_admin_ta_student_course(result)
                delete_all_users_user_courses(result["course_id"])
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_should_fail_without_using_ta_with_non_existant_ta_email(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        result = create_one_admin_ta_student_course(False)

        # Patch get_user to simulate missing owner
        with patch("Functions.teamBulkUpload.get_user", return_value=None):
            with pytest.raises(UserDoesNotExist):
                team_bulk_upload(
                    retrieve_file_path("f-add-1-team-non-existant-ta-email.csv"),
                    result["admin_id"],
                    result["course_id"]
                )

        # Clean up
        if result:
            try:
                delete_all_teams_team_members(result["course_id"])
                delete_one_admin_ta_student_course(result)
                delete_all_users_user_courses(result["course_id"])
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_should_pass_when_course_found(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        result = create_one_admin_ta_student_course(False)
        try:
            team_bulk_upload(
                retrieve_file_path("f-add-1-team-non-existant-ta-email.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])
            assert len(teams) == 1, "Expected at least one team to exist"

            course_uses_tas = get_course_use_tas(result["course_id"])
            assert course_uses_tas is False, "course_uses_tas should be False for no-TA courses"

        finally:
            # Clean up
            if result:
                try:
                    delete_all_teams_team_members(result["course_id"])
                    delete_one_admin_ta_student_course(result)
                    delete_all_users_user_courses(result["course_id"])
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_should_fail_when_course_not_found(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        result = create_one_admin_ta_student_course(False)

        # Patch get_course to simulate missing course
        with patch("Functions.teamBulkUpload.get_course", return_value=None):
            with pytest.raises(OwnerIDDidNotCreateTheCourse):
                team_bulk_upload(
                    retrieve_file_path("f-add-1-team-non-existant-ta-email.csv"),
                    result["admin_id"],
                    result["course_id"]
                )

        # Clean up
        if result:
            try:
                delete_all_teams_team_members(result["course_id"])
                delete_one_admin_ta_student_course(result)
                delete_all_users_user_courses(result["course_id"])
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_should_fail_with_suspected_misformatting_error_given_misformatted_ta_email(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        result = create_one_admin_ta_student_course()

        with pytest.raises(SuspectedMisformatting):
            team_bulk_upload(
                retrieve_file_path("f-add-3-people-misformatted-ta-email.csv"),
                result["admin_id"],
                result["course_id"]
            )
        
        # Clean up
        if result:
            try:
                delete_all_teams_team_members(result["course_id"])
                delete_one_admin_ta_student_course(result)
                delete_all_users_user_courses(result["course_id"])
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_should_fail_with_empty_team_members(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        result = create_one_admin_ta_student_course()

        with pytest.raises(EmptyTeamMembers):
            team_bulk_upload(
                retrieve_file_path("f-no-students-in-team.csv"),
                result["admin_id"],
                result["course_id"]
            )
        
        # Clean up
        if result:
            try:
                delete_all_teams_team_members(result["course_id"])
                delete_one_admin_ta_student_course(result)
                delete_all_users_user_courses(result["course_id"])
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_should_fail_with_file_not_found_error_given_non_existent_file(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        result = create_one_admin_ta_student_course()

        with pytest.raises(FileNotFoundError):
            team_bulk_upload(
                retrieve_file_path("NonExistentFile.csv"),
                result["admin_id"],
                result["course_id"]
            )

        teams = get_team_by_course_id(result["course_id"])

        error_message = "team_csv_to_db() should not assign a test team to a test course!"
        assert teams.__len__() == 0, error_message

        # Clean up
        if result:
                try:
                    delete_all_teams_team_members(result["course_id"])
                    delete_one_admin_ta_student_course(result)
                    delete_all_users_user_courses(result["course_id"])
                except Exception as e:
                    print(f"Cleanup skipped: {e}")
                    

def test_should_pass_when_given_one_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

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
        
        finally:
            # Clean up
            if result:
                try:
                    delete_all_teams_team_members(result["course_id"])
                    delete_one_admin_ta_student_course(result)
                    delete_all_users_user_courses(result["course_id"])
                except Exception as e:
                    print(f"Cleanup skipped: {e}")
                    

def test_should_pass_when_given_two_teams_one_ta(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

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

        finally:
            # Clean up
            if result:
                try:
                    delete_all_teams_team_members(result["course_id"])
                    delete_one_admin_ta_student_course(result)
                    delete_all_users_user_courses(result["course_id"])
                except Exception as e:
                    print(f"Cleanup skipped: {e}")
                    


def test_should_pass_when_given_three_teams_one_ta(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

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
            
        finally:
            # Clean up
            if result:
                try:
                    delete_all_teams_team_members(result["course_id"])
                    delete_one_admin_ta_student_course(result)
                    delete_all_users_user_courses(result["course_id"])
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_should_pass_when_given_2_teams_2_tas(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
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
        
        finally:
            # Clean up
            if result:
                try:
                    delete_all_teams_team_members(result["course_id"])
                    delete_one_admin_ta_student_course(result)
                    delete_all_users_user_courses(result["course_id"])
                except Exception as e:
                    print(f"Cleanup skipped: {e}")
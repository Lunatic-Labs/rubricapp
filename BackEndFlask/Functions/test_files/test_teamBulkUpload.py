from Functions.customExceptions import *
from Functions.teamBulkUpload import team_bulk_upload
from population_functions import *
import os

def retrieveFilePath(fileName):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")+ os.path.join(os.path.sep, "teamBulkUpload-files") + os.path.join(os.path.sep, fileName)


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
            result = createOneAdminTAStudentCourse()
            team_bulk_upload(
                retrieveFilePath("f-add-1-team-non-existant-ta-email.csv"),
                result["admin_id"],
                result["course_id"]
            )
            errorMessage = "student_team_to_db() did not correctly return NonExistentTA.error"
            assert False, errorMessage
        except UserDoesNotExist as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            assert True
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


def test_should_fail_with_suspected_misformatting_error_given_misformatted_ta_email(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            team_bulk_upload(
                retrieveFilePath("f-add-3-people-misformatted-ta-email.csv"),
                result["admin_id"],
                result["course_id"]
            )
            errorMessage = "student_team_to_db() did not correctly return SuspectedMisformatting.error"
            assert False, errorMessage
        except SuspectedMisformatting as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            assert True
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


def test_should_fail_with_empty_team_members(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            res = team_bulk_upload(
                retrieveFilePath("f-no-students-in-team.csv"),
                result["admin_id"],
                result["course_id"]
            )
            errorMessage = "student_team_to_db() did not correctly return EmptyTeamMembers.error"
            assert False, errorMessage
        except EmptyTeamMembers as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            assert True
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


def test_should_fail_with_file_not_found_error_given_non_existent_file(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            try:
                team_bulk_upload(
                    retrieveFilePath("NonExistentFile.csv"),
                    result["admin_id"],
                    result["course_id"]
                )
                assert False, "unreachable"

            except Exception as e:
                assert isinstance(e, FileNotFoundError)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage

            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


def test_should_pass_when_given_one_team(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            team_bulk_upload(
                retrieveFilePath("s-insert-1-team-1-ta.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should assign a test team to a test course!"
            assert teams.__len__() == 1, errorMessage

            user = get_user_by_email("teststudent1@gmail.com")
            errorMessage = "teamcsvToDB() should assign a test team to a test course!"
            assert user.first_name == "fname1", errorMessage

            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


def test_should_pass_when_given_two_teams_one_ta(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            team_bulk_upload(
                retrieveFilePath("s-insert-2-teams-1-ta.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should assign a test team to a test course!"
            assert teams.__len__() == 2, errorMessage
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


def test_should_pass_when_given_three_teams_one_ta(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            team_bulk_upload(
                retrieveFilePath("s-insert-3-teams-1-ta.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should assign a test team to a test course!"
            assert teams.__len__() == 3, errorMessage
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


def test_should_pass_when_given_2_teams_2_tas(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createTwoAdminTwoTAStudentCourse()
            team_bulk_upload(
                retrieveFilePath("s-insert-2-teams-2-tas.csv"),
                result["admin_id"],
                result["course_id"]
            )

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should assign a test team to a test course!"
            assert teams.__len__() == 2, errorMessage
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            deleteAllUsersUserCourses(result["course_id"])
            raise


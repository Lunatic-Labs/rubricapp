from Functions.customExceptions import *
from Functions.addStudentsAndAssignTeams import student_and_team_to_db
from population_functions import *
import os

def retrieveFilePath(fileName):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")+ os.path.join(os.path.sep, "addStudentsAndAssignTeams-files") + os.path.join(os.path.sep, fileName)

#test_wrong_extention_error
#   - ensures that student_and_team_to_db
#       - returns an error if given the incorrect file type
def test_wrong_extention_error(flask_app_mock):
    with flask_app_mock.app_context():
        f = "test_file.txt"
        result = student_and_team_to_db(f, 0, 0)
        errorMessage = "student_team_to_db() did not correctly return WrongExtension.error"
        assert result == WrongExtension.error, errorMessage

def test_file_not_found(flask_app_mock):
    with flask_app_mock.app_context():
        result = student_and_team_to_db("this_shouldn't_exist.csv", 0, 0)
        errorMessage = "student_team_to_db() did not correctly return FileNotFound.error"
        assert result == FileNotFound.error, errorMessage
        
def test_misformatted_email(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()           
            testResult = student_and_team_to_db(retrieveFilePath("f-add-3-people-misformatted-email.csv"), result["user_id"], result["course_id"])
            errorMessage = "student_team_to_db() did not correctly return SuspectedMisformatting.error"
            assert testResult == SuspectedMisformatting.error, errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise 

def test_not_enough_columns(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()           
            testResult = student_and_team_to_db(retrieveFilePath("f-missing-ta.csv"), result["user_id"], result["course_id"])
            errorMessage = "student_team_to_db() did not correctly return NotEnoughColumns.error"
            assert testResult == NotEnoughColumns.error, errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise 

def test_missing_ta(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(True, True, False)           
            testResult = student_and_team_to_db(retrieveFilePath("s-add-3-people.csv"), result["user_id"], result["course_id"])
            errorMessage = "student_team_to_db() did not correctly return TANotYetAddedToCourse.error"
            assert testResult == TANotYetAddedToCourse.error, errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise 


# Note: this test is unfinished. it will most likely fail
def test_missing_user(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()           
            testResult = student_and_team_to_db(retrieveFilePath("f-add-3-people-one-missing-name.csv"), result["user_id"], result["course_id"])
            errorMessage = "student_team_to_db() did not correctly return UserDoesNotExist.error"
            assert testResult == UserDoesNotExist.error, errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise 

# Note: this test is untested. it will most likely fail.
def owner_didnt_make_course(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()           
            testResult = student_and_team_to_db(retrieveFilePath("f-missing-everything.csv"), result["user_id"], result["course_id"])
            errorMessage = "student_team_to_db() did not correctly return OwnerIDDidNotCreateTheCourse.error"
            assert testResult == OwnerIDDidNotCreateTheCourse.error, errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise

# Note: this test is untested. it will most likely fail.
def test_too_much_columns(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()           
            testResult = student_and_team_to_db(retrieveFilePath("f-add-2-ta-emails.csv"), result["user_id"], result["course_id"])
            errorMessage = "student_team_to_db() did not correctly return TooManyColumns.error"
            assert testResult == TooManyColumns.error, errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise 
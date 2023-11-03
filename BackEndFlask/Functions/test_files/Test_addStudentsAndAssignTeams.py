from Functions.addStudentsAndAssignTeams import student_and_team_to_db
from Functions.customExceptions import *
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
        # Comment from Brian:
        # TODO: The following error message should say: "student_team_to_db() did not correctly return WrongExtension.error" 
        errorMessage = "student_and_team_to_db() encountered an unexpected error!"
        assert result == WrongExtension.error, errorMessage

def test_file_not_found(flask_app_mock):
    with flask_app_mock.app_context():
        result = student_and_team_to_db("this_shouldn't_exist.csv", 0, 0)
        # Comment from Brian:
        # TODO: The following error message should say: "student_team_to_db() did not correctly return FileNotFound.error" 
        errorMessage = "student_and_team_to_db() encountered an unexpected error!"
        assert result == FileNotFound.error, errorMessage
        
def test_not_enough_columns(flask_app_mock):
    with flask_app_mock.app_context():
        # Comment from Brian:
        # TODO: ensure that you are deleting the created Admin Course at the end of the test.
        # Both on success of the test and when the test fails.
        result = createOneAdminCourse(True)
        testResult = student_and_team_to_db(retrieveFilePath("f-add-3-people-one-missing-email.csv"), result["user_id"], result["course_id"])
        # Comment from Brian:
        # TODO: The following error message should say: "student_team_to_db() did not correctly return NotEnoughColumns.error" 
        errorMessage = "student_and_team_to_db() encountered an unexpected error!"
        assert testResult == NotEnoughColumns.error, errorMessage
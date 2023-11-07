from Functions.customExceptions import *
from Functions.addStudentsAndAssignTeams import student_and_team_to_db
from population_functions import *
import os

def retrieveFilePath(fileName):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, "addStudentsAndAssignTeams-files")+ os.path.join(os.path.sep, fileName)

def test_should_add_10_students_given_valid_file(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminCourse(False)
            student_and_team_to_db(retrieveFilePath("s-add-10-people.csv"), result["user_id"], result["course_id"])
            user = get_user_by_email(
                "teststudent1@gmail.com"
            )
            assert user is not str
            user = get_user_by_email(
                "teststudent10@gmail.com"
            )
            assert user is not str
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
        except:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminCourse(result)
            
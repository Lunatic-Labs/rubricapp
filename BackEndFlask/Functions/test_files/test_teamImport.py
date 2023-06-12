from customExceptions import *
from models.user import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_user import *
from models.team_course import *
from population_functions import *
from teamImport import teamfileToDB
import os

"""
    Ensures teamImport can
        - properly convert an xlsx file to csv
        - read in a csv file and update the Users table accordingly    
        - create teams in Team table
        - assign TAs as observers to teams
        - establish relationship between teams and a course in the TeamCourse table
        - establish relationship between students and teams in the TeamUser table
        - appropriately handle errors
"""

def retrieveFilePath(fileName):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, fileName)

"""
test_valid_file_wTAs_records_all_data()
   - calls createOneAdminTAStudentCourse() with one parameter:
        - the course does use TAs (True)
        - createOneAdminTAStudentCourse() creates a new admin, ta, student, and course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamTAStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts
        - 1 team was created and assigned to the test course
        - 2 users, a ta and student, were assigned to the team
"""
def test_valid_file_wTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True)
        assert  teamfileToDB(
            retrieveFilePath(
                "oneTeamTAStudent.csv"
            ),
            2,
            course_id
        ) == "Upload successful!"
        team_course = get_team_courses_by_course_id(course_id)
        assert team_course.__len__() == 1
        assert get_team_users_by_team_id(team_course[0].team_id).__len__() == 1

"""
test_valid_file_woTAs_records_all_data()
    - calls createOneAdminTAStudentCourse() with one parameter:
        - the course does not use TAs (False)
        - createOneAdminTAStudentCourse() creates a new admin, student, and course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts
        - 1 team was created and assigned to the test course
        - 1 user, a student, was assigned to the team
"""
def test_valid_file_woTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(False)
        assert teamfileToDB(
            retrieveFilePath(
                "oneTeamStudent.csv"
            ),
            2,
            course_id
        ) == "Upload successful!"
        team_course = get_team_courses_by_course_id(course_id)
        assert team_course.__len__() == 1
        assert get_team_users_by_team_id(team_course[0].team_id).__len__() == 1

"""
test_valid_xlsx_file_wTAs_records_all_data()
    - calls create_test_user_course() with three parameters:
        - 20 students should be created (20)
        - test course should use TAs (True)
        - test course uses 3 TAs(3)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the ValidTeamsYesTAs.xlsx files
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts 5 teams were created in the team table, 20 team_user relations were formed in the team_user table, and 5 relations were made in the team_course table
"""
def test_valid_xlsx_file_wTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20, True, 3)
        teamfileToDB(retrieveFilePath("ValidTeamsYesTAs.xlsx"), 2, 1)
        assert get_teams().__len__()==5 
        assert get_team_users().__len__()==20 
        assert get_team_courses().__len__()==5

"""
test_wrong_file_type_error()
    - calls teamfileToDB() with three parameters:
        - the retrieved file path to the WrongFileType.pdf file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts Wrong FileType error is returned because the teamcsvfile has the .pdf extension and not .csv
"""
def test_wrong_file_type_error(flask_app_mock):
    with flask_app_mock.app_context():
        assert teamfileToDB(
            retrieveFilePath(
                "WrongFileType.pdf"
            ),
            2,
            1
        ) == WrongExtension.error

"""
test_file_not_found_error()
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the NonExistentFile.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts File Not Found error is returned because the teamcsvfile path does not exist
"""
def test_file_not_found_error(flask_app_mock):
    with flask_app_mock.app_context():
        assert teamfileToDB(
            retrieveFilePath(
                "NonExistentFile.csv"
            ),
            2,
            1
        ) == "File not found or does not exist!"

"""
test_wrong_file_type_error()
    - calls create_test_user_course() with one parameter:
        - 20 students should be created (20)
    - calls teamfileToDB() with three parameters:
        - the retrieved file path to the WrongFileType.pdf file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts Wrong FileType error is returned
"""
def test_wrong_file_type_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20)
        assert teamfileToDB(retrieveFilePath("WrongFileType.pdf"), 2, 1) == WrongExtension.error

"""
test_misformatting_TA_email_error()
    - calls createOneAdminTAStudentCourse() with one parameter:
        - the course does use TAs (True)
        - createOneAdminTAStudentCourse() creates a new admin, ta, student, and course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamMisformattedTAStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts Misformatting error is returned because there is a missing @ from the TA email!
"""
def test_misformatting_TA_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True)
        assert teamfileToDB(
            retrieveFilePath(
                "oneTeamMisformattedTAStudent.csv"
            ),
            2,
            course_id
        ) == "The following row does not contain a valid email where email is expected:\n['D', 'testta1gmail.com']"

"""
test_misformatting_student_email_error()
    - calls createOneAdminTAStudentCourse() with one parameter:
        - the course does not use TAs (False)
        - createOneAdminTAStudentCourse() creates a new admin, student, and course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamMisformattedStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts Misformatting error is returned because there is a missing @ from the student email!
"""
def test_misformatting_student_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(False)
        assert teamfileToDB(
            retrieveFilePath(
                "oneTeamMisformattedStudent.csv"
            ),
            2,
            course_id
        ) == "The following row does not contain a valid email where email is expected:\n['E', 'teststudentgmail.com']"

"""
test_users_do_not_exist_error()
    - calls createOneAdminTAStudentCourse() with one parameter:
        - the course does use TAs (True)
        - createOneAdminTAStudentCourse() creates a new admin, ta, student, and course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamNonExistingTAStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts ALL emails of unregistered students are returned!!!
"""
def test_users_do_not_exist_error(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True)
        assert teamfileToDB(
            retrieveFilePath(
                "oneTeamNonExistingTAStudent.csv"
            ),
            2,
            course_id
        ) == "Upload unsuccessful! No account(s) found for the following email(s):\nnonexistingta@gmail.com\n\nEnsure that all accounts are made and try again."

"""
test_TA_not_yet_added_error()
    - calls createOneAdminTAStudentCourse() with two parameter:
        - the course does use TAs (True)
        - unenroll the test TA (True)
        - createOneAdminTAStudentCourse()
            - creates a new admin, ta, student, and course
            - enrolls only the test student in the course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamTAStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts ALL emails of unassigned TAs are returned!!!
"""
def test_TA_not_yet_added_error(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True, True)
        assert teamfileToDB(
            retrieveFilePath(
                "oneTeamTAStudent.csv"
            ),
            2,
            course_id
        ) == "Upload unsuccessful! The following accounts associated with the following TA emails have not been assigned to this course:\ntestta2@gmail.com\n\nEnsure that you have added all of your TAs for this course and try again."


"""
test_student_not_enrolled_in_this_course()
    - calls createOneAdminTAStudentCourse() with three parameter:
        - the course does use TAs (True)
        - do not unenroll the test ta (False)
        - unenroll the test student (True)
        - createOneAdminTAStudentCourse()
            - creates a new admin, ta, student, and course
            - enrolls only the test ta in the course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamTAStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts ALL emails of unenrolled students are returned!!!
"""
def test_student_not_enrolled_in_this_course(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True, False, True)
        assert teamfileToDB(
            retrieveFilePath(
                "oneTeamTAStudent.csv"
            ),
            2,
            course_id
        ) == "Upload unsuccessful! The following accounts associated with the following student emails have not been assigned to this course:\nteststudent3@gmail.com\n\nEnsure that all of your students are enrolled in this course and try again."
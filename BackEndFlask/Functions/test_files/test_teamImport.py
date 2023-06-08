import os
from models.schemas import UserCourse, InstructorTaCourse
from models.user import get_user_user_id_by_email
from models.team import get_teams
from models.team_user import get_team_users
from models.team_course import get_team_courses
from population_functions import create_test_user_course
from teamImport import teamfileToDB

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
    - calls create_test_user_course() with three parameters:
        - 20 students should be created (20)
        - test course should use TAs (True)
        - test course uses 3 TAs(3)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the ValidTeamsYesTAs.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts 5 teams were created in the team table, 20 team_user relations were formed in the team_user table, and 5 relations were made in the team_course table
"""
def test_valid_file_wTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20, True, 3)
        teamfileToDB(retrieveFilePath("ValidTeamsYesTAs.csv"), 2, 1)
        assert get_teams().__len__()==5 and get_team_users().__len__()==20 and get_team_courses().__len__()==5

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
        assert get_teams().__len__()==5 and get_team_users().__len__()==20 and get_team_courses().__len__()==5

"""
test_valid_file_woTAs_records_all_data()
    - calls create_test_user_course() with one parameter:
        - 20 students should be created (20)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the ValidTeamsNoTAs.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts 5 teams were created in the team table, 20 team_user relations were formed in the team_user table, and 5 relations were made in the team_course table
"""
def test_valid_file_woTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20)
        teamfileToDB(retrieveFilePath("ValidTeamsNoTAs.csv"), 2, 1)
        assert get_teams().__len__()==5 and get_team_users().__len__()==20 and get_team_courses().__len__()==5


"""
test_file_not_found_error()
    - calls create_test_user_course() with one parameter:
        - 3 students should be created (3)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the NonExistentFile.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts File Not Found error is returned
"""
def test_file_not_found_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(3)
        assert teamfileToDB(retrieveFilePath("NonExistentFile.csv"), 2, 1) == "File not found or does not exist!"

"""
test_wrong_file_type_error()
    - calls create_test_user_course() with one parameter:
        - 20 students should be created (20)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the WrongFileType.pdf file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts Wrong FileType error is returned
"""
def test_wrong_file_type_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20)
        assert teamfileToDB(retrieveFilePath("WrongFileType.pdf"), 2, 1) == "Wrong filetype submitted! Please submit a .csv file."

"""
test_misformatting_TA_email_error()
    - calls create_test_user_course() with three parameters:
        - 20 students should be created (20)
        - test course should use TAs (True)
        - test course uses 3 TAs(3)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the WrongFormattingTeamsYesTAs.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts Misformatting error is returned
"""
def test_misformatting_TA_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20, True, 3)
        assert "The following row does not contain a valid email where email is expected:" in teamfileToDB(retrieveFilePath("WrongFormattingTeamsYesTAs.csv"), 2, 1)

"""
test_misformatting_student_email_error()
    - calls create_test_user_course() with one parameter:
        - 20 students should be created (20)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the WrongFormattingTeamsNoTAs.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts Misformatting error is returned
"""
def test_misformatting_student_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20)
        assert "The following row does not contain a valid email where email is expected:" in teamfileToDB(retrieveFilePath("WrongFormattingTeamsNoTAs.csv"), 2, 1)

"""
test_users_do_not_exist_error()
    - calls create_test_user_course() with one parameter:
        - 15 students should be created (15)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the ValidTeamsNoTAs.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts User(s) Do(es) Not exist error is returned
"""
def test_users_do_not_exist_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(15)
        expectedError = "Upload unsuccessful! No account(s) found for the following email(s):"
        expectedError += "\nStudent16@gmail.com\nStudent17@gmail.com\nStudent18@gmail.com\nStudent19@gmail.com\nStudent20@gmail.com"
        expectedError += "\n\nEnsure that all accounts are made and try again."
        assert teamfileToDB(retrieveFilePath("ValidTeamsNoTAs.csv"), 2, 1) == expectedError

"""
test_TA_not_yet_added_error()
    - calls create_test_user_course() with three parameters:
        - 20 students should be created (20)
        - test course should use TAs (True)
        - test course uses 3 TAs(3)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the ValidTeamsYesTAs.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts TA Not Yet Added error is returned
"""
def test_TA_not_yet_added_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20, True, 3)
        InstructorTaCourse.query.filter_by(owner_id=2,ta_id=get_user_user_id_by_email("TA3@gmail.com"),course_id=1).delete()
        expectedError = "Upload unsuccessful! The following accounts associated with the following TA emails have not been assigned to this course:"
        expectedError += "\nTA3@gmail.com\n\nEnsure that you have added all of your TAs for this course and try again."
        assert teamfileToDB(retrieveFilePath("ValidTeamsYesTAs.csv"), 2, 1) == expectedError

"""
test_student_not_enrolled_in_this_course()
    - calls create_test_user_course() with one parameter:
        - 20 students should be created (20)
    - calls teamsfileToDB() with three parameters:
        - the retrieved file path to the ValidTeamsNoTAs.csv file
        - the test teacher id (owner_id) of 2
        - the test course_id of 1
    - asserts Student Not Enrolled In This Course error is returned
"""
def test_student_not_enrolled_in_this_course(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(20)
        UserCourse.query.filter_by(user_id=get_user_user_id_by_email("Student20@gmail.com"), course_id=1).delete()
        expectedError = "Upload unsuccessful! The following accounts associated with the following student emails have not been assigned to this course:"
        expectedError +="\nStudent20@gmail.com\n\nEnsure that all of your students are enrolled in this course and try again."
        assert teamfileToDB(retrieveFilePath("ValidTeamsNoTAs.csv"), 2, 1) == expectedError

import os
from models.schemas import Team, TeamUser, TeamCourse, UserCourse, Users, InstructorTaCourse
from population_functions import create_test_user_course
from teamImport import teamcsvToDB

"""
    Ensures teamImport can
        - read in a csv file and update the Users table accordingly    
        - create teams in Team table
        - assign TAs as observers to teams
        - establish relationship between teams and a course in the TeamCourse table
        - establish relationship between students and teams in the TeamUser table
        - appropriately handle errors
"""


def test_valid_file_wTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = True
        numofTAs = 3
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsYesTAs.csv")
        create_test_user_course(numOfStudents, usesTAs, numofTAs)
        teamcsvToDB(teamcsv, owner_id, course_id)
        teams = Team.query.count()
        teamUsers = TeamUser.query.count()
        teamCourses = TeamCourse.query.count()
    assert teams == 5 and teamUsers == 20 and teamCourses == 5

def test_valid_file_woTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        teamcsvToDB(teamcsv, owner_id, course_id)
        teams = Team.query.count()
        teamUsers = TeamUser.query.count()
        teamCourses = TeamCourse.query.count()
    assert teams == 5 and teamUsers == 20 and teamCourses == 5


def test_file_not_found_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "NonExistentFile.csv")
        create_test_user_course(numOfStudents, usesTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "File not found or does not exist!"

def test_wrong_file_type_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "WrongFileType.pdf")
        create_test_user_course(numOfStudents, usesTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "Wrong filetype submitted! Please submit a .csv file."

def test_misformatting_TA_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = True
        numOfTAs = 3
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "WrongFormattingTeamsYesTAs.csv")
        create_test_user_course(numOfStudents, usesTAs, numOfTAs)
        assert "The following row does not contain a valid email where email is expected:" in teamcsvToDB(teamcsv, owner_id, course_id)

def test_misformatting_student_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "WrongFormattingTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        assert "The following row does not contain a valid email where email is expected:" in teamcsvToDB(teamcsv, owner_id, course_id)

def test_users_do_not_exist_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 15
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        expectedError = "Upload unsuccessful! No account(s) found for the following email(s):"
        expectedError += "\nStudent16@gmail.com\nStudent17@gmail.com\nStudent18@gmail.com\nStudent19@gmail.com\nStudent20@gmail.com"
        expectedError += "\n\nEnsure that all accounts are made and try again."
        assert teamcsvToDB(teamcsv, owner_id, course_id) == expectedError

def test_TA_not_yet_added_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = True
        numOfTAs = 3
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsYesTAs.csv")
        create_test_user_course(numOfStudents, usesTAs, numOfTAs)
        ta = Users.query.filter_by(email="TA3@gmail.com").first()
        InstructorTaCourse.query.filter_by(owner_id=owner_id,ta_id=ta.user_id,course_id=course_id).delete()
        expectedError = "Upload unsuccessful! The following accounts associated with the following TA emails have not been assigned to this course:"
        expectedError += "\nTA3@gmail.com\n\nEnsure that you have added all of your TAs for this course and try again."
        assert teamcsvToDB(teamcsv, owner_id, course_id) == expectedError

def test_student_not_enrolled_in_this_course(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        student = Users.query.filter_by(email="Student20@gmail.com").first()
        UserCourse.query.filter_by(user_id=student.user_id, course_id=course_id).delete()
        expectedError = "Upload unsuccessful! The following accounts associated with the following student emails have not been assigned to this course:"
        expectedError +="\nStudent20@gmail.com\n\nEnsure that all of your students are enrolled in this course and try again."
        assert teamcsvToDB(teamcsv, owner_id, course_id) == expectedError
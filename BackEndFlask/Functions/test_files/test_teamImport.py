<<<<<<< HEAD
import os
#from models.schemas import Team, TeamUser, TeamCourse, UserCourse, Users, InstructorTaCourse
from models.schemas import Team, TeamUser, TeamCourse, UserCourse, Users, InstructorTaCourse
from population_functions import create_test_user_course
from teamImport import teamcsvToDB
=======
import customExceptions
from models.user import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_user import *
from models.team_course import *
from population_functions import *
import teamImport
import os
>>>>>>> master

"""
    Ensures teamImport can
        - read in a csv file and update the Users table accordingly    
        - create teams in Team table
        - assign TAs as observers to teams
        - establish relationship between teams and a course in the TeamCourse table
        - establish relationship between students and teams in the TeamUser table
        - appropriately handle errors
"""

<<<<<<< HEAD

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
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "Row does not contain an email where an email is expected. Misformatting Suspected."

def test_misformatting_student_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 20
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "WrongFormattingTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "Row does not contain an email where an email is expected. Misformatting Suspected."

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
=======
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
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "oneTeamTAStudent.csv"
            ),
            2,
            course_id
        ) == "Upload successful!"
        team_course = get_team_courses_by_course_id(course_id)
        assert team_course.__len__() == 1
        assert get_team_users_by_team_id(team_course[0].team_id).__len__() == 2

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
        assert teamImport.teamcsvToDB(
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
test_wrong_file_type_error()
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the WrongFileType.pdf file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts Wrong FileType error is returned because the teamcsvfile has the .pdf extension and not .csv
"""
def test_wrong_file_type_error(flask_app_mock):
    with flask_app_mock.app_context():
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "WrongFileType.pdf"
            ),
            2,
            1
        ) == customExceptions.WrongExtension.error

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
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "NonExistentFile.csv"
            ),
            2,
            1
        ) == customExceptions.FileNotFoundError.error

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
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "oneTeamMisformattedTAStudent.csv"
            ),
            2,
            course_id
        ) == customExceptions.SuspectedMisformatting.error

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
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "oneTeamMisformattedStudent.csv"
            ),
            2,
            course_id
        ) == customExceptions.SuspectedMisformatting.error

"""
test_users_do_not_exist_error()
    - calls createOneAdminTAStudentCourse() with one parameter:
        - the course does use TAs (True)
        - createOneAdminTAStudentCourse() creates a new admin, ta, student, and course
    - calls teamscsvToDB() with three parameters:
        - the retrieved file path to the oneTeamNonExistingTAStudent.csv file
        - the id of the test teacher (owner_id)
        - the id of the test course (course_id)
    - asserts User does not exist error is returned because the ta email does not exist!
"""
def test_users_do_not_exist_error(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True)
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "oneTeamNonExistingTAStudent.csv"
            ),
            2,
            course_id
        ) == customExceptions.UserDoesNotExist.error

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
    - asserts TA Not Yet Added to the Course error is returned because the ta is not added to the course!
"""
def test_TA_not_yet_added_error(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True, True)
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "oneTeamTAStudent.csv"
            ),
            2,
            course_id
        ) == customExceptions.TANotYetAddedToCourse.error

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
    - asserts Student Not Enrolled In This Course error is returned because the test student is not enrolled in the course
"""
def test_student_not_enrolled_in_this_course(flask_app_mock):
    with flask_app_mock.app_context():
        course_id = createOneAdminTAStudentCourse(True, False, True)
        assert teamImport.teamcsvToDB(
            retrieveFilePath(
                "oneTeamTAStudent.csv"
            ),
            2,
            course_id
        ) == customExceptions.StudentNotEnrolledInThisCourse.error
>>>>>>> master

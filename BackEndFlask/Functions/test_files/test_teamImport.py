import os
from models.schemas import Team, TeamUser, TeamCourse, UserCourse, Users
from sqlalchemy import delete
from population_functions import create_test_user_course
from teamImport import teamcsvToDB
# from conftest import db


def test_valid_file_wTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
        usesTAs = True
        numofTAs = 3
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsYesTAs.csv")
        create_test_user_course(numOfStudents, usesTAs, numofTAs)
        teamcsvToDB(teamcsv, owner_id, course_id)
        teams = Team.query.count()
        teamUsers = TeamUser.query.count()
        teamCourses = TeamCourse.query.count()
    assert teams == 10 and teamUsers == 40 and teamCourses == 10

def test_valid_file_woTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        teamcsvToDB(teamcsv, owner_id, course_id)
        teams = Team.query.count()
        teamUsers = TeamUser.query.count()
        teamCourses = TeamCourse.query.count()
    assert teams == 10 and teamUsers == 40 and teamCourses == 10


def test_file_not_found_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "NonExistentFile.csv")
        create_test_user_course(numOfStudents, usesTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "File not found or does not exist!"

def test_wrong_file_type_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "WrongFileType.pdf")
        create_test_user_course(numOfStudents, usesTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "Wrong filetype submitted! Please submit a .csv file."

def test_misformatting_TA_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
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
        numOfStudents = 40
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "WrongFormattingTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "Row does not contain an email where an email is expected. Misformatting Suspected."

def test_user_does_not_exist_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 2
        usesTAs = False
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "At least one email address in the csv file is not linked to a user. Make sure all students and TAs have accounts."

def test_TA_not_yet_added_error(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
        usesTAs = True
        numOfTAs = 2
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "ValidTeamsNoTAs.csv")
        create_test_user_course(numOfStudents, usesTAs, numOfTAs)
        assert teamcsvToDB(teamcsv, owner_id, course_id) == "At least one of the TAs listed in the csv file is not assigned to this course. Make sure all of your TAs have been added to this course."

# def test_student_not_enrolled_in_this_course(flask_app_mock):
#     with flask_app_mock.app_context():
#         owner_id = 2
#         course_id = 1
#         numOfStudents = 40
#         usesTAs = False
#         teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
#         teamcsv += os.path.join(os.path.sep, "ValidTeamsNoTAs.csv")
#         create_test_user_course(numOfStudents, usesTAs)
#         student = Users.query.filter_by(email="Student40@gmail.com").first()
#         # UserCourse.query.delete().where(course_id=course_id, user_id=student.user_id)
#         delete(UserCourse).where(UserCourse.course_id==course_id, UserCourse.user_id==student.user_id)
#         assert teamcsvToDB(teamcsv, owner_id, course_id) == "At least one of the student emails in the csv file is not associated with a student enrolled in this course. Make sure all of your students have been added to this course."
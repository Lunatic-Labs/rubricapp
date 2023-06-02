import os
from models.schemas import Team, TeamUser, TeamCourse, InstructorTaCourse
from population_functions import create_test_user_course
from teamImport import teamcsvToDB


def test_valid_file_wTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
        usesTAs = True
        numofTAs = 3
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
        teamcsv += os.path.join(os.path.sep, "sample_roster.csv")
        create_test_user_course(numOfStudents, usesTAs, numofTAs)
        print(teamcsvToDB(teamcsv, owner_id, course_id))
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
        teamcsv += os.path.join(os.path.sep, "sample_roster.csv")
        create_test_user_course(numOfStudents, usesTAs)
        teamcsvToDB(teamcsv, owner_id, course_id)
        teams = Team.query.count()
        teamUsers = TeamUser.query.count()
        teamCourses = TeamCourse.query.count()
    assert teams == 10 and teamUsers == 40 and teamCourses == 10




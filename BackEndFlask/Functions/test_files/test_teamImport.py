import os
from models.schemas import Users
from population_functions import create_test_user_course
from teamImport import teamcsvToDB


def test_one(flask_app_mock):
    with flask_app_mock.app_context():
        owner_id = 2
        course_id = 1
        numOfStudents = 40
        usesTAs = True
        numofTAs = 3
        teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, "sample_roster.csv")
        create_test_user_course(numOfStudents, usesTAs, numofTAs)
        teamcsvToDB(teamcsv, owner_id, course_id)
        user = Users.query.filter_by(last_name="Palomo").first() is not None
    assert user is not None
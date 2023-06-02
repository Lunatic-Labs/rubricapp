import os
from population_functions import create_test_user_course
from teamImport import teamcsvToDB


def test_(flask_app_mock):
    owner_id = 2
    course_id = 1
    numOfStudents = 20
    teamcsv = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, "Valid.csv")
    create_test_user_course(numOfStudents, False)
    teamcsvToDB(teamcsv, owner_id, course_id)
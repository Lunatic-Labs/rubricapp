from Functions.customExceptions import *
from models.user_course import *
from models.team import *
from models.team_user import *
from population_functions import *
from Functions import teamImport
import os

def retrieveFilePath(fileName):
    return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files") + os.path.join(os.path.sep, fileName)

# test_valid_file_wTAs_records_all_data()
#   - calls createOneAdminTAStudentCourse() with one parameter:
#       - the course does use TAs (True)
#   - creates a new admin, ta, student, and course
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the oneTeamTAStudent.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts
#       - 1 team was created and assigned to the test course
#       - 2 users, a ta and student, were assigned to the team
def test_valid_file_wTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            message = teamImport.teamcsvToDB(
                retrieveFilePath("oneTeamTAStudent.csv"),
                result["admin_id"],
                result["course_id"]
            )
            
            errorMessage = "teamcsvToDB() did not return the expected success message!"
            assert message == "Upload successful!", errorMessage
            
            teams = get_team_by_course_id(result["course_id"])
            
            errorMessage = "teamcsvToDB() did not correctly create the valid test team!"
            assert teams.__len__() == 1, errorMessage

            teams = get_team_by_course_id(result["course_id"])

            team_users = get_team_users_by_team_id(teams[0].team_id)
            
            errorMessage = "teamscsvToDB() did not correctly assign the test student to the test team!"
            assert team_users.__len__() == 2, errorMessage

            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_valid_file_woTAs_records_all_data()
#   - calls createOneAdminTAStudentCourse() with one parameter:
#       - the course does not use TAs (False)
#   - creates a new admin, student, and course
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the oneTeamStudent.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts
#       - 1 team was created and assigned to the test course
#       - 1 user, a student, was assigned to the team
def test_valid_file_woTAs_records_all_data(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(False)
            message = teamImport.teamcsvToDB(
                retrieveFilePath("oneTeamStudent.csv"),
                result["admin_id"],
                result["course_id"]
            )
            
            errorMessage = "teamcsvToDB() did not return the expected success message!"
            assert message == "Upload successful!", errorMessage
            
            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() did not correctly assign the test team to the test course!"
            assert teams.__len__() == 1, errorMessage

            teams = get_team_by_course_id(result["course_id"])
            team_users = get_team_users_by_team_id(teams[0].team_id)

            errorMessage = "teamcsvToDB() did not correctly assign the test student to the test team!"
            assert team_users.__len__() == 1, errorMessage

            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise

# test_wrong_file_type_error()
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the WrongFileType.pdf file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts Wrong FileType error is returned because the teamcsvfile has the .pdf extension and not .csv
def test_wrong_file_type_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            try: 
                message = teamImport.teamcsvToDB(
                    retrieveFilePath(
                        "WrongFileType.pdf"
                    ),
                    result["admin_id"],
                    result["course_id"]
                )

            except Exception as e: 
                assert isinstance(e, WrongExtension)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage
            
            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_file_not_found_error()
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the NonExistentFile.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts File Not Found error is returned because the teamcsvfile path does not exist
def test_file_not_found_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            try: 
                message = teamImport.teamcsvToDB(
                    retrieveFilePath(
                        "NonExistentFile.csv"
                    ),
                    result["admin_id"],
                    result["course_id"]
                )

            except Exception as e: 
                assert isinstance(e, FileNotFoundError)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage
            
            deleteOneAdminTAStudentCourse(result)

        except:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise

# test_misformatting_TA_email_error()
#   - calls createOneAdminTAStudentCourse() with one parameter:
#       - the course does use TAs (True)
#   - creates a new admin, ta, student, and course
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the oneTeamMisformattedTAStudent.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts Misformatting error is returned because there is a missing @ from the TA email!
def test_misformatting_TA_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            try:
                message = teamImport.teamcsvToDB(
                    retrieveFilePath(
                        "oneTeamMisformattedTAStudent.csv"
                    ),
                    result["admin_id"],
                    result["course_id"]
                )

            except Exception as e: 
                assert isinstance(e, SuspectedMisformatting)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage

            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_misformatting_student_email_error()
#   - calls createOneAdminTAStudentCourse() with one parameter:
#       - the course does not use TAs (False)
#   - creates a new admin, student, and course
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the oneTeamMisformattedStudent.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts Misformatting error is returned because there is a missing @ from the student email!
def test_misformatting_student_email_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(False)
            try: 
                message = teamImport.teamcsvToDB(
                    retrieveFilePath(
                        "oneTeamMisformattedStudent.csv"
                    ),
                    result["admin_id"],
                    result["course_id"]
                )

            except Exception as e: 
                assert isinstance(e, SuspectedMisformatting)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage

            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_users_do_not_exist_error()
#   - calls createOneAdminTAStudentCourse() with one parameter:
#       - the course does use TAs (True)
#   - creates a new admin, ta, student, and course
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the oneTeamNonExistingTAStudent.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts User does not exist error is returned because the ta email does not exist!
def test_users_do_not_exist_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            try:
                message = teamImport.teamcsvToDB(
                    retrieveFilePath(
                        "oneTeamNonExistingTAStudent.csv"
                    ),
                    result["admin_id"],
                    result["course_id"]
                )

            except Exception as e:
                assert isinstance(e, UserDoesNotExist)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage

            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_TA_not_yet_added_error()
#   - calls createOneAdminTAStudentCourse() with two parameter:
#       - the course does use TAs (True)
#       - unenroll the test TA (True)
#   - creates a new admin, ta, student, and course
#   - enrolls only the test student in the course
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the oneTeamTAStudent.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts TA Not Yet Added to the Course error is returned because the ta is not added to the course!
def test_TA_not_yet_added_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(True, True)

            try:
                message = teamImport.teamcsvToDB(
                    retrieveFilePath(
                        "oneTeamTAStudent.csv"
                    ),
                    result["admin_id"],
                    result["course_id"]
                )
                assert False
            except Exception as e: 
                assert isinstance(e, TANotYetAddedToCourse)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage

            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_student_not_enrolled_in_this_course()
#   - calls createOneAdminTAStudentCourse() with three parameter:
#       - the course does use TAs (True)
#       - do not unenroll the test ta (False)
#       - unenroll the test student (True)
#   - creates a new admin, ta, student, and course
#   - enrolls only the test ta in the course
#   - calls teamscsvToDB() with three parameters:
#       - the retrieved file path to the oneTeamTAStudent.csv file
#       - the id of the test teacher (owner_id)
#       - the id of the test course (course_id)
#   - asserts Student Not Enrolled In This Course error is returned because the test student is not enrolled in the course
def test_student_not_enrolled_in_this_course(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(True, False, True)
            try: 
                message = teamImport.teamcsvToDB(
                    retrieveFilePath(
                        "oneTeamTAStudent.csv"
                    ),
                    result["admin_id"],
                    result["course_id"]
                )

            except Exception as e:
                assert isinstance(e, StudentNotEnrolledInThisCourse)

            teams = get_team_by_course_id(result["course_id"])

            errorMessage = "teamcsvToDB() should not assign a test team to a test course!"
            assert teams.__len__() == 0, errorMessage

            deleteOneAdminTAStudentCourse(result)

        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

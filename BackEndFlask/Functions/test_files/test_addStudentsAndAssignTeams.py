from Functions.customExceptions import *
from Functions.addStudentsAndAssignTeams import student_and_team_to_db
from population_functions import *
import os

# def retrieveFilePath(fileName):
#     return os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")+ os.path.join(os.path.sep, "addStudentsAndAssignTeams-files") + os.path.join(os.path.sep, fileName)
# 
# # test_wrong_extention_error
# #   - ensures that student_and_team_to_db
# #       - returns an error if given the incorrect file type
# def test_should_fail_with_wrong_extention_error(flask_app_mock):
#     with flask_app_mock.app_context():
#         f = "test_file.txt"
#         result = student_and_team_to_db(f, 0, 0)
#         errorMessage = "student_team_to_db() did not correctly return WrongExtension.error"
#         assert result == WrongExtension.error, errorMessage
# 
# def test_should_fail_with_file_not_found_error_given_non_existent_file(flask_app_mock):
#     with flask_app_mock.app_context():
#         result = student_and_team_to_db("this_shouldn't_exist.csv", 0, 0)
#         errorMessage = "student_team_to_db() did not correctly return FileNotFound.error"
#         assert result == FileNotFound.error, errorMessage
# 
# def test_should_fail_with_suspected_misformatting_error_given_misformatted_ta_email(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()
#             testResult = student_and_team_to_db(retrieveFilePath("f-add-3-people-misformatted-ta-email.csv"), result["user_id"], result["course_id"])
#             errorMessage = "student_team_to_db() did not correctly return SuspectedMisformatting.error"
#             assert testResult == SuspectedMisformatting.error, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise
# 
# def test_should_fail_with_suspected_misformatting_error_given_misformatted_student_email(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()
#             testResult = student_and_team_to_db(retrieveFilePath("f-add-3-people-misformatted-student-email.csv"), result["user_id"], result["course_id"])
#             errorMessage = "student_team_to_db() did not correctly return SuspectedMisformatting.error"
#             assert testResult == SuspectedMisformatting.error, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise
# 
# def test_should_pass_given_given_valid_file_of_1_student_with_lms_id(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()
#             testResult = student_and_team_to_db(retrieveFilePath("s-add-1-person.csv"), result["user_id"], result["course_id"])
#             user = get_user_by_email("teststudent1@gmail.com")
# 
#             assert user is not str
#             print(f"TESTRESULT: {testResult}")
#             assert testResult is None
# 
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise
# 
# def test_should_pass_given_valid_file_of_3_students_with_lmsID(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()
#             testResult = student_and_team_to_db(retrieveFilePath("s-add-3-people.csv"), result["user_id"], result["course_id"])
#             user1 = get_user_by_email("teststudent1@gmail.com")
#             user2 = get_user_by_email("teststudent2@gmail.com")
#             user3 = get_user_by_email("teststudent3@gmail.com")
#             if user1 is str or user2 is str or user3 is str:
#                 errorMessage = "student_team_to_db() did not correctly insert a user into the database!"
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise
# 
# def test_should_pass_given_valid_file_of_3_students_with_no_lmsID(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()
#             testResult = student_and_team_to_db(retrieveFilePath("s-add-3-people-no-lmsID.csv"), result["user_id"], result["course_id"])
#             user1 = get_user_by_email("teststudent1@gmail.com")
#             user2 = get_user_by_email("teststudent2@gmail.com")
#             user3 = get_user_by_email("teststudent3@gmail.com")
#             if user1 is str or user2 is str or user3 is str:
#                 errorMessage = "student_team_to_db() did not correctly insert a user into the database!"
#                 print(f"user1 = {user1}")
#                 print(f"user2 = {user2}")
#                 print(f"user3 = {user3}")
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise
# 
# def test_should_pass_given_valid_file_of_3_valid_students_with_one_missing_lmsID(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()
#             testResult = student_and_team_to_db(retrieveFilePath("s-add-3-people-one-missing-lmsID.csv"), result["user_id"], result["course_id"])
#             user1 = get_user_by_email("teststudent1@gmail.com")
#             user2 = get_user_by_email("teststudent2@gmail.com")
#             user3 = get_user_by_email("teststudent3@gmail.com")
#             if user1 is str or user2 is str or user3 is str:
#                 errorMessage = "student_team_to_db() did not correctly insert a user into the database!"
#                 print(f"user1 = {user1}")
#                 print(f"user2 = {user2}")
#                 print(f"user3 = {user3}")
#             # if user1 == str(SQLAlchemyError.__dict__['orig']) or user2 == str(SQLAlchemyError.__dict__['orig']) or user3 == str(SQLAlchemyError.__dict__['orig']):
#             #     errorMessage = "student_team_to_db() did not correctly insert a user into the database!"
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise 
# 
# def test_should_pass_given_valid_file_of_5_students(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()
#             testResult = student_and_team_to_db(retrieveFilePath("s-add-5-people.csv"), result["user_id"], result["course_id"])
# 
#             # DEBUG
#             team = get_team_by_course_id(result["course_id"])
#             print(f"<--- TEAM: {team} --->")
#             print(f"<--- testResult: {testResult} --->")
#             # END DEBUG
# 
#             team_id = get_team_user_recently_added().team_id
#             errorMessage = "student_team_to_db() did not correctly insert a user into the database!"
#             assert get_team_users_by_team_id(team_id).__len__() == 5, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage 
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage 
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise
# 
# def test_should_fail_with_not_enough_columns_error(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()           
#             testResult = student_and_team_to_db(retrieveFilePath("f-missing-ta-email.csv"), result["user_id"], result["course_id"])
#             errorMessage = "student_team_to_db() did not correctly return NotEnoughColumns.error"
#             assert testResult == NotEnoughColumns.error, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise 
# 
# 
# def test_should_fail_with_suspected_misformatting_error(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()           
#             testResult = student_and_team_to_db(retrieveFilePath("f-add-3-people-one-missing-name.csv"), result["user_id"], result["course_id"])
#             errorMessage = f"student_team_to_db() did not correctly return SuspectedMisformatting.error"
#             assert testResult == SuspectedMisformatting.error, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage            
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise 
# 
# def test_should_fail_with_too_many_columns_error(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()           
#             testResult = student_and_team_to_db(retrieveFilePath("f-add-2-ta-emails.csv"), result["user_id"], result["course_id"])
#             errorMessage = "student_team_to_db() did not correctly return TooManyColumns.error"
#             assert testResult == TooManyColumns.error, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise 
# 
# def test_should_prove_rollback_functions_properly(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()           
#             testResult = student_and_team_to_db(retrieveFilePath("f-rollback-students.csv"), result["user_id"], result["course_id"])
#             errorMessage = "student_and_team_to_db() did not rollback properly!"
#             print(f'<-- testResult {testResult}')
#             assert get_users().__len__() == 4 and get_user_courses().__len__() == 2 and get_team_users().__len__() == 0 and get_teams().__len__() == 0, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage       
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage       
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise 
# 
# def test_should_pass_given_valid_file_of_10_students(flask_app_mock):
#     with flask_app_mock.app_context():
#         try:
#             result = createOneAdminTAStudentCourse()           
#             testResult = student_and_team_to_db(retrieveFilePath("s-add-10-people.csv"), result["user_id"], result["course_id"])
#             team_id = get_team_user_recently_added().team_id
#             errorMessage = "student_team_to_db() did not correctly insert a user into the database!"
#             assert get_team_users_by_team_id(team_id).__len__() == 10, errorMessage
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage       
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#         except:
#             errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
#             assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
#             errorMessage = "deleteTestData() encountered an unexpected error!"
#             assert type(deleteTestData(result)), errorMessage       
#             errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
#             assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
#             raise 

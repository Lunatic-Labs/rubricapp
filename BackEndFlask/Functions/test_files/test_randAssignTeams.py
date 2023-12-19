from Functions.customExceptions import *
from population_functions import *
from models.team import *
from models.user import *
from models.team_user import *
from Functions.randAssign import RandomAssignTeams

# test_one_ta_ten_students()
#   - ensures that RandomAssignTeams():
#       - creates 3 teams
#       - assigns no more that 4 students to those teams
#       - assigns all of the 10 students to a team
#       - assigns the test ta to all the teams
def test_one_ta_ten_students(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            students = createUsers(result["course_id"], result["admin_id"], 10)

            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )
            randomAssignTeamsCreated = get_team_by_course_id(result["course_id"])
            
            errorMessage = "RandomAssignTeams() did not correctly create and assign 3 teams"
            assert randomAssignTeamsCreated.__len__() == 3, errorMessage

            total_team_users = 0
            teams = []
            for team in randomAssignTeamsCreated:
                teams.append(team)
                team_users = get_team_users_by_team_id(team.team_id)
                
                errorMessage = "RandomAssignTeams() did not correctly assign a max size per team of 4 students"
                assert team_users.__len__() <= 4, errorMessage
                
                total_team_users += team_users.__len__()
                
            errorMessage = "RandomAssignTeams() did not correctly assign all 10 test students to 3 teams!"
            assert total_team_users == 10, errorMessage

            errorMessage = "RandomAssignTeams() did not correctly assing the test ta to all the 3 teams!"
            assert userIsOnlyAssignedToTeams(result["observer_id"], teams), errorMessage
            
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteUsers(students)
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteUsers(students)
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_no_ta_ten_students()
#   - ensures that RandomAssignTeams():
#   - creates 3 teams
#   - assigns no more that 4 students to those teams
#   - assigns all of the 10 students to a team
#   - assigns the test teacher to all the teams
def test_no_ta_ten_students(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(False)
            students = createUsers(result["course_id"], result["admin_id"], 10)
            
            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )
            
            randomAssignTeamsCreated = get_team_by_course_id(result["course_id"])
            
            errorMessage = "RandomAssignTeams() did not correctly create and assign 3 teams"
            assert randomAssignTeamsCreated.__len__() == 3, errorMessage

            total_team_users = 0
            teams = []
            for team in randomAssignTeamsCreated:
                teams.append(team)
                team_users = get_team_users_by_team_id(team.team_id)
            
                errorMessage = "RandomAssignTeams() did not correctly assign a max size per team of 4 students"
                assert team_users.__len__() <= 4, errorMessage
            
                total_team_users += team_users.__len__()
            
            errorMessage = "RandomAssignTeams() did not correctly assign all 10 test students to 3 teams!"
            assert total_team_users == 10, errorMessage

            errorMessage = "RandomAssignTeams() did not correctly assing the test ta to all the 3 teams!"
            assert userIsOnlyAssignedToTeams(result["observer_id"], teams), errorMessage
            
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteUsers(students)
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result, False)
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteUsers(students)
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result, False)
            raise e

# test_ten_tas_ten_students()
#   - ensures that RandomAssignTeams():
#       - creates 10 teams
#       - assigns all of the 10 tas to a team
#       - assigns no more that 1 student to each team
#       - assigns all of the 10 students to a team
def test_ten_tas_ten_students(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse()
            tas = createUsers(result["course_id"], result["admin_id"], 10, 4)
            students = createUsers(result["course_id"], result["admin_id"], 10)
           
            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"],
                1
            )
            user_courses = get_user_courses_by_course_id(result["course_id"])
            all_tas = filter_users_by_role(user_courses, 4)
            teams = get_team_by_course_id(result["course_id"])
            
            errorMessage = "RandomAssignTeams() did not correctly create and assign 10 teams"
            assert teams.__len__() == 10, errorMessage
            
            total_team_users = 0
            for team in teams:
                errorMessage = "RandomAssignTeams() did not correctly assign a ta to a team!"
                assert taIsAssignedToTeam(all_tas, team), errorMessage
                
                team_users = get_team_users_by_team_id(team.team_id)
                
                errorMessage = "RandomAssignTeams() did not correctly assign a max size per team of 1 student"
                assert team_users.__len__() == 1, errorMessage
                total_team_users += team_users.__len__()
            
            errorMessage = "RandomAssignTeams() did not correctly assign all 10 test students to 10 teams!"
            assert total_team_users == 10, errorMessage
            
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteUsers(tas)
            deleteUsers(students)
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteUsers(tas)
            deleteUsers(students)
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_TA_true_but_no_TAs_recorded_error()
#   - ensures that RandomAssignTeams():
#       - returns the error that no tas were listed
#           because no test tas where enrolled in the test course
def test_TA_true_but_no_TAs_recorded_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(True, True)
            try: 
                random = RandomAssignTeams(
                    result["observer_id"],
                    result["course_id"]
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, NoTAsListed), f"Expected NoTAsListed, got {e}"
            
            teams = get_team_by_course_id(result["course_id"])
            
            errorMessage = "RandomAssignTeams() should not have made and enrolled any test teams in the test course!"
            assert teams.__len__() == 0, errorMessage
            
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
        except Exception as e:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise e

# test_no_students_in_course_error()
#   - ensures that RandomAssignTeams():
#       - returns the error that no students were found
#           because no students where enrolled in the test course
def test_no_students_in_course_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(True, False, True)

            try: 
                random = RandomAssignTeams(
                    result["observer_id"],
                    result["course_id"]
                )
                assert False, "Should not reach this line"
            except Exception as e: 
                assert isinstance(e, NoStudentsInCourse), f"Expected NoStudentsInCourse but got {e}"

            deleteAllTeamsTeamMembers(result["course_id"])
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
        except:
            deleteAllTeamsTeamMembers(result["course_id"])
            deleteAllUsersUserCourses(result["course_id"])
            deleteOneAdminTAStudentCourse(result)
            raise
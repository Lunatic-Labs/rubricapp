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
            errorMessage = "createOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            students = createUsers(result["course_id"], result["admin_id"], 10)
            errorMessage = "createUsers() encountered an unexpected error!"
            assert type(students) is not type(""), errorMessage
            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )
            errorMessage = "RandomAssignTeams() encountered an unexpected error!"
            assert type(random) is not type(""), errorMessage
            teams = get_team_by_course_id(result["course_id"])
            errorMessage = "get_team_by_course_id() encountered an unexpected error!"
            assert type(teams) is not type(""), errorMessage
            errorMessage = "RandomAssignTeams() did not correctly create and assign 3 teams"
            assert teams.__len__() == 3, errorMessage
            total_team_users = 0
            teams = []
            for team in teams:
                errorMessage = "get_team() encountered an unexpected error!"
                assert type(team) is not type(""), errorMessage
                teams.append(team)
                team_users = get_team_users_by_team_id(team.team_id)
                errorMessage = "get_team_users_by_team_id() encountered an unexpected error!"
                assert type(team_users) is not type(""), errorMessage
                errorMessage = "RandomAssignTeams() did not correctly assign a max size per team of 4 students"
                assert team_users.__len__() <= 4, errorMessage
                total_team_users += team_users.__len__()
            errorMessage = "RandomAssignTeams() did not correctly assign all 10 test students to 3 teams!"
            assert total_team_users == 10, errorMessage
            errorMessage = "RandomAssignTeams() did not correctly assing the test ta to all the 3 teams!"
            assert userIsOnlyAssignedToTeams(result["observer_id"], teams), errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(students)) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(students)) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise

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
            errorMessage = "createOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            students = createUsers(result["course_id"], result["admin_id"], 10)
            errorMessage = "createUsers() encountered an unexpected error!"
            assert type(students) is not type(""), errorMessage
            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )
            errorMessage = "RandomAssignTeams() encountered an unexpected error!"
            assert type(random) is not type(""), errorMessage
            teams = get_team_by_course_id(result["course_id"])
            errorMessage = "get_team_by_course_id() encountered an unexpected error!"
            assert type(teams) is not type(""), errorMessage
            errorMessage = "RandomAssignTeams() did not correctly create and assign 3 teams"
            assert teams.__len__() == 3, errorMessage
            total_team_users = 0
            teams = []
            for team in teams:
                assert type(team) is not type(""), errorMessage
                teams.append(team)
                team_users = get_team_users_by_team_id(team.team_id)
                errorMessage = "get_team_users_by_team_id() encountered an unexpected error!"
                assert type(team_users) is not type(""), errorMessage
                errorMessage = "RandomAssignTeams() did not correctly assign a max size per team of 4 students"
                assert team_users.__len__() <= 4, errorMessage
                total_team_users += team_users.__len__()
            errorMessage = "RandomAssignTeams() did not correctly assign all 10 test students to 3 teams!"
            assert total_team_users == 10, errorMessage
            errorMessage = "RandomAssignTeams() did not correctly assing the test ta to all the 3 teams!"
            assert userIsOnlyAssignedToTeams(result["observer_id"], teams), errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(students)) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result, False)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(students)) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result, False)) is not type(""), errorMessage
            raise

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
            errorMessage = "createOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            tas = createUsers(result["course_id"], result["admin_id"], 10, 4)
            errorMessage = "createUsers() encountered an unexpected error!"
            assert type(tas) is not type(""), errorMessage
            students = createUsers(result["course_id"], result["admin_id"], 10)
            errorMessage = "createUsers() encountered an unexpected error!"
            assert type(students) is not type(""), errorMessage
            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"],
                1
            )
            errorMessage = "RandomAssignTeams() encountered an unexpected error!"
            assert type(random) is not type(""), errorMessage
            user_courses = get_user_courses_by_course_id(result["course_id"])
            errorMessage = "get_user_courses_by_course_id() encountered an unexepected error!"
            assert type(user_courses) is not type(""), errorMessage
            all_tas = filter_users_by_role(user_courses, 4)
            errorMessage = "filter_users_by_role() encountered an unexpected error!"
            assert type(all_tas) is not type(""), errorMessage
            teams = get_team_by_course_id(result["course_id"])
            errorMessage = "get_team_by_course_id() encountered an unexpected error!"
            assert type(teams) is not type(""), errorMessage
            errorMessage = "RandomAssignTeams() did not correctly create and assign 10 teams"
            assert teams.__len__() == 10, errorMessage
            total_team_users = 0
            for team in teams:
                errorMessage = "RandomAssignTeams() did not correctly assign a ta to a team!"
                assert taIsAssignedToTeam(all_tas, team), errorMessage
                team_users = get_team_users_by_team_id(team.team_id)
                errorMessage = "get_team_users_by_team_id() encountered an unexpected error!"
                assert type(team_users) is not type(""), errorMessage
                errorMessage = "RandomAssignTeams() did not correctly assign a max size per team of 1 student"
                assert team_users.__len__() == 1, errorMessage
                total_team_users += team_users.__len__()
            errorMessage = "RandomAssignTeams() did not correctly assign all 10 test students to 10 teams!"
            assert total_team_users == 10, errorMessage
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(tas)) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(students)) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(tas)) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(students)) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise

# test_TA_true_but_no_TAs_recorded_error()
#   - ensures that RandomAssignTeams():
#       - returns the error that no tas were listed
#           because no test tas where enrolled in the test course
def test_TA_true_but_no_TAs_recorded_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(True, True)
            errorMessage = "createOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )
            errorMessage = "RandomAssignTeams() encountered an unexpected error!"
            assert random is NoTAsListed.error
            teams = get_team_by_course_id(result["course_id"])
            errorMessage = "get_team_by_course_id() encountered an unexpected error!"
            assert type(teams) is not type(""), errorMessage
            errorMessage = "RandomAssignTeams() should not have made and enrolled any test teams in the test course!"
            assert teams.__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(random["students"])) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise

# test_no_students_in_course_error()
#   - ensures that RandomAssignTeams():
#       - returns the error that no students were found
#           because no students where enrolled in the test course
def test_no_students_in_course_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = createOneAdminTAStudentCourse(True, False, True)
            errorMessage = "createOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(result) is not type(""), errorMessage
            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )
            errorMessage = "RandomAssignTeams() encountered an unexpected error!"
            assert random is NoStudentsInCourse.error
            teams = get_team_by_course_id(result["course_id"])
            errorMessage = "get_team_by_course_id() encountered an unexpected error!"
            assert type(teams) is not type(""), errorMessage
            errorMessage = "RandomAssignTeams() should not have made and enrolled any test teams in the test course!"
            assert teams.__len__() == 0, errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
        except:
            errorMessage = "deleteAllTeamsTeamMembers() encountered an unexpected error!"
            assert type(deleteAllTeamsTeamMembers(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteUsers() encountered an unexpected error!"
            assert type(deleteUsers(random["students"])) is not type(""), errorMessage
            errorMessage = "deleteAllUsersUserCourses() encountered an unexpected error!"
            assert type(deleteAllUsersUserCourses(result["course_id"])) is not type(""), errorMessage
            errorMessage = "deleteOneAdminTAStudentCourse() encountered an unexpected error!"
            assert type(deleteOneAdminTAStudentCourse(result)) is not type(""), errorMessage
            raise
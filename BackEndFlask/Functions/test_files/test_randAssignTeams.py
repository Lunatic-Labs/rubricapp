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
            result = create_one_admin_ta_student_course()
            students = create_users(result["course_id"], result["admin_id"], 10)

            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )
            random_assign_teams_created = get_team_by_course_id(result["course_id"])

            error_message = "RandomAssignTeams() did not correctly create and assign 3 teams"
            assert random_assign_teams_created.__len__() == 3, error_message

            total_team_users = 0
            teams = []
            for team in random_assign_teams_created:
                teams.append(team)
                team_users = get_team_users_by_team_id(team.team_id)

                error_message = "RandomAssignTeams() did not correctly assign a max size per team of 4 students"
                assert team_users.__len__() <= 4, error_message

                total_team_users += team_users.__len__()

            error_message = "RandomAssignTeams() did not correctly assign all 10 test students to 3 teams!"
            assert total_team_users == 10, error_message

            error_message = "RandomAssignTeams() did not correctly assing the test ta to all the 3 teams!"
            assert user_is_only_assigned_to_teams(result["observer_id"], teams), error_message
            
            delete_all_teams_team_members(result["course_id"])
            delete_users(students)
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)

        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_users(students)
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)
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
            result = create_one_admin_ta_student_course(False)
            students = create_users(result["course_id"], result["admin_id"], 10)

            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"]
            )

            random_assign_teams_created = get_team_by_course_id(result["course_id"])

            error_message = "RandomAssignTeams() did not correctly create and assign 3 teams"
            assert random_assign_teams_created.__len__() == 3, error_message

            total_team_users = 0
            teams = []
            for team in random_assign_teams_created:
                teams.append(team)
                team_users = get_team_users_by_team_id(team.team_id)

                error_message = "RandomAssignTeams() did not correctly assign a max size per team of 4 students"
                assert team_users.__len__() <= 4, error_message

                total_team_users += team_users.__len__()

            error_message = "RandomAssignTeams() did not correctly assign all 10 test students to 3 teams!"
            assert total_team_users == 10, error_message

            error_message = "RandomAssignTeams() did not correctly assing the test ta to all the 3 teams!"
            assert user_is_only_assigned_to_teams(result["observer_id"], teams), error_message

            delete_all_teams_team_members(result["course_id"])
            delete_users(students)
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result, False)

        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_users(students)
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result, False)
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
            result = create_one_admin_ta_student_course()
            tas = create_users(result["course_id"], result["admin_id"], 10, 4)
            students = create_users(result["course_id"], result["admin_id"], 10)

            random = RandomAssignTeams(
                result["observer_id"],
                result["course_id"],
                1
            )

            user_courses = get_user_courses_by_course_id(result["course_id"])
            all_tas = filter_users_by_role(user_courses, 4)
            teams = get_team_by_course_id(result["course_id"])
            
            error_message = "RandomAssignTeams() did not correctly create and assign 10 teams"
            assert teams.__len__() == 10, error_message

            total_team_users = 0
            for team in teams:
                error_message = "RandomAssignTeams() did not correctly assign a ta to a team!"
                assert ta_is_assigned_to_team(all_tas, team), error_message

                team_users = get_team_users_by_team_id(team.team_id)

                error_message = "RandomAssignTeams() did not correctly assign a max size per team of 1 student"
                assert team_users.__len__() == 1, error_message
                total_team_users += team_users.__len__()

            error_message = "RandomAssignTeams() did not correctly assign all 10 test students to 10 teams!"
            assert total_team_users == 10, error_message

            delete_all_teams_team_members(result["course_id"])
            delete_users(tas)
            delete_users(students)
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)

        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_users(tas)
            delete_users(students)
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)
            raise e

# test_TA_true_but_no_TAs_recorded_error()
#   - ensures that RandomAssignTeams():
#       - returns the error that no tas were listed
#           because no test tas where enrolled in the test course
def test_TA_true_but_no_TAs_recorded_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course(True, True)
            try: 
                random = RandomAssignTeams(
                    result["observer_id"],
                    result["course_id"]
                )
                assert False, "Should not reach this line"

            except Exception as e: 
                assert isinstance(e, NoTAsListed), f"Expected NoTAsListed, got {e}"

            teams = get_team_by_course_id(result["course_id"])

            error_message = "RandomAssignTeams() should not have made and enrolled any test teams in the test course!"
            assert teams.__len__() == 0, error_message

            delete_all_teams_team_members(result["course_id"])
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)

        except Exception as e:
            delete_all_teams_team_members(result["course_id"])
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)
            raise e

# test_no_students_in_course_error()
#   - ensures that RandomAssignTeams():
#       - returns the error that no students were found
#           because no students where enrolled in the test course
def test_no_students_in_course_error(flask_app_mock):
    with flask_app_mock.app_context():
        try:
            result = create_one_admin_ta_student_course(True, False, True)

            try:
                random = RandomAssignTeams(
                    result["observer_id"],
                    result["course_id"]
                )
                assert False, "Should not reach this line"

            except Exception as e: 
                assert isinstance(e, NoStudentsInCourse), f"Expected NoStudentsInCourse but got {e}"

            delete_all_teams_team_members(result["course_id"])
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)

        except:
            delete_all_teams_team_members(result["course_id"])
            delete_all_users_user_courses(result["course_id"])
            delete_one_admin_ta_student_course(result)
            raise
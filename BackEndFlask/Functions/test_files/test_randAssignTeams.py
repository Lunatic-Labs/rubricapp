from population_functions import create_test_user_course
from models.team import get_team, get_teams, get_teams_by_observer_id
from models.user import get_users_by_role_id, update_user_consent, get_user_consent
from models.team_user import get_team_users, get_team_members, get_team_members_by_team_id
from randAssign import RandomAssignTeams

"""
    Ensures RandAssignTeams can
        - create appropriate number of teams given different sized rosters
        - properly create teams and assign students to them
        - assign TAs as observers to teams
        - returns errors when appropriate
"""

"""
test_small_roster_make_right_num_of_teams()
    - loads a total of 7 test students into the test course that does not use TAs
    - calls RandomAssignTeams() with the admin_id of 2 and the course_id of 1
    - asserts that there are 2 total teams in the Team table
"""
def test_small_roster_make_right_num_of_teams(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(7, False)
        RandomAssignTeams(2,1)
        assert get_teams().__len__() == 2

"""
test_teams_grouped_together_by_consent()
    - loads a total of 16 students in the test course that does not use TAs
    - updates even ID'd students' constents to True
    - calls RandomAssignTeams() with the admin_id of 2 and the course_id of 1
    - asserts that the the second team was populated by students whose consent is True
    - and that the thrid theam was populated by students whose consent was not True (Null or False)
"""
def test_teams_grouped_together_by_consent(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(16, False)
        for x in range(3, 18, 2):
            update_user_consent(x, True)
        RandomAssignTeams(2,1)
        teamTrueIsAllTrue = True
        teamNotTrueIsAllFalse = True
        teamTrue = get_team_members_by_team_id(2)
        for team in teamTrue:
            if get_user_consent(team.user_id) is not True:
                teamTrueIsAllTrue = False
        teamNotTrue = get_team_members_by_team_id(3)
        for team in teamNotTrue:
            if get_user_consent(team.user_id) == True:
                teamNotTrueIsAllFalse = False
    assert teamTrueIsAllTrue and teamNotTrueIsAllFalse
        

"""
test_large_roster_make_right_num_of_teams()
    - loads a total of 101 test students into the test course that does not use TAs
    - calls RandomAssignTeams() with the admin_id of 2 and the course_id of 1
    - asserts that there are 26 total teams in the Team table
"""
def test_large_roster_make_right_num_of_teams(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(101, False)
        RandomAssignTeams(2,1)
        assert get_teams().__len__() == 26

"""
test_small_team_size_all_students_assigned_to_a_team()
    - loads a total of 10 test students into the test course that does not use TAs
    - calls RandomAssignTeams() with the admin_id of 2 and the course_id of 1
    - asserts that each test student is randomly assigned to only one team in the TeamUser table
"""
def test_small_team_size_all_students_assigned_to_a_team(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(10, False)
        RandomAssignTeams(2,1)
        assert get_team_users().__len__() == 10

"""
test_TA_assignment()
    - loads a total of 13 test students into the test course that does use TAs
    - loads a total of 4 test TAs into the test course that does use TAs
    - calls RandomAssignTeams() with the admin_id of 2, and the course_id of 1
    - retrievies the user_id of all the inserted test TAs
    - asserts that each TA is assigned to one random team
"""
def test_TA_assignment(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(13, True, 4)
        RandomAssignTeams(2, 1)
        for TA in get_users_by_role_id(4):
            assert get_teams_by_observer_id(TA.user_id).__len__() == 1

"""
test_TA_true_but_no_TAs_recorded_error()
    - loads a total of 13 test students into the test course that uses TAs
    - loads a total of 0 test TAs into the test course that uses TAs
    - calls RandomAssignTeams() with the admin_id of 2 and the course_id of 1
    - asserts that when calling RandomAssignTeams(), an error message is returned
        because no TAs were specified but the test course was specified to use TAs
"""
def test_TA_true_but_no_TAs_recorded_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(13, True, 0)
        assert RandomAssignTeams(2, 1) == "Course uses TAs, but no TAs associated with this course were found.Please assign your TAs or mark course as 'not using TAs'"

"""
test_no_students_in_course_error()
    - loads a total of 0 test students into the test course that does not use TAs
    - calls RandomAssignTeams() with the admin_id of 2 and the course_id of 1
    - asserts that when calling RandomAssignTeams(), an error message is returned
        because no students were specified
"""
def test_no_students_in_course_error(flask_app_mock):
    with flask_app_mock.app_context():
        create_test_user_course(0, False)
        assert RandomAssignTeams(2, 1) == "No students are associated with this course."
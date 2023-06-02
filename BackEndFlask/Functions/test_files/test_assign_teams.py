from randAssign import *
from models.schemas import *
from models.user_course import *
from models.team import *

"""
    Ensures RandAssignTeams can
        - create appropriate number of teams given different sized rosters
        - properly create teams and assign students to them
        - assign TAs as observers to teams
        - returns errors when appropriate
"""

def test_small_roster_make_right_num_of_teams(flask_app_mock):
    with flask_app_mock.app_context():
        numofStudents = 7
        create_test_user_course(numofStudents,False)
        RandomAssignTeams(2,1)
        numofTeams = Team.query.count()
    assert numofTeams == 2

def test_large_roster_make_right_num_of_teams(flask_app_mock):
    with flask_app_mock.app_context():
        numOfStudents = 101
        create_test_user_course(numOfStudents, False)
        RandomAssignTeams(2,1)
        numofTeams = Team.query.count()
    assert numofTeams == 26

def test_small_team_size_all_students_assigned_to_a_team(flask_app_mock):
    with flask_app_mock.app_context():
        numOfStudents = 10
        create_test_user_course(numOfStudents, False)
        RandomAssignTeams(2,1)
        numOfTeamUserRelations = TeamUser.query.count()
    assert numOfTeamUserRelations == numOfStudents

def test_TA_assignemnt(flask_app_mock):
    with flask_app_mock.app_context():
        numOfStudents = 13
        numOfTAs = 4
        create_test_user_course(numOfStudents, True, numOfTAs)
        RandomAssignTeams(2, 1)
        # gather user_ids of users with TA role
        TAs = Users.query.filter(Users.role_id==4).all()
        TAids = [0]*4
        bools = [False, False, False, False]
        counter=0
        for ta in TAs:
            TAids[counter] = ta.user_id
            counter+=1
        teams = Team.query.all()
        # Check that each TA is assigned to a team
        for team in teams:
            for x in range(4):
                if TAids[x]==team.observer_id:
                    bools[x] = True
        assert bools[0] and bools[1] and bools[2] and bools[3]
        
def test_TA_true_but_no_TAs_recorded_error(flask_app_mock):
    with flask_app_mock.app_context():
        numOfStudents = 13
        numOfTAs = 0
        create_test_user_course(numOfStudents, True, numOfTAs)
        assert RandomAssignTeams(2, 1) == "Course uses TAs, but no TAs associated with this course were found.Please assign your TAs or mark course as 'not using TAs'"

def test_no_students_in_course_error(flask_app_mock):
    with flask_app_mock.app_context():
        numOfStudents = 0
        create_test_user_course(numOfStudents, False)
        assert RandomAssignTeams(2, 1) == "No students are associated with this course."
from randAssign import *
from models.schemas import *
from models.user_course import *
from models.team import *

def test_randAssignment(flask_app_mock):
    with flask_app_mock.app_context():
        RandomAssignTeams(1,1)
        user_courses = UserCourse.query.all()
        teams = Team.query.all()
        # print(teams)
        # for team in teams:
            # print(TeamUser.query.filter(TeamUser.team_id==team.team_id).count())
        # for thing in user_courses:
            # print(thing)
    assert user_courses
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import TeamUser

class InvalidTeamUserCombo(Exception):
    "Raised when team_id-user_id combination does not exist!!!"
    pass

def get_team_users():
    try:
        return TeamUser.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_team_user(team_id, user_id):
    try:
        one_team_user = TeamUser.query.filter((TeamUser.team_id == team_id) & (TeamUser.user_id==user_id)).first()
        if(type(one_team_user) == type(None)):
            raise InvalidTeamUserCombo
        return one_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamUserCombo:
        error = "Invalid team_id-user_id combination, team_id-user_id combination does not exist!"
        return error
    
def create_team_user(teamuser):
    try:
        new_team_id = teamuser[0]
        new_user_id = teamuser[1]
        new_team_user = TeamUser(team_id=new_team_id, user_id=new_user_id)
        db.session.add(new_team_user)
        db.session.commit()
        return new_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_team_user(teamuser, team_id, user_id):
    try:
        one_team_user = TeamUser.query.filter((TeamUser.team_id == team_id) & (TeamUser.user_id==user_id)).first()
        if(type(one_team_user) == type(None)):
            raise InvalidTeamUserCombo
        one_team_user.team_id = teamuser[0]
        one_team_user.user.id = teamuser[1]
        db.session.commit()
        return one_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamUserCombo:
        error = "Invalid team_id-user_id combination, team_id-user_id combination does not exist!"
        return error
    
"""
Delete is meant for the summer semester!!!
"""
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import TeamUser

class InvalidTeamUserID(Exception):
    "Raised when team_user_id does not exist!!!"
    pass

def get_team_users():
    try:
        return TeamUser.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_team_user(team_user_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id = team_user_id).first()
        if one_team_user is None:
            raise InvalidTeamUserID
        return one_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamUserID:
        error = "Invalid team_user_id, team_user_id does not exist!"
        return error

def get_team_members(team_user_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id=team_user_id).first()
        if one_team_user is None:
            raise InvalidTeamUserID
        all_team_members = TeamUser.query.filter_by(team_id = one_team_user.team_id).all()
        return all_team_members
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamUserID:
        error = "Invalid team_user_id, team_user_id does not exist!"
        return error
    
def create_team_user(teamuser_data):
    try:
        new_team_user = TeamUser(team_id=teamuser_data["team_id"], user_id=teamuser_data["user_id"])
        db.session.add(new_team_user)
        db.session.commit()
        return new_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_team_user(teamuser, team_user_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id=team_user_id).first()
        if one_team_user is None:
            raise InvalidTeamUserID
        one_team_user.team_id = teamuser["team_id"]
        one_team_user.user_id = teamuser["user_id"]
        db.session.commit()
        return one_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamUserID:
        error = "Invalid team_user_id, team_user_id does not exist!"
        return error
    
"""
Delete is meant for the summer semester!!!
"""
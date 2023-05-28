from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import TeamUser

class InvalidTUID(Exception):
    "Raised when tu_id does not exist!!!"
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
        if(type(one_team_user) == type(None)):
            raise InvalidTUID
        return one_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTUID:
        error = "Invalid tu_id, tu_id does not exist!"
        return error

def get_team_members(team_user_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id=team_user_id).first()
        if(type(one_team_user) == type(None)):
            raise InvalidTUID
        all_team_members = TeamUser.query.filter_by(team_id = one_team_user.team_id).all()
        return all_team_members
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTUID:
        error = "Invalid tu_id, tu_id does not exist!"
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

def replace_team_user(teamuser_data, tu_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id=team_user_id).first()
        if(type(one_team_user) == type(None)):
            raise InvalidTUID
        one_team_user.team_id = teamuser_data["team_id"]
        one_team_user.user.id = teamuser_data["user_id"]
        db.session.commit()
        return one_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTUID:
        error = "Invalid tu_id, tu_id does not exist!"
        return error
    
"""
Delete is meant for the summer semester!!!
"""
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
    
def get_team_user(tu_id):
    try:
        one_team_user = TeamUser.query.filter_by(tu_id=tu_id).first()
        if one_team_user is None:
            raise InvalidTUID
        return one_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTUID:
        error = "Invalid tu_id, tu_id does not exist!"
        return error
    
def create_team_user(teamuser):
    try:
        new_team_id = teamuser[0]
        new_user_id = teamuser[1]
        new_team_user = TeamUser(
            team_id=new_team_id,
            user_id=new_user_id
        )
        db.session.add(new_team_user)
        db.session.commit()
        return new_team_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_team_user(teamuser, tu_id):
    try:
        one_team_user = TeamUser.query.filter_by(tu_id=tu_id).first()
        if one_team_user is None:
            raise InvalidTUID
        one_team_user.team_id = teamuser[0]
        one_team_user.user.id = teamuser[1]
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
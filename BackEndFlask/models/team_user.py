from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import TeamUser
from models.logger import logger

class InvalidTeamUserID(Exception):
    def __init__(self):
        self.message = "Raised when team_user_id does not exist"

    def __str__(self):
        return self.message


def get_team_users():
    try:
        return TeamUser.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_team_user(team_user_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id = team_user_id).first()
        if one_team_user is None:
            raise InvalidTeamUserID
        return one_team_user
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidTeamUserID as e:
        logger.error(f"{str(e)} {team_user_id}")
        raise e


def get_team_user_by_user_id(user_id):
    try:
        one_team_user = TeamUser.query.filter_by(user_id = user_id).first()
        if one_team_user is None:
            raise InvalidTeamUserID
        return one_team_user
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidTeamUserID as e:
        logger.error(f"{str(e)} {user_id}")
        raise e


def get_team_user_recently_added():
    try:
        return TeamUser.query.order_by(TeamUser.team_user_id.desc()).first()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_team_users_by_team_id(team_id):
    try:
        all_team_users = TeamUser.query.filter_by(team_id=team_id).all()
        return all_team_users
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_team_members(team_user_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id=team_user_id).first()
        if one_team_user is None:
            logger.error(f"{team_user_id} does not exist")
            raise InvalidTeamUserID
        all_team_members = TeamUser.query.filter_by(team_id = one_team_user.team_id).all()
        return all_team_members
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidTeamUserID as e:
        logger.error(f"{str(e)} {team_user_id}")
        raise e


def create_team_user(teamuser_data):
    try:
        new_team_user = TeamUser(team_id=teamuser_data["team_id"], user_id=teamuser_data["user_id"])
        db.session.add(new_team_user)
        db.session.commit()
        return new_team_user
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


    # 4 % 3 = 1+1 = 2
    # 5 % 3 = 2+1 = 3
    # 6 % 3 = 0+1 = 1

    # 7 % 3 = 1+1 = 2
    # 8 % 3 = 2+1 = 3
    # 9 % 3 = 0+1 = 1

    # 10 % 3 = 1+1 = 2
    # 11 % 3 = 2+1 = 3
    # 12 % 3 = 0+1 = 1

    # 13 % 3 = 1+1 = 2
def load_demo_team_user():
    for user_id in range(4, 14):
        create_team_user({
            "team_id": (user_id%3)+1,
            "user_id": user_id
        })

def replace_team_user(teamuser, team_user_id):
    try:
        one_team_user = TeamUser.query.filter_by(team_user_id=team_user_id).first()
        if one_team_user is None:
            logger.error(f"{team_user_id} does not exist")
            raise InvalidTeamUserID

        one_team_user.team_id = teamuser["team_id"]
        one_team_user.user_id = teamuser["user_id"]
        db.session.commit()
        return one_team_user

    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidTeamUserID as e:
        logger.error(f"{str(e)} {team_user_id}")
        raise e


def delete_team_user(team_user_id):
    try:
        TeamUser.query.filter_by(team_user_id=team_user_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def delete_team_user_by_user_id_and_team_id(user_id, team_id):
    try:
        TeamUser.query.filter_by(user_id=user_id, team_id=team_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

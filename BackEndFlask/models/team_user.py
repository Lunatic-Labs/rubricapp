from core import db
from sqlalchemy import delete, select
from models.schemas import TeamUser
from models.utility import error_log

class InvalidTeamUserID(Exception):
    def __init__(self, id):
        self.message = f"Invalid team_user_id: {id}."

    def __str__(self):
        return self.message


@error_log
def get_team_users():
    return db.session.scalars(select(TeamUser)).all()

@error_log
def get_all_team_users():
    return db.session.scalars(select(TeamUser)).all()

@error_log
def get_team_user(team_user_id):
    one_team_user = db.session.scalars(select(TeamUser).filter_by(team_user_id = team_user_id).limit(1)).first()

    if one_team_user is None:
        raise InvalidTeamUserID(team_user_id)

    return one_team_user


@error_log
def get_team_user_by_user_id(user_id):
    one_team_user = db.session.scalars(select(TeamUser).filter_by(user_id = user_id).limit(1)).first()

    if one_team_user is None:
        raise InvalidTeamUserID(user_id)

    return one_team_user


@error_log
def get_team_user_recently_added():
    return db.session.scalars(select(TeamUser).order_by(TeamUser.team_user_id.desc()).limit(1)).first()


@error_log
def get_team_users_by_team_id(team_id):
    all_team_users = db.session.scalars(select(TeamUser).filter_by(team_id=team_id)).all()

    return all_team_users


@error_log
def get_team_members(team_user_id):
    one_team_user = db.session.scalars(select(TeamUser).filter_by(team_user_id=team_user_id).limit(1)).first()

    if one_team_user is None:
        raise InvalidTeamUserID(team_user_id)

    all_team_members = db.session.scalars(select(TeamUser).filter_by(team_id = one_team_user.team_id)).all()

    return all_team_members

get_all_team_members = get_team_members

@error_log
def create_team_user(teamuser_data):
    new_team_user = TeamUser(team_id=teamuser_data["team_id"], user_id=teamuser_data["user_id"])

    db.session.add(new_team_user)
    db.session.commit()

    return new_team_user


def load_demo_team_user():
    user_ids = [4, 5, 6]

    for user_id in user_ids:
        create_team_user({
            "team_id": 1,
            "user_id": user_id
        })


@error_log
def replace_team_user(teamuser, team_user_id):
        one_team_user = db.session.scalars(select(TeamUser).filter_by(team_user_id=team_user_id).limit(1)).first()

        if one_team_user is None:
            raise InvalidTeamUserID(team_user_id)

        one_team_user.team_id = teamuser["team_id"]
        one_team_user.user_id = teamuser["user_id"]

        db.session.commit()

        return one_team_user


@error_log
def delete_team_user(team_user_id):
    db.session.execute(delete(TeamUser).filter_by(team_user_id=team_user_id))

    db.session.commit()


@error_log
def delete_team_user_by_user_id_and_team_id(user_id, team_id):
    db.session.execute(delete(TeamUser).filter_by(user_id=user_id, team_id=team_id))

    db.session.commit()
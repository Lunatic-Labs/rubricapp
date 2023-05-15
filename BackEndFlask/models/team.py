from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Team

class InvalidTeamID(Exception):
    "Raised when team_id does not exist!!!"
    pass

def get_teams():
    try:
        return Team.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_team(team_id):
    try:
        one_team = Team.query.filter_by(team_id=team_id)
        if(type(one_team) == type(None)):
            raise InvalidTeamID
        return one_team
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamID:
        error = "Invalid team_id, team_id does not exist!"
        return error

def create_team(team):
    try:
        new_team_name   = team[0]
        new_observer_id = team[1]
        new_date        = team[2]
        new_team = Team(team_name = new_team_name, observer_id=new_observer_id, date=new_date)
        db.session.add(new_team)
        db.session.commit()
        return new_team
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_team(team, team_id):
    try:
        one_team = Team.query.filter_by(team_id=team_id).first()
        if(type(one_team) == type(None)):
            raise InvalidTeamID
        one_team.team_name   = team[0]
        one_team.observer_id = team[1]
        one_team.date        = team[2]
        db.session.commit()
        return one_team
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamID:
        error = "Invalid team_id, team_id does not exist!"
        return error

"""
Delete is meant for the summer semester!!!
"""
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Team
from datetime import datetime

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
        one_team = Team.query.filter_by(team_id=team_id).first()
        if one_team is None:
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
        new_team_name   = team["team_name"]
        new_observer_id = team["observer_id"]
        new_date        = team["date"]
        # date_obj = datetime.strptime(new_date, '%Y-%m-%d').date()
        date_obj = datetime.strptime(new_date, '%m/%d/%Y').date()
        new_team = Team(team_name = new_team_name, observer_id=new_observer_id, date=date_obj)
        db.session.add(new_team)
        db.session.commit()
        return new_team
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def load_SuperAdminTeam():
    create_team({
        "team_name":"SuperAdminTeam",
        "observer_id":1,
        "date":"01/01/2023"
    })

def replace_team(team, team_id):
    try:
        one_team = Team.query.filter_by(team_id=team_id).first()
        if one_team is None:
            raise InvalidTeamID
        one_team.team_name   = team["team_name"]
        one_team.observer_id = team["observer_id"]
        one_team.date        = datetime.strptime(team["date"], '%Y-%m-%d').date()
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
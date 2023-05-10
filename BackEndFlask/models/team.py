from core import db
from flask_login import UserMixin
from sqlalchemy import ForeignKey
from sqlalchemy.exc import SQLAlchemyError

class InvalidTeamID(Exception):
    "Raised when team_id does not exist!!!"
    pass

class Team(UserMixin, db.Model):
    __tablename__ = "Team"
    __table_args__ = {'sqlite_autoincrement': True}
    team_id = db.Column(db.Integer, primary_key=True)
    at_id = db.Column(db.Integer, ForeignKey("Assessment_Task.at_id"), nullable=False)
    observer_id = db.Column(db.Integer,ForeignKey("Users.user_id"), nullable=False)
    date = db.Column(db.Date, nullable=False)

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
        new_at_id       = team[0]
        new_observer_id = team[1]
        new_date        = team[2]
        new_team = Team(at_id = new_at_id, observer_id=new_observer_id, date=new_date)
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
        one_team.at_id       = team[0]
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
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Team
from datetime import datetime

class InvalidTeamID(Exception):
    "Raised when team_id does not exist!!!"
    pass

def get_teams():
    try:
        return Team.query.filter_by(active_until=None).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_team_by_course_id(course_id): 
    try:
        return Team.query.filter_by(course_id=course_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_team_by_team_name_and_course_id(team_name, course_id):
    try:
        return Team.query.filter_by(team_name=team_name, course_id=course_id).first()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_teams_by_observer_id(observer_id):
    try:
        return Team.query.filter_by(Team.active_until is None and Team.observer_id == observer_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_last_created_team_team_id():
    try:
        return Team.query.order_by(Team.team_id.desc()).first().team_id
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
    
def team_is_active(team_id):
    try:
        one_team = Team.query.filter_by(team_id=team_id).first()
        if one_team is None:
            raise InvalidTeamID
        return one_team.active_until is None
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamID:
        error = "Invalid team_id, team_id does not exist!"
        return error
    
def deactivate_team(team_id):
    try:
        one_team = Team.query.filter_by(team_id=team_id).first()
        if one_team is None:
            raise InvalidTeamID
        one_team.active_until = datetime.now()
        db.session.commit()
        return one_team
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamID:
        error = "Invalid team_id, team_id does not exist!"
        return error

def create_team(team_data):
    try:
        new_team_name = team_data["team_name"]
        new_observer_id = team_data["observer_id"]
        new_date_created = team_data["date_created"]
        course_id = team_data["course_id"]
        date_obj = datetime.strptime(new_date_created, '%m/%d/%Y').date()
        new_team = Team(team_name=new_team_name, observer_id=new_observer_id, date_created=date_obj, course_id=course_id, active_until=None)
        db.session.add(new_team)
        db.session.commit()
        return new_team
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def load_demo_team():
    listOfTeams = [
        # team_id = 1
        {
            "team_name": "Black Mambas",
            "observer_id": 3,
            "course_id": 0
        },
        # team_id = 2
        {
            "team_name": "The Untouchables",
            "observer_id": 3,
            "course_id": 1
        },
        # team_id = 3
        {
            "team_name": "Those Who Never Surrender",
            "observer_id": 3,
            "course_id": 2
        },
    ]
    for team in listOfTeams:
        create_team({
            "team_name": team["team_name"],
            "observer_id": team["observer_id"],
            "course_id": team["course_id"],
            "date_created": "01/01/2023",
            "active_until": None
        })

def replace_team(team_data, team_id):
    try:
        one_team = Team.query.filter_by(team_id=team_id).first()
        if one_team is None:
            raise InvalidTeamID
        one_team.team_name = team_data["team_name"]
        one_team.observer_id = team_data["observer_id"]
        one_team.date_created = datetime.strptime(team_data["date_created"], '%m/%d/%Y').date()
        db.session.commit()
        return one_team
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamID:
        error = "Invalid team_id, team_id does not exist!"
        return error

def delete_team(team_id):
    try:
        Team.query.filter_by(team_id=team_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Checkin
from datetime import datetime

def create_checkin(checkin): 
    try:
        assessment_task_id = checkin["assessment_task_id"]
        team_number = checkin["team_number"]
        user_id = checkin["user_id"]
        new_checkin = Checkin(assessment_task_id=assessment_task_id, team_number=team_number, user_id=user_id)
        db.session.add(new_checkin)
        db.session.commit()
        return new_checkin
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    

def get_checkins_by_assessment(assessment_task_id):
    try: 
        return Checkin.query.filter(assessment_task_id==assessment_task_id)
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Checkin
from models.logger import logger
from datetime import datetime

def create_checkin(checkin): 
    try:
        assessment_task_id = checkin["assessment_task_id"]
        team_number = checkin["team_number"]
        user_id = checkin["user_id"]
        new_checkin = Checkin(assessment_task_id=assessment_task_id, team_number=team_number, user_id=user_id, time=datetime.now())
        db.session.add(new_checkin)
        db.session.commit()
        return new_checkin
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

def already_checked_in(user_id, assessment_task_id):
    try: 
        checkin = Checkin.query.filter_by(user_id=user_id, assessment_task_id=assessment_task_id).first()
        return checkin is not None
    except SQLAlchemyError as e: 
        logger.error(str(e.__dict__['orig']))
        raise e

def update_checkin(new_checkin):
    try: 
        checkin = Checkin.query.filter_by(user_id=new_checkin["user_id"], assessment_task_id=new_checkin["assessment_task_id"]).first()
        setattr(checkin, "team_number", new_checkin["team_number"])
        db.session.commit()
    except SQLAlchemyError as e: 
        logger.error(str(e.__dict__['orig']))
        raise e
    
def get_checkins_by_assessment(assessment_task_id):
    try: 
        return Checkin.query.filter(assessment_task_id==assessment_task_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
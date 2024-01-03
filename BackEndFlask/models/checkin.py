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


def get_checkins_by_assessment(assessment_task_id):
    try: 
        return Checkin.query.filter(assessment_task_id==assessment_task_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    
def get_checkins_by_course_and_student(course_id, user_id): 
    try: 
        return Checkin.query.filter_by(course_id=course_id, user_id=user_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
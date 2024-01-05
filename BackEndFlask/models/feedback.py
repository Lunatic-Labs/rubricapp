from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Feedback
from datetime import datetime
from models.logger import logger

class InvalidFeedbackID(Exception):
    def __init__(self):
        self.message = "Raised when feedback_id does not exist"

    def __str__(self):
        return self.message

def get_feedback():
    try: 
        return Feedback.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

def get_feedback_by_completed_assessment_id(completed_assessment_id):
    try:
        return Feedback.query.filter_by(completed_assessment_id=completed_assessment_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    
def get_feedback_by_user_id(user_id):
    try:
        return Feedback.query.filter_by(user_id=user_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

def get_feedback_by_user_id_and_completed_assessment_id(user_id, completed_assessment_id):
    try:
        return Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    
def get_feedback_per_id(feedback_id):
    try:
        one_feedback = Feedback.query.filter_by(feedback_id=feedback_id).first()
        if one_feedback is None:
            raise InvalidFeedbackID
        return one_feedback
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidFeedbackID:
        logger.error(f"{str(e)}: {feedback_id}")
        raise e

def create_feedback(feedback_data):
    try:
        new_feedback = Feedback(
            user_id=feedback_data["user_id"],
            completed_assessment_id=feedback_data["completed_assessment_id"],
            feedback_time=datetime.strptime(feedback_data["feedback_time"], '%Y-%m-%dT%H:%M:%S'),
        )
        db.session.add(new_feedback)
        db.session.commit()
        return new_feedback
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def check_feedback_exists(user_id, completed_assessment_id) -> bool: 
    try: 
        feedback = Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first() 
        return feedback is not None
    
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def load_demo_feedback():
    create_feedback({
        "completed_assessment_id": 1,
        "user_id": 4,
        "feedback_time": "2023-01-07T09:23:00",
    })

def replace_feedback(feedback_time_data, feedback_id):
    try:
        one_feedback = Feedback.query.filter_by(feedback_id=feedback_id).first()
        if one_feedback is None:
            raise InvalidFeedbackID
        one_feedback.user_id = feedback_time_data["user_id"]
        one_feedback.completed_assessment_id = feedback_time_data["completed_assessment_id"]
        one_feedback.feedback_time = feedback_time_data["feedback_time"]
        db.session.commit()
        return one_feedback
    
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidFeedbackID:
        logger.error(f"{str(e)}: {feedback_id}")
        raise e

def delete_feedback_by_user_id_completed_assessment_id(user_id, completed_assessment_id):
    try:
        Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

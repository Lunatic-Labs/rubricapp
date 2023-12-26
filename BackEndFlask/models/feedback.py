from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Feedback
from datetime import datetime

class InvalidFeedback(Exception):
    "Raised when feedback_id does not exist!!!"
    pass

def get_feedback():
    try: 
        return Feedback.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_feedback_by_completed_assessment_id(completed_assessment_id):
    try:
        return Feedback.query.filter_by(completed_assessment_id=completed_assessment_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_feedback_by_user_id(user_id):
    try:
        return Feedback.query.filter_by(user_id=user_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['org'])
        return error

def get_feedback_by_user_id_and_completed_assessment_id(user_id, completed_assessment_id):
    try:
        return Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first()
    except SQLAlchemyError as e:
        error = str(e.__dict__['org'])
        return error
    
def get_feedback_per_id(feedback_id):
    try:
        one_feedback = Feedback.query.filter_by(feedback_id=feedback_id).first()
        if one_feedback is None:
            raise InvalidFeedback
        return one_feedback
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedback:
        error = "Invalid feedback_id, feedback_id does not exist!"
        return error

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

def load_demo_feedback():
    create_feedback({
        "completed_assessment_id": 1,
        "user_id": 4,
        "feedback_time": "2023-01-07T09:23:00",
    })

def update_lag_time(lag_time, feedback_id):
    one_feedback = None
    try:
        one_feedback = Feedback.query.filter_by(feedback_id=feedback_id).first()
        one_feedback.lag_time = lag_time
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedback:
        error = "Invalid feedback_id, feedback_id does not exist!"
        return error

def replace_feedback(feedback_time_data, feedback_id):
    try:
        one_feedback = Feedback.query.filter_by(feedback_id=feedback_id).first()
        if one_feedback is None:
            raise InvalidFeedback
        one_feedback.user_id = feedback_time_data["user_id"]
        one_feedback.completed_assessment_id = feedback_time_data["completed_assessment_id"]
        one_feedback.feedback_time = feedback_time_data["feedback_time"]
        db.session.commit()
        return one_feedback
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedback:
        error = "Invalid feedback_id, feedback_id does not exist!"
        return error

def delete_feedback_by_user_id_completed_assessment_id(user_id, completed_assessment_id):
    try:
        Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

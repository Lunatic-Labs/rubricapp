from core import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from models.schemas import Feedback, CompletedAssessment
from datetime import datetime

class InvalidFeedback(Exception):
    "Raised when feedback_id does not exist!!!"
    pass

def get_feedback_time():
    try: 
        return Feedback.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_feedback_time_by_completed_assessment_id(completed_assessment_id):
    try:
        return Feedback.query.filter_by(completed_assessment_id=completed_assessment_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_feedback_time_by_user_id(user_id):
    try:
        return Feedback.query.filter_by(user_id=user_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['org'])
        return error

def get_feedback_time_by_user_id_and_completed_assessment_id(user_id, completed_assessment_id):
    try:
        return Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first()
    except SQLAlchemyError as e:
        error = str(e.__dict['org'])
        return error
    
def get_feedback_time_per_id(feedback_id):
    try:
        one_feedback_time = Feedback.query.filter_by(feedback_id=feedback_id).first()
        if one_feedback_time is None:
            raise InvalidFeedback
        return one_feedback_time
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedback:
        error = "Invalid feedback_id, feedback_id does not exist!"
        return error

def create_feedback_time(feedback_time_data):
    try:
        new_feedback_time = Feedback(
            user_id=feedback_time_data["user_id"],
            completed_assessment_id=feedback_time_data["completed_assessment_id"],
            feedback_time=datetime.strptime(feedback_time_data["feedback_time"], '%Y-%m-%dT%H:%M:%S'),
            # lag_time=datetime.strptime(feedback_time_data["lag_time"], '%Y-%m-%dT%H:%M:%S')
        )
        db.session.add(new_feedback_time)
        db.session.commit()
        return new_feedback_time
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def load_demo_feedback():
    create_feedback_time({
        "completed_assessment_id": 5,
        "user_id": 7,
        "feedback_time": "2023-01-07T08:00:00",
    })

def update_lag_time(lag_time, feedback_id):
    one_feedback_time = None
    try:
        one_feedback_time = Feedback.query.filter_by(feedback_id=feedback_id).first()
        one_feedback_time.lag_time = lag_time
        print(type(one_feedback_time.lag_time))
        print(f"lag_time: {one_feedback_time.lag_time}")
        days = one_feedback_time.lag_time/3600
        print(f"days: {days}")
        # hours = one_feedback_time.lag_time/60
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedback:
        error = "Invalid feedback_id, feedback_id does not exist!"
        return error

def replace_feedback_time(feedback_time_data, feedback_id):
    try:
        one_feedback_time = Feedback.query.filter_by(feedback_id=feedback_id).first()
        if one_feedback_time is None:
            raise InvalidFeedback
        one_feedback_time.user_id = feedback_time_data["user_id"]
        one_feedback_time.completed_assessment_id = feedback_time_data["completed_assessment_id"]
        one_feedback_time.feedback_time = feedback_time_data["feedback_time"]
        db.session.commit()
        return one_feedback_time
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedback:
        error = "Invalid feedback_id, feedback_id does not exist!"
        return error

def delete_feedback_time_by_user_id_completed_assessment_id(user_id, completed_assessment_id):
    try:
        Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

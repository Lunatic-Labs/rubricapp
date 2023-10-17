from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import FeedbackTime

class InvalidFeedbackTime(Exception):
    "Raised when feedback_time_id does not exist!!!"
    pass

def get_feedback_time():
    try: 
        return FeedbackTime.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_feedback_time_by_completed_assessment_id(completed_assessment_id):
    try:
        return FeedbackTime.query.filter_by(completed_assessment_id=completed_assessment_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_feedback_time_by_user_id(user_id):
    try:
        return FeedbackTime.query.filter_by(user_id=user_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['org'])
        return error

def get_feedback_time_by_user_id_and_completed_assessment_id(user_id, completed_assessment_id):
    try:
        return FeedbackTime.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first()
    except SQLAlchemyError as e:
        error = str(e.__dict['org'])
        return error
    
def get_feedback_time(feedback_time_id):
    try:
        one_feedback_time = FeedbackTime.query.filter_by(feedback_time_id=feedback_time_id).first()
        if one_feedback_time is None:
            raise InvalidFeedbackTime
        return one_feedback_time
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedbackTime:
        error = "Invalid feedback_time_id, feedback_time_id does not exist!"
        return error

def create_feedback_time(feedback_time_data):
    try:
        new_feedback_time = FeedbackTime(
            feedback_time_id=feedback_time_data["feedback_time_id"],
            user_id=feedback_time_data["user_id"],
            completed_assessment_id=feedback_time_data["completed_assessment_id"],
            feedback_time=feedback_time_data["feedback_time"]
        )
        db.session.add(new_feedback_time)
        db.session.commit()
        return new_feedback_time
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

# Once this is working with the routes/front-end, it may need to be altered.
def load_demo_feedback_time():
    create_feedback_time({
        "feedback_time_id": 1,
        "completed_assessment_id": 1,
        "user_id": 4,
        "feedback_time": "2023-02-23T18:00:00",
    })

def replace_feedback_time(feedback_time_data, feedback_time_id):
    try:
        one_feedback_time = FeedbackTime.query.filter_by(feedback_time_id=feedback_time_id).first()
        if one_feedback_time is None:
            raise InvalidFeedbackTime
        one_feedback_time.user_id = feedback_time_data["user_id"]
        one_feedback_time.completed_assessment_id = feedback_time_data["completed_assessment_id"]
        one_feedback_time.feedback_time = feedback_time_data["feedback_time"]
        db.session.commit()
        return one_feedback_time
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidFeedbackTime:
        error = "Invalid feedback_time_id, feedback_time_id does not exist!"
        return error

def delete_feedback_time_by_user_id_completed_assessment_id(user_id, completed_assessment_id):
    try:
        FeedbackTime.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

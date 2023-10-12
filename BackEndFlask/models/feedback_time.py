from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import FeedbackTime

class InvalidFeedbackTime(Exception):
    "Raised when feedback_time_id does not exist!!!"
    pass

def get_feedback_time_by_user_id_and_completed_assessment_id(user_id, completed_assessment_id):
    try:
        return FeedbackTime.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first()
    except SQLAlchemyError as e:
        error = str(e.__dict['org'])
        return error
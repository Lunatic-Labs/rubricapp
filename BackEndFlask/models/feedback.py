from core import db
from models.schemas import Feedback
from datetime import datetime, timezone
from models.utility import error_log

class InvalidFeedbackID(Exception):
    def __init__(self, id):
        self.message = f"Invalid feedback_id: {id}."

    def __str__(self):
        return self.message

@error_log
def get_feedback():
    return Feedback.query.all()


@error_log
def get_feedback_by_completed_assessment_id(completed_assessment_id):
    return Feedback.query.filter_by(completed_assessment_id=completed_assessment_id).all()


@error_log
def get_feedback_by_user_id(user_id):
    return Feedback.query.filter_by(user_id=user_id).all()


@error_log
def get_feedback_by_user_id_and_completed_assessment_id(user_id, completed_assessment_id):
    return Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first()


@error_log
def get_feedback_per_id(feedback_id):
    one_feedback = Feedback.query.filter_by(feedback_id=feedback_id).first()

    if one_feedback is None:
        raise InvalidFeedbackID(feedback_id)

    return one_feedback


@error_log
def create_feedback(feedback_data):
    new_feedback = Feedback(
        user_id=feedback_data.get("user_id"),
        team_id=feedback_data.get("team_id"),
        completed_assessment_id=feedback_data["completed_assessment_id"],
        feedback_time=feedback_data.get("feedback_time", datetime.now(timezone.utc)),
    )

    db.session.add(new_feedback)

    db.session.commit()

    return new_feedback


@error_log
def check_feedback_exists(user_id, completed_assessment_id, team_id=None) -> bool: 
    if user_id is not None:
        feedback = Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).first() 
    else:
        feedback = Feedback.query.filter_by(team_id=team_id, completed_assessment_id=completed_assessment_id).first() 

    return feedback is not None


def load_demo_feedback():
    create_feedback({
        "completed_assessment_id": 1,
        "user_id": 3,
        "feedback_time": datetime.now(timezone.utc),
    })

@error_log
def replace_feedback(feedback_time_data, feedback_id):
    one_feedback = Feedback.query.filter_by(feedback_id=feedback_id).first()

    if one_feedback is None:
        raise InvalidFeedbackID(feedback_id)

    one_feedback.user_id = feedback_time_data["user_id"]
    one_feedback.completed_assessment_id = feedback_time_data["completed_assessment_id"]
    one_feedback.feedback_time = feedback_time_data["feedback_time"]

    db.session.commit()

    return one_feedback


@error_log
def delete_feedback_by_user_id_completed_assessment_id(user_id, completed_assessment_id):
    Feedback.query.filter_by(user_id=user_id, completed_assessment_id=completed_assessment_id).delete()

    db.session.commit()

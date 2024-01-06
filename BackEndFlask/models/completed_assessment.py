from core import db
from sqlalchemy import and_
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import CompletedAssessment, AssessmentTask, User, Feedback
from datetime import datetime
from models.utility import error_log

class InvalidCRID(Exception):
    "Raised when completed_assessment_id does not exist!!!"
    def __init__(self, id):
        self.message = f"Invalid completed_assessment_id: {id}"

    def __str__(self):
        return self.message


@error_log
def get_completed_assessments():
    return CompletedAssessment.query.all()


@error_log
def get_completed_assessments_by_assessment_task_id(assessment_task_id):
    return CompletedAssessment.query.filter_by(assessment_task_id=assessment_task_id).all()


@error_log
def get_completed_assessment(completed_assessment_id):
    one_completed_assessment = CompletedAssessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()

    if one_completed_assessment is None:
        raise InvalidCRID(completed_assessment_id)

    return one_completed_assessment


@error_log
def get_completed_assessment_by_course_id(course_id):
    return db.session.query(CompletedAssessment).join(AssessmentTask, CompletedAssessment.assessment_task_id == AssessmentTask.assessment_task_id).filter(
            AssessmentTask.course_id == course_id
        ).all()


@error_log
def get_individual_completed_and_student(assessment_task_id):
    return db.session.query(
        User.first_name,
        User.last_name,
        CompletedAssessment.rating_observable_characteristics_suggestions_data,
        Feedback.feedback_time,
        CompletedAssessment.last_update,
        Feedback.lag_time,
        Feedback.feedback_id
     ).join(
         User,
         CompletedAssessment.user_id == User.user_id
     ).join(
         Feedback,
         User.user_id == Feedback.user_id
         and
         CompletedAssessment.completed_assessment_id == Feedback.completed_assessment_id
     ).filter(
         and_(
             CompletedAssessment.team_id == None,
             CompletedAssessment.assessment_task_id == assessment_task_id
         )
     ).first()


@error_log
def completed_assessment_exists(team_id, assessment_task_id, user_id):
    return CompletedAssessment.query.filter_by(team_id=team_id, assessment_task_id=assessment_task_id, user_id=user_id).first()


@error_log
def create_completed_assessment(completed_assessment_data):
    if "." not in completed_assessment_data["initial_time"]:
        completed_assessment_data["initial_time"] = completed_assessment_data["initial_time"] + ".000"

    if "Z" not in completed_assessment_data["initial_time"]:
        completed_assessment_data["initial_time"] = completed_assessment_data["initial_time"] + "Z"

    if "." not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + ".000"

    if "Z" not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + "Z"

    completed_assessment_data = CompletedAssessment(
        assessment_task_id=completed_assessment_data["assessment_task_id"],
        team_id=completed_assessment_data["team_id"],
        user_id=completed_assessment_data["user_id"],
        initial_time=datetime.strptime(completed_assessment_data["initial_time"], '%Y-%m-%dT%H:%M:%S.%fZ'),
        last_update=None if completed_assessment_data["last_update"] is None else datetime.strptime(completed_assessment_data["last_update"], '%Y-%m-%dT%H:%M:%S.%fZ'),
        rating_observable_characteristics_suggestions_data=completed_assessment_data["rating_observable_characteristics_suggestions_data"],
        done=completed_assessment_data["done"]
    )

    db.session.add(completed_assessment_data)
    db.session.commit()

    return completed_assessment_data

def replace_completed_assessment(completed_assessment_data, completed_assessment_id):
    if "." not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + ".000"

    if "Z" not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + "Z"

    one_completed_assessment = CompletedAssessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()

    if one_completed_assessment is None:
        raise InvalidCRID

    one_completed_assessment.assessment_task_id = completed_assessment_data["assessment_task_id"]
    one_completed_assessment.team_id = completed_assessment_data["team_id"]
    one_completed_assessment.user_id = completed_assessment_data["user_id"]
    one_completed_assessment.last_update = datetime.strptime(completed_assessment_data["last_update"], '%Y-%m-%dT%H:%M:%S.%fZ')
    one_completed_assessment.rating_observable_characteristics_suggestions_data = completed_assessment_data["rating_observable_characteristics_suggestions_data"]
    one_completed_assessment.done = completed_assessment_data["done"]
    db.session.commit()

    return one_completed_assessment
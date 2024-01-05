from core import db
from sqlalchemy import and_
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import CompletedAssessment, AssessmentTask, User, Feedback
from models.logger import logger
from datetime import datetime

class InvalidCRID(Exception):
    "Raised when completed_assessment_id does not exist!!!"
    def __init__(self):
        self.message = "Invalid completed_assessment_id, completed_assessment_id does not exist"

    def __str__(self):
        return self.message


def get_completed_assessments():
    try:
        return CompletedAssessment.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_completed_assessments_by_assessment_task_id(assessment_task_id):
    try:
        return CompletedAssessment.query.filter_by(assessment_task_id=assessment_task_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_completed_assessment(completed_assessment_id):
    try:
        one_completed_assessment = CompletedAssessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()
        if one_completed_assessment is None:
            raise InvalidCRID
        return one_completed_assessment
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidCRID as e:
        logger.error(f"{str(e)} {completed_assessment_id}")
        raise e


def get_completed_assessment_by_course_id(course_id):
    try:
        return db.session.query(CompletedAssessment).join(AssessmentTask, CompletedAssessment.assessment_task_id == AssessmentTask.assessment_task_id).filter(
                AssessmentTask.course_id == course_id
            ).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

def create_completed_assessment(completed_assessment_data):
    try:
        completed_assessment_data = CompletedAssessment(
            assessment_task_id=completed_assessment_data["assessment_task_id"],
            team_id=completed_assessment_data["team_id"],
            user_id=completed_assessment_data["user_id"],
            initial_time=datetime.strptime(completed_assessment_data["initial_time"], '%Y-%m-%dT%H:%M:%S'),
            last_update=None if completed_assessment_data["last_update"] is None else datetime.strptime(completed_assessment_data["last_update"], '%Y-%m-%dT%H:%M:%S'),
            rating_observable_characteristics_suggestions_data=completed_assessment_data["rating_observable_characteristics_suggestions_data"]
        )
        db.session.add(completed_assessment_data)
        db.session.commit()
        return completed_assessment_data
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def load_demo_completed_assessment():
    listOfCompletedAssessments = [
        {
            "team_id": None,
            "user_id": 4,
            "initial_time": "2023-01-07T08:00:00",
            "last_update": "2023-01-07T08:00:00"
        },
        {
            "team_id": 2,
            "user_id": None,
            "initial_time": "2023-03-01T13:00:00",
            "last_update": None,
        },
        {
            "team_id": 3,
            "user_id": None,
            "initial_time": "2023-02-14T08:00:00",
            "last_update": None,
        },
        {
            "team_id": None,
            "user_id": 3,
            "initial_time": "2023-03-05T09:30:00",
            "last_update": None,
        },
        {
            "team_id": None,
            "user_id": 7,
            "initial_time": "2023-05-29T13:20:00",
            "last_update":  "2023-01-01T07:00:00",
        },
        {
            "team_id": None,
            "user_id": 8,
            "initial_time": "2023-02-13T10:00:00",
            "last_update": None,
        },
        {
            "team_id": None,
            "user_id": 6,
            "initial_time": "2023-01-09T09:30:00",
            "last_update": None,
        },
    ]
    count = 1
    for completed_assessment in listOfCompletedAssessments:
        create_completed_assessment({
            "assessment_task_id": count,
            "team_id": completed_assessment["team_id"],
            "user_id": completed_assessment["user_id"],
            "initial_time": completed_assessment["initial_time"],
            "last_update": completed_assessment["last_update"],
            "rating_observable_characteristics_suggestions_data": None
        })
        count += 1

def replace_completed_assessment(completed_assessment_data, completed_assessment_id):
    try:
        one_completed_assessment = CompletedAssessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()
        if one_completed_assessment is None:
            raise InvalidCRID
        one_completed_assessment.assessment_task_id = completed_assessment_data["assessment_task_id"]
        one_completed_assessment.team_id = completed_assessment_data["team_id"]
        one_completed_assessment.user_id = completed_assessment_data["user_id"]
        one_completed_assessment.initial_time = completed_assessment_data["initial_time"]
        one_completed_assessment.last_update = completed_assessment_data["last_update"]
        one_completed_assessment.rating_observable_characteristics_suggestions_data = completed_assessment_data["rating_observable_characteristics_suggestions_data"]
        db.session.commit()
        return one_completed_assessment
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidCRID as e:
        logger.error(f"{str(e)} {completed_assessment_id}")
        raise e


"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_completed_assessment_at_id(cr_id, new_at_id):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.at_id = new_at_id
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_by_role(cr_id, new_by_role):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.by_role = new_by_role
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_for_role(cr_id, new_for_role):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.for_role = new_for_role
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_initial_time(cr_id, new_initial_time):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.initial_time = new_initial_time
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_last_update(cr_id, new_last_update):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.last_update = new_last_update
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_rating_summation(cr_id, new_rating_summation):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.rating_summation = new_rating_summation
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_oc_data(cr_id, new_oc_data):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.oc_data = new_oc_data
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_sfi_data(cr_id, new_sfi_data):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.sfi_data = new_sfi_data
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

"""
Delete is meant for the summer semester!!!
"""

# # def delete_completed_assessment(cr_id):
# #     try:
# #         Completed_Assessment.query.filtery_by(cr_id=cr_id).delete()
# #         db.session.commit()
# #         all_completed_assessments = Completed_Assessment.query.all()
# #         return all_completed_assessments
# #     except:
# #         return False

# # def detele_all_completed_assessments():
# #     try:
# #         all_completed_assessments = Completed_Assessment.query.all()
# #         db.session.delete(all_completed_assessments)
# #         db.session.commit()
# #         all_completed_assessments = Completed_Assessment.query.all()
# #         return all_completed_assessments
# #     except:
# #         return False

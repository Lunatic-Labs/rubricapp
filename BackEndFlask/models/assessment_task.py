from core import db
from models.logger import logger
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import AssessmentTask, Team
from models.logger import logger
from datetime import datetime

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class InvalidAssessmentTaskID(Exception):
    def __init__(self):
        self.message = "Invalid Assessment Task ID."
    def __str__(self):
        return self.message


def get_assessment_tasks():
    try:
        return AssessmentTask.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_assessment_tasks_by_course_id(course_id):
    try:
        return AssessmentTask.query.filter_by(course_id=course_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        return e


def get_assessment_tasks_by_role_id(role_id):
    try:
        return AssessmentTask.query.filter_by(role_id=role_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_assessment_tasks_by_team_id(team_id):
    try:
        return db.session.query(AssessmentTask).join(Team, AssessmentTask.course_id == Team.course_id).filter(
                Team.team_id == team_id
                and
                (
                    (AssessmentTask.due_date >= Team.date_created and Team.active_until is None)
                    or
                    (AssessmentTask.due_date >= Team.date_created and AssessmentTask.due_date <= Team.active_until)
                )
            ).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_assessment_task(assessment_task_id):
    try:
        one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()
        if one_assessment_task is None:
            raise InvalidAssessmentTaskID
        return one_assessment_task
    except SQLAlchemyError as e:
        logger.error(f"{str(e.__dict__['orig'])} {assessment_task_id})")
        raise e
    except InvalidAssessmentTaskID as e:
        logger.error(f"{str(e)} {assessment_task_id}")
        raise e


def create_assessment_task(assessment_task):
    try:
        if "Z" not in assessment_task["due_date"]:
            assessment_task["due_date"] = assessment_task["due_date"] + ".000Z"
        new_assessment_task = AssessmentTask(
            assessment_task_name=assessment_task["assessment_task_name"],
            course_id=assessment_task["course_id"],
            rubric_id=assessment_task["rubric_id"],
            role_id=assessment_task["role_id"],
            due_date=datetime.strptime(assessment_task["due_date"], '%Y-%m-%dT%H:%M:%S.%fZ'),
            time_zone=assessment_task["time_zone"],
            show_suggestions=assessment_task["show_suggestions"],
            show_ratings=assessment_task["show_ratings"],
            unit_of_assessment=assessment_task["unit_of_assessment"],
            create_team_password=assessment_task["create_team_password"],
            comment=assessment_task["comment"],
            number_of_teams=assessment_task["number_of_teams"]
        )
        db.session.add(new_assessment_task)
        db.session.commit()
        return new_assessment_task
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def load_demo_admin_assessmentTask():
    listOfAssessmentTasks = [
        {
            "assessment_task_name": "Critical Thinking Assessment",
            "due_date": "2023-04-24T08:30:00.000Z",
            "time_zone": "EST",
            # TA/Instructor
            "role_id": 4,
            "show_suggestions": True,
            "show_ratings": True,
            "unit_of_assessment": False,
            "create_team_password": "test",
            "comment" : "An example comment",
            "number_of_teams": None
        },
        {
            "assessment_task_name": "Formal Communication Assessment",
            "due_date": "2023-03-03T13:00:00.000Z",
            "time_zone": "EST",
            # TA/Instructor
            "role_id": 4,
            "show_suggestions": False,
            "show_ratings": True,
            "unit_of_assessment": False,
            "create_team_password": None,
            "comment": None,
            "number_of_teams": None
        },
        {
            "assessment_task_name": "Information Processing Assessment",
            "due_date": "2023-02-14T08:00:00.000Z",
            "time_zone": "EST",
            # Student
            "role_id": 5,
            "show_suggestions": True,
            "show_ratings": False,
            "unit_of_assessment": False,
            "create_team_password": None,
            "comment": None,
            "number_of_teams": None
        },
        {
            "assessment_task_name": "Interpersonal Communication",
            "due_date": "2023-03-05T09:30:00.000Z",
            "time_zone": "EST",
            # Student
            "role_id": 5,
            "show_suggestions": False,
            "show_ratings": False,
            "unit_of_assessment": False,
            "create_team_password": None,
            "comment": None,
            "number_of_teams": None
        },
        {
            "assessment_task_name": "Management Assessment",
            "due_date": "2023-05-29T13:20:00.000Z",
            "time_zone": "EST",
            # Teams => needs to be completed by a TA/Instructor (4)
            "role_id": 4,
            "show_suggestions": True,
            "show_ratings": True,
            # True: Will be completed by Team
            "unit_of_assessment": True,
            "create_team_password": None,
            "comment": None,
            "number_of_teams": None
        },
        {
            "assessment_task_name": "Problem Solving Assessment",
            "due_date": "2023-02-13T10:00:00.000Z",
            "time_zone": "EST",
            # Student
            "role_id": 5,
            "show_suggestions": False,
            "show_ratings": False,
            "unit_of_assessment": False,
            "create_team_password": None,
            "comment": None,
            "number_of_teams": None
        },
        {
            "assessment_task_name": "Teamwork Assessment",
            "due_date": "2023-01-09T09:30:00.000Z",
            "time_zone": "EST",
            # Teams => needs to be completed by Student(s) (5)
            "role_id": 5,
            "show_suggestions": True,
            "show_ratings": False,
            # True: Will be Completed by Team
            "unit_of_assessment": True,
            "create_team_password": "test",
            "comment": None,
            "number_of_teams": None
        },
    ]
    count = 1
    for assessment in listOfAssessmentTasks:
        create_assessment_task({
            "assessment_task_name": assessment["assessment_task_name"],
            "course_id": 1,
            "due_date": assessment["due_date"],
            "time_zone": assessment["time_zone"],
            "rubric_id": count,
            "role_id": assessment["role_id"],
            "show_suggestions": assessment["show_suggestions"],
            "show_ratings": assessment["show_ratings"],
            "unit_of_assessment": assessment["unit_of_assessment"],
            "create_team_password": assessment["create_team_password"],
            "comment": assessment["comment"],
            "number_of_teams": assessment["number_of_teams"]
        })
        count += 1

def replace_assessment_task(assessment_task, assessment_task_id):
    try:
        one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()
        if one_assessment_task is None:
            raise InvalidAssessmentTaskID
        one_assessment_task.assessment_task_name = assessment_task["assessment_task_name"]
        one_assessment_task.course_id = assessment_task["course_id"]
        one_assessment_task.due_date=datetime.strptime(assessment_task["due_date"], '%Y-%m-%dT%H:%M:%S.%fZ')
        one_assessment_task.time_zone = assessment_task["time_zone"]
        one_assessment_task.rubric_id = assessment_task["rubric_id"]
        one_assessment_task.role_id = assessment_task["role_id"]
        one_assessment_task.show_suggestions = assessment_task["show_suggestions"]
        one_assessment_task.show_ratings = assessment_task["show_ratings"]
        one_assessment_task.unit_of_assessment = assessment_task["unit_of_assessment"]
        one_assessment_task.create_team_password = assessment_task["create_team_password"]
        one_assessment_task.comment = assessment_task["comment"]
        db.session.commit()
        return one_assessment_task
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidAssessmentTaskID as e:
        logger.error(f"{str(e)} {assessment_task_id}")
        raise e

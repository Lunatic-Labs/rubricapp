from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import TeamAssessmentTask

class InvalidTeamAssessmentTaskID(Exception):
    "Raised when team_assessment_task_id does not exist!!!"
    pass

def get_team_assessment_tasks():
    try:
        return TeamAssessmentTask.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_team_assessment_tasks_by_team_id(team_id):
    try:
        return TeamAssessmentTask.query.filter_by(team_id=team_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_team_assessment_task(team_assessment_task_id):
    try:
        one_team_assessment_task = TeamAssessmentTask.query.filter_by(team_assessment_task_id=team_assessment_task_id).first()
        if one_team_assessment_task is None:
            raise InvalidTeamAssessmentTaskID
        return one_team_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamAssessmentTaskID:
        error = "Invalid team_assessment_task_id, team_assessment_task_id does not exist!"
        return error
 
def create_team_assessment_task(teamassessmenttask):
    try:
        new_team_id = teamassessmenttask["team_id"]
        new_assessment_task_id = teamassessmenttask["assessment_task_id"]
        new_team_assessment_task = TeamAssessmentTask(
            team_id=new_team_id,
            assessment_task_id=new_assessment_task_id
        )
        db.session.add(new_team_assessment_task)
        db.session.commit()
        return new_team_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_team_assessment_task(teamassessmenttask, team_assessment_task_id):
    try:
        one_team_assessment_task = TeamAssessmentTask.query.filter_by(team_assessment_task_id=team_assessment_task_id).first()
        if one_team_assessment_task is None:
            raise InvalidTeamAssessmentTaskID
        one_team_assessment_task.team_id = teamassessmenttask["team_id"]
        one_team_assessment_task.assessment_task_id = teamassessmenttask["assessment_task_id"]
        db.session.commit()
        return one_team_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamAssessmentTaskID:
        error = "Invalid team_assessment_task_id, team_assessment_task_id does not exist!"
        return error

"""
Delete is meant for the summer semester!!!
"""
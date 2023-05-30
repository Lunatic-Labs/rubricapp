from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import AssessmentTask

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class InvalidAssessmentTaskID(Exception):
    "Raised when assessment_task_id does not exist!!!"
    pass

def get_assessment_tasks():
    try:
        return AssessmentTask.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_assessment_tasks_by_course_id(course_id):
    try:
        return AssessmentTask.query.filter_by(course_id=course_id)
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_assessment_task(at_id):
    try:
        one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()
        if one_assessment_task is None:
            raise InvalidAssessmentTaskID
        return one_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidAssessmentTaskID:
        error = "Invalid assessment_task_id, assessment_task_id does not exist!"
        return error
        
def create_assessment_task(assessment_task):
    try:
        new_assessment_task = AssessmentTask(
            at_name=assessment_task["assessment_task_name"],
            course_id=assessment_task["course_id"],
            due_date=assessment_task["due_date"],
            rubric_id=assessment_task["rubric_id"],
            role_id=assessment_task["role_id"],
            show_suggestions=assessment_task["show_suggestions"],
            show_ratings=assessment_task["show_ratings"]
        )
        db.session.add(new_assessment_task)
        db.session.commit()
        return new_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def load_SuperAdminAssessmentTask():
    create_assessment_task({
        "at_name":"Super Admin Assessment Task",
        "course_id":1,
        "due_date": "2023-05-29T09:30:00",
        "rubric_id":1,
        "role_id":4,
        "show_suggestions": True,
        "show_ratings": True
    })

def replace_assessment_task(assessment_task, assessment_task_id):
    try:
        one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()
        if one_assessment_task is None:
            raise InvalidAssessmentTaskID
        one_assessment_task.assessment_task_name = assessment_task["assessment_task_name"]
        one_assessment_task.course_id = assessment_task["course_id"]
        one_assessment_task.due_date = assessment_task["due_date"]
        one_assessment_task.rubric_id = assessment_task["rubric_id"]
        one_assessment_task.role_id = assessment_task["role_id"]
        one_assessment_task.show_suggestions = assessment_task["show_suggestions"]
        one_assessment_task.show_ratings = assessment_task["show_ratings"]
        db.session.commit()
        return one_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidAssessmentTaskID:
        error = "Invalid assessment_task_id, assessment_task_id does not exist!"
        return error

"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_assessment_task_name(assessment_task_id, new_at_name):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(assessment_task_id=assessment_task_id).first()
#         one_assessment_task.at_name = new_at_name
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False

# def update_assessment_task_course_id(assessment_task_id, new_course_id):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(assessment_task_id=assessment_task_id).first()
#         one_assessment_task.course_id = new_course_id
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False
    
# def update_assessment_task_rubric_id(assessment_task_id, new_rubric_id):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(assessment_task_id=assessment_task_id).first()
#         one_assessment_task.rubric_id = new_rubric_id
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False    

# def update_assessment_task_role(assessment_task_id, new_role):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(assessment_task_id=assessment_task_id).first()
#         one_assessment_task.role_id = new_role
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False

# def update_assessment_task_due_date(assessment_task_id, new_due_date):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(assessment_task_id=assessment_task_id).first()
#         one_assessment_task.due_date = new_due_date
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False
    
# def update_assessment_task_suggestions(assessment_task_id, new_suggestions):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(assessment_task_id=assessment_task_id).first()
#         one_assessment_task.suggesstions = new_suggestions
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False

"""
Delete is meant for the summer semester!!!
"""

# # def delete_assessment_task(assessment_task_id):
# #     try:
# #         Assessment_Task.query.filter_by(assessment_task_id=assessment_task_id).delete()
# #         db.session.commit()
# #         all_assessment_tasks = Assessment_Task.query.all()
# #         return all_assessment_tasks
# #     except:
# #         return False

# # def delete_all_assessment_tasks():
# #     try:
# #         all_assessment_tasks = Assessment_Task.query.all()
# #         db.session.delete(all_assessment_tasks)
# #         db.session.commit()
# #         all_assessment_tasks = Assessment_Task.query.all()
# #         return all_assessment_tasks
# #     except:
# #         return False
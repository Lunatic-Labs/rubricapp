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

def get_assessment_tasks_by_role_id(role_id):
    try:
        return AssessmentTask.query.filter_by(role_id=role_id)
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_assessment_task(assessment_task_id):
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
            assessment_task_name=assessment_task["assessment_task_name"],
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

def load_demo_admin_assessmentTask():
    listOfAssessmentTasks = [
        {
            "assessment_task_name": "Critical Thinking Assessment",
            "due_date": "2023-04-24T08:30:00",
            # TA/Instructor
            "role_id": 4,
            "show_suggestions": True,
            "show_ratings": True
        },
        {
            "assessment_task_name": "Formal Communication Assessment",
            "due_date": "2023-03-03T13:00:00",
            # TA/Instructor
            "role_id": 4,
            "show_suggestions": False,
            "show_ratings": True
        },
        {
            "assessment_task_name": "Information Processing Assessment",
            "due_date": "2023-02-14T08:00:00",
            # Student
            "role_id": 5,
            "show_suggestions": True,
            "show_ratings": False 
        },
        {
            "assessment_task_name": "Interpersonal Communication",
            "due_date": "2023-03-05T09:30:00",
            # Student
            "role_id": 5,
            "show_suggestions": False,
            "show_ratings": False
        },
        {
            "assessment_task_name": "Management Assessment",
            "due_date": "2023-05-29T13:20:00",
            # Teams
            "role_id": 6,
            "show_suggestions": True,
            "show_ratings": True
        },
        {
            "assessment_task_name": "Problem Solving Assessment",
            "due_date": "2023-02-13T10:00:00",
            # Student
            "role_id": 5,
            "show_suggestions": False,
            "show_ratings": False
        },
        {
            "assessment_task_name": "Teamwork Assessment",
            "due_date": "2023-01-09T09:30:00",
            # Teams
            "role_id": 6,
            "show_suggestions": True,
            "show_ratings": False
        },
    ]
    count = 1
    for assessment in listOfAssessmentTasks:
        create_assessment_task({
            "assessment_task_name": assessment["assessment_task_name"],
            "course_id": 1,
            "due_date": assessment["due_date"],
            "rubric_id": count,
            "role_id": assessment["role_id"],
            "show_suggestions": assessment["show_suggestions"],
            "show_ratings": assessment["show_ratings"]
        })
        count += 1

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
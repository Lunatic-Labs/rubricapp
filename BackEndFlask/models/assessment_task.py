from core import db, UserMixin
from sqlalchemy import ForeignKey, func, DateTime
from sqlalchemy.exc import SQLAlchemyError

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class InvalidAssessmentTaskID(Exception):
    "Raised when at_id does not exist!!!"
    pass

class AssessmentTask(UserMixin, db.Model):
    __tablename__ = "AssessmentTasks"
    __table_args__ = {'sqlite_qutoincrement' : True}
    at_id = db.Column(db.Integer, primary_key=True)
    at_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, ForeignKey("course.course_id")) # Might have to think about
    rubric_id = db.Column(db.Integer, ForeignKey("rubric.rubric_id")) # how to handle updates and deletes
    at_role = db.Column(db.Integer, ForeignKey("role.role_id"))
    due_date = db.Column(DateTime(timezone=True), server_default=func.now()) # may need to be updated later
    suggestions = db.Column(db.Boolean, unique=True)

def get_assessment_tasks():
    try:
        return AssessmentTask.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_assessment_task(at_id):
    try:
        one_assessment_task = AssessmentTask.query.filter_by(at_id=at_id)
        if(type(one_assessment_task) == type(None)):
            raise InvalidAssessmentTaskID
        return one_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidAssessmentTaskID:
        error = "Invalid at_id, at_id does not exist!"
        return error
        

def create_assessment_task(assessment_task):
    try:
        new_at_name     = assessment_task[0]
        new_course_id   = assessment_task[1]
        new_rubric_id   = assessment_task[2]
        new_at_role     = assessment_task[3]
        new_due_date    = assessment_task[4]
        new_suggestions = assessment_task[5]
        new_assessment_task = AssessmentTask(at_name=new_at_name, course_id=new_course_id, rubric_id=new_rubric_id, due_date=new_due_date, at_role=new_at_role, suggestions=new_suggestions)
        db.session.add(new_assessment_task)
        db.session.commit()
        return new_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_assessment_task(assessment_task, at_id):
    try:
        one_assessment_task = AssessmentTask.query.filter_by(at_id=at_id).first()
        if(type(one_assessment_task) == type(None)):
            raise InvalidAssessmentTaskID
        one_assessment_task.at_name     = assessment_task[0]
        one_assessment_task.course_id   = assessment_task[1]
        one_assessment_task.rubric_id   = assessment_task[2]
        one_assessment_task.at_role     = assessment_task[3]
        one_assessment_task.due_date    = assessment_task[4]
        one_assessment_task.suggestions = assessment_task[5]
        db.session.commit()
        return one_assessment_task
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidAssessmentTaskID:
        error = "Invalid at_id, at_id does not exist!"
        return error

"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_assessment_task_name(at_id, new_at_name):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(at_id=at_id).first()
#         one_assessment_task.at_name = new_at_name
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False

# def update_assessment_task_course_id(at_id, new_course_id):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(at_id=at_id).first()
#         one_assessment_task.course_id = new_course_id
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False
    
# def update_assessment_task_rubric_id(at_id, new_rubric_id):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(at_id=at_id).first()
#         one_assessment_task.rubric_id = new_rubric_id
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False    

# def update_assessment_task_role(at_id, new_role):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(at_id=at_id).first()
#         one_assessment_task.at_role = new_role
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False

# def update_assessment_task_due_date(at_id, new_due_date):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(at_id=at_id).first()
#         one_assessment_task.due_date = new_due_date
#         db.session.add(one_assessment_task)
#         db.session.commit()
#         all_assessment_tasks = AssessmentTask.query.all()
#         return all_assessment_tasks
#     except:
#         return False
    
# def update_assessment_task_suggestions(at_id, new_suggestions):
#     try:
#         one_assessment_task = AssessmentTask.query.filtery_by(at_id=at_id).first()
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

# # def delete_assessment_task(at_id):
# #     try:
# #         Assessment_Task.query.filter_by(at_id=at_id).delete()
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
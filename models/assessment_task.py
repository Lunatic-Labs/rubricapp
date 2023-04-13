from core import db, UserMixin
from sqlalchemy import ForeignKey, func, DateTime

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class Assessment_Task(UserMixin, db.Model):
    at_id = db.Column(db.Integer, primary_key=True)
    at_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, ForeignKey("course.course_id"))
    rubric_id = db.Column(db.Integer, ForeignKey("rubric.rubric_id"))
    at_role = db.Column(db.Integer, ForeignKey("role.role_id"))
    due_date = db.Column(DateTime(timezone=True), server_default=func.now()) # may need to be updated later
    suggestions = db.Column(db.Boolean, unique=True)

def get_assessment_tasks():
    try:
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False

def get_assessment_task(at_id):
    one_assessment_task = Assessment_Task.query.filter_by(at_id=at_id)
    return one_assessment_task

# Creating ids is something we still have to be thinking about
def create_assessment_task(at_name, course_id, rubric_id, at_role, due_date, suggestions):
    try:
        new_assessment_task = Assessment_Task(at_name=at_name, course_id=course_id, rubric_id=rubric_id, due_date=due_date, at_role=at_role, suggestions=suggestions)
        db.session.add(new_assessment_task)
        db.session.commit()
        return True
    except:
        return False

def replace_assessment_task(at_id, new_at_name, new_course_id, new_rubric_id, new_at_role, new_due_date, new_suggesstions):
    try:
        one_assessment_task = Assessment_Task.query.filter_by(at_id=at_id)
        one_assessment_task.at_name = new_at_name
        one_assessment_task.course_id = new_course_id
        one_assessment_task.rubric_id = new_rubric_id
        one_assessment_task.at_role = new_at_role
        one_assessment_task.due_date = new_due_date
        one_assessment_task.suggestions = new_suggesstions
        db.session.add(one_assessment_task)
        db.session.commit()
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False
    
def update_assessment_task_name(at_id, new_at_name):
    try:
        one_assessment_task = Assessment_Task.query.filtery_by(at_id=at_id).first()
        one_assessment_task.at_name = new_at_name
        db.session.add(one_assessment_task)
        db.session.commit()
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False

def update_assessment_task_role(at_id, new_role):
    try:
        one_assessment_task = Assessment_Task.query.filtery_by(at_id=at_id).first()
        one_assessment_task.at_role = new_role
        db.session.add(one_assessment_task)
        db.session.commit()
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False

def update_assessment_task_due_date(at_id, new_due_date):
    try:
        one_assessment_task = Assessment_Task.query.filtery_by(at_id=at_id).first()
        one_assessment_task.due_date = new_due_date
        db.session.add(one_assessment_task)
        db.session.commit()
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False
    
def update_assessment_task_suggestions(at_id, new_suggestions):
    try:
        one_assessment_task = Assessment_Task.query.filtery_by(at_id=at_id).first()
        one_assessment_task.suggesstions = new_suggestions
        db.session.add(one_assessment_task)
        db.session.commit()
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False

def delete_assessment_task(at_id):
    try:
        Assessment_Task.query.filter_by(at_id=at_id).delete()
        db.session.commit()
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False

def delete_all_assessment_tasks():
    try:
        all_assessment_tasks = Assessment_Task.query.all()
        db.session.delete(all_assessment_tasks)
        db.session.commit()
        all_assessment_tasks = Assessment_Task.query.all()
        return all_assessment_tasks
    except:
        return False
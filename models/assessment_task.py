from core import db, UserMixin
from sqlalchemy import ForeignKey, func, DateTime

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class Assesment_Task(UserMixin, db.Model):
    at_id = db.Column(db.Integer, primary_key=True)
    at_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, ForeignKey("course.course_id"))
    rubric_id = db.Column(db.Integer, ForeignKey("rubric.rubric_id"))
    at_role = db.Column(db.Integer, ForeignKey("role.role_id"))
    due_date = db.Column(DateTime(timezone=True), server_default=func.now()) # may need to be updated later
    suggestions = db.Column(db.Boolean, unique=True)
    

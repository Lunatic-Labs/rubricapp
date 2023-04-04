from core import db, UserMixin
from sqlalchemy import ForeignKey

""" 
Roles will equal the following:
    0 = SuperAdmin
    1 = Admin
    2 = TA/Instructor
    3 = Student
    4 = Researcher
"""

class Role(UserMixin, db.Model):
    __tablename__ = "Role"
    role_id = db.Column(db.Integer, primary_key=True)

from core import db, UserMixin
import enum
from sqlalchemy import ForeignKey, Enum

class Season(enum.Enum):
    fall = 1
    winter = 2
    spring = 3
    summer = 4

class Course(UserMixin, db.Model):
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.Integer, nullable=False)
    course_name = db.Column(db.String(10), nullable=False)
    year = db.Column(db.Date, nullable=False)
    season = db.Column(Enum(Season), nullable=False)
    avtive = db.Column(db.Bool, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey("User.user_id"), nullable=False)
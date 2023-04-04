from core import db, UserMixin
import enum
from sqlalchemy import ForeignKey, Enum, Boolean

class Course(UserMixin, db.Model):
    __tablename__ = "Course"
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.Integer, nullable=False)
    course_name = db.Column(db.String(10), nullable=False)
    year = db.Column(db.Date, nullable=False)
    term = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey("Users.user_id", ondelete="CASCADE"), nullable=False)
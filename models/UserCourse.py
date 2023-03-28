from core import db, UserMixin
from sqlalchemy import ForeignKey


class UserCourse(UserMixin, db.Model):
    # user_id = db.Column(db.Integer, ForeignKey("User.user_id"), primary_key=True)
    # course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), primary_key=True )
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), primary_key=True)
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), primary_key=True )

  
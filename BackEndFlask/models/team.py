from core import db, UserMixin
from sqlalchemy import ForeignKey

class Team(UserMixin, db.Model):
    __tablename__ = "Team"
    team_id = db.Column(db.Integer, primary_key=True)
    at_id = db.Column(db.Integer, ForeignKey("Assessment_Task.at_id", ondelete="CASCADE"), nullable=False)
    observer_id = db.Column(db.Integer,ForeignKey("Users.user_id", ondelete="CASCADE"), nullable=False)
    date = db.Column(db.Date, nullable=False)

"""
Delete is meant for the summer semester!!!
"""
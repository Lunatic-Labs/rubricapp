from core import db, UserMixin
from sqlalchemy import ForeignKey

class Team(UserMixin, db.Model):
    team_id = db.Column(db.Integer, primary_key=True)
    at_id = db.Column(db.Integer, ForeignKey("Assessment_Task.at_id"), nullable=False)
    observer_id = db.Column(db.Integer,ForeignKey("User.user_id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
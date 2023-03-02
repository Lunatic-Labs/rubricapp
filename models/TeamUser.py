from core import db, UserMixin
from sqlalchemy import ForeignKey


class TeamUser(UserMixin, db.Model):
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id"), primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("User.user_id"), primary_key=True )

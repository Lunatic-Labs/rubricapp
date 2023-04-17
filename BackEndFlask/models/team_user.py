from core import db, UserMixin
from sqlalchemy import ForeignKey


class TeamUser(UserMixin, db.Model):
    __tablename__ = "TeamUser"
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id", ondelete="CASCADE"), primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id", ondelete="CASCADE"), primary_key=True )


"""
Delete is meant for the summer semester!!!
"""
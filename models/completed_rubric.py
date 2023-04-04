from core import db, UserMixin
from sqlalchemy import ForeignKey, DateTime, func

class Completed_Rubric(UserMixin, db.Model):
    __tablename__ = "Completed_Rubric"
    cr_id = db.Column(db.Integer, primary_key=True)
    at_id = db.Column(db.Integer, ForeignKey("at.at_id", ondelete="CASCADE"))
    by_role = db.Column(db.Integer, ForeignKey("Users.user_id", ondelete="CASCADE"))
    for_role = db.Column(db.Integer, ForeignKey("Users.user_id", ondelete="CASCADE"))
    initial_time = db.Column(db.DateTime(timezone=True), server_default=func.now()) # may need to be updated
    last_update = db.Column(db.DateTime(timezone=True), onupdate=func.now()) # also may need to be updated
    rating = db.Column(db.Integer)
    oc_data = db.String((16)) # this will determine wheter or not oc was filled out or not
    sfi_data = db.String((16)) # same as above ^
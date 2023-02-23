from core import db, UserMixin
from sqlalchemy import ForeignKey
# tables in database; each class match to a table in database
#   *size of username, project_id, owner, project_name should be consistent in different tables.
#   *password is encrypted

class User(UserMixin, db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(30), nullable=False)
    lname = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(20), nullable=False)     #role in university; ex. instructor or ta
    lms_id = db.Column(db.Integer, unique=True, nullable=True)
    consent =db.Column(db.Bool, nullable=False)
    owner_id = db.Column(db.Integer, ForeignKey("User.user_id"), nullable=False)
    
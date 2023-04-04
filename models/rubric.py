from core import db, UserMixin
from sqlalchemy import ForeignKey

class Rubric(UserMixin, db.Model):
    __tablename__ = "Rubric"
    rubric_id = db.Column(db.Integer, primary_key=True)
    rubric_name = db.Column(db.String(100))
    rubric_desc = db.Column(db.String(100), nullable=True)
    
    


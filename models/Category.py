from core import db, UserMixin
from sqlalchemy import ForeignKey

class Category(UserMixin, db.Model):
    category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    ratings = db.Column(db.Integer, nullable=False)
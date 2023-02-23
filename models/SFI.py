from core import db, UserMixin
from sqlalchemy import ForeignKey

class SuggestionsForImprovement(UserMixin, db.Model):
    sfi_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    category_id = db.Column(db.Integer,ForeignKey("Category.category_id"), nullable=False)
    sfi_text = db.Column(db.String(10000), nullable=False)
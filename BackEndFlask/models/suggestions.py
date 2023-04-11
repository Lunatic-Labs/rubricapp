from core import db, UserMixin
from sqlalchemy import ForeignKey

class SuggestionsForImprovement(UserMixin, db.Model):
    __tablename__ = "SuggestionsForImprovement"
    sfi_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id", ondelete="CASCADE"), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey("Category.category_id", ondelete="CASCADE"), nullable=False)
    sfi_text = db.Column(db.JSON, nullable=False)
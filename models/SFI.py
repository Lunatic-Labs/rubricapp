from core import db, UserMixin

class SuggestionsForImprovement(UserMixin, db.Model):
    sfi_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, db.ForeignKey("Rubric.rubric_id"), nullable=False)
    category_id = db.Column(db.Integer,db.ForeignKey("Category.category_id"), nullable=False)
    sfi_text = db.Column(db.JSON, nullable=False)
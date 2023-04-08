from core import db, UserMixin
from sqlalchemy import ForeignKey

class ObservableCharacteristics(UserMixin, db.Model):
    __tablename__ = "ObservableCharacteristics"
    oc_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id", ondelete="CASCADE"), nullable=False)
    category_id = db.Column(db.Integer,ForeignKey("Category.category_id", ondelete="CASCADE"), nullable=False)
    oc_text = db.Column(db.String(10000), nullable=False)
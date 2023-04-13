from core import db, UserMixin
from sqlalchemy import ForeignKey

class Rubric(UserMixin, db.Model):
    __tablename__ = "Rubric"
    __table_args__ = {'sqlite_autoincrement': True}
    rubric_id = db.Column(db.Integer, primary_key=True)
    rubric_name = db.Column(db.String(100))
    rubric_desc = db.Column(db.String(100), nullable=True)

def get_rubrics():
    try:
        return Rubric.query.all()
    except:
        return False

def get_rubric(rubric_id):
    one_rubric = Rubric.query.filter_by(rubric_id=rubric_id)
    return one_rubric

def create_rubric(rubric):
    try:
        (new_rubric_name, new_rubric_desc) = rubric
        new_rubric = Rubric(rubric_name=new_rubric_name, rubric_desc=new_rubric_desc)
        db.session.add(new_rubric)
        db.session.commit()
        return True
    except:
        return False

    
    


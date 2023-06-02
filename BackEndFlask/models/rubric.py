from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Rubric

class InvalidRubricID(Exception):
    "Raised when rubric_id does not exist!!!"
    pass

def get_rubrics():
    try:
        return Rubric.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_rubric(rubric_id):
    try:
        one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()
        if one_rubric is None:
            raise InvalidRubricID
        return one_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRubricID:
        error = "Invalid rubric_id, rubric_id does not exist!"
        return error

def create_rubric(rubric):
    try:
        new_rubric = Rubric(
            rubric_name=rubric[0],
            rubric_description=rubric[1]
        )
        db.session.add(new_rubric)
        db.session.commit()
        return new_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error  

def replace_rubric(rubric, rubric_id):
    try:
        one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()
        if one_rubric is None:
            raise InvalidRubricID
        one_rubric.rubric_name = rubric[0]
        one_rubric.rubric_description = rubric[1]
        db.session.commit()
        return one_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRubricID:
        error = "Invalid rubric_id, rubric_id does not exist!"
        return error

"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_rubric_name(rubric_id, new_rubric_name):
#     try:
#         one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()
#         one_rubric.rubric_name = new_rubric_name
#         db.session.add(one_rubric)
#         db.session.commit()
#         return True
#     except:
#         return False
    
"""
Delete is meant for the summer semester!!!
"""
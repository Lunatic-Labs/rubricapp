from core import db
from sqlalchemy import or_
from models.schemas import Rubric
from models.utility import error_log

class InvalidRubricID(Exception):
    def __init__(self, id):
        self.message = f"Invalid rubric_id: {id}."

    def __str__(self):
        return self.message


@error_log
def get_rubrics():
    return Rubric.query.all()


@error_log
def get_rubrics_for_user(user_id):
    return db.session.query(Rubric).\
        filter(or_(Rubric.owner == user_id, Rubric.owner == None))


@error_log
def get_rubric(rubric_id):
    one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()

    if one_rubric is None:
        raise InvalidRubricID(rubric_id)

    return one_rubric


@error_log
def create_rubric(rubric):
    new_rubric = Rubric(
        rubric_name=rubric["rubric_name"],
        rubric_description=rubric["rubric_description"],
        owner=rubric["owner"]
    )

    db.session.add(new_rubric)
    db.session.commit()

    return new_rubric


@error_log
def replace_rubric(rubric, rubric_id):
    one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()

    if one_rubric is None:
        raise InvalidRubricID(rubric_id)
    
    one_rubric.rubric_name = rubric[0]
    one_rubric.rubric_description = rubric[1]

    db.session.commit()

    return one_rubric

@error_log
def delete_rubric(rubric_id):
    one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()

    if one_rubric is None:
        raise InvalidRubricID(rubric_id)

    db.session.delete(one_rubric)
    db.session.commit()

    return one_rubric
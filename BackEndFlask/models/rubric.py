from core import db
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from models.schemas import Rubric, AssessmentTask, RubricCategory
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
    # Return rubrics owned by the user or global (owner is NULL)
    return db.session.query(Rubric).filter(or_(Rubric.owner == user_id, Rubric.owner == None))


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
    # assuming rubric is [name, description]
    one_rubric.rubric_name = rubric[0]
    one_rubric.rubric_description = rubric[1]
    db.session.commit()
    return one_rubric


@error_log
def delete_rubric_by_id(rubric_id):
    """
    Deletes a rubric if and only if it is not referenced by any AssessmentTask.
    Any dependent RubricCategory rows are removed first to satisfy FK constraints.
    Mirrors the delete-user flow's UX by raising a ValueError with the same message when in use.
    """
    try:
        # Ensure rubric exists
        rubric = Rubric.query.get(rubric_id)
        if rubric is None:
            raise InvalidRubricID(rubric_id)

        # Block deletion if any AssessmentTask uses this rubric
        in_use_count = db.session.query(AssessmentTask).filter(
            AssessmentTask.rubric_id == rubric_id
        ).count()
        if in_use_count > 0:
            raise ValueError("Cannot delete custom rubric with associated tasks")

        # Remove dependent RubricCategories first (avoids MySQL 1451 FK error)
        db.session.query(RubricCategory).filter(
            RubricCategory.rubric_id == rubric_id
        ).delete(synchronize_session=False)

        # Delete the rubric itself
        db.session.delete(rubric)
        db.session.commit()
        return True

    except IntegrityError as e:
        db.session.rollback()
        if "foreign key constraint" in str(e).lower():
            raise ValueError("Cannot delete custom rubric with associated tasks")
        raise
    except Exception:
        db.session.rollback()
        raise

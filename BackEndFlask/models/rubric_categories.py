from core import db
from sqlalchemy.exc import IntegrityError
from models.schemas import RubricCategory
from models.utility import error_log


@error_log
def get_rubric_categories_by_rubric_id(rubric_id):
    return db.session.query(RubricCategory).filter(
        RubricCategory.rubric_id == rubric_id
    ).all()


@error_log
def delete_rubric_categories_by_rubric_id(rubric_id):
    try:
        db.session.query(RubricCategory).filter(
            RubricCategory.rubric_id == rubric_id
        ).delete(synchronize_session=False)
        db.session.commit()
        return True
    except IntegrityError:
        db.session.rollback()
        raise
    except Exception:
        db.session.rollback()
        raise

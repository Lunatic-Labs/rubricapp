from core import db
from sqlalchemy.exc import IntegrityError
from models.schemas import RubricCategory
from models.utility import error_log

__all__ = [
    # primary snake_case API
    "create_rubric_category",
    "get_rubric_categories_by_rubric_id",
    "delete_rubric_categories_by_rubric_id",
    # backward-compat camelCase API (used by legacy scripts)
    "getRubricCategoriesByRubricId",
    "deleteRubricCategoriesByRubricId",
]

@error_log
def create_rubric_category(rubric_category):
    """
    Create a RubricCategory row and return it.
    """
    new_category = RubricCategory(
        rubric_id=rubric_category["rubric_id"],
        category_id=rubric_category["category_id"],
    )
    db.session.add(new_category)
    db.session.commit()
    return new_category

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

# -----------------------------
# Backward-compatibility aliases
# -----------------------------
def getRubricCategoriesByRubricId(rubric_id):
    return get_rubric_categories_by_rubric_id(rubric_id)

def deleteRubricCategoriesByRubricId(rubric_id):
    return delete_rubric_categories_by_rubric_id(rubric_id)

from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import RubricCategory 

def create_rubric_category(rubric_category):
    try:
        new_category = RubricCategory(
            rubric_id=rubric_category["rubric_id"],
            category_id=rubric_category["category_id"]
        )
        db.session.add(new_category)
        db.session.commit()
        return new_category
    except SQLAlchemyError as e:
        error = str(e.__dict__('orig'))
        return error
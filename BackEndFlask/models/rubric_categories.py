from core import db
from models.schemas import RubricCategory 
from models.utility import error_log

@error_log
def create_rubric_category(rubric_category):
    new_category = RubricCategory(
        rubric_id=rubric_category["rubric_id"],
        category_id=rubric_category["category_id"]
    )

    db.session.add(new_category)
    db.session.commit()
    
    return new_category
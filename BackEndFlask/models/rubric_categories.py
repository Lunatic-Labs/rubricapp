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

@error_log
def delete_rubric_categories_by_rubric_id(rubric_id):
    categories_to_delete = RubricCategory.query.filter_by(rubric_id=rubric_id).all()
    
    for category in categories_to_delete:
        db.session.delete(category)
        
    db.session.commit()
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Ratings

class InvalidCategoryID(Exception):
    "Raised when category_id does not exist!!!"
    pass

def get_ratings():
    try:
        return Ratings.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_categories_per_rubric(rubric_id):
    try:
        category_per_rubric = Category.query.filter_by(rubric_id=rubric_id)
        return category_per_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_category(category_id):
    try:
        one_category = Category.query.filter_by(category_id=category_id).first()
        if one_category is None:
            raise InvalidCategoryID
        return one_category
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCategoryID:
        error = "Invalid category_id, category_id does not exist!"
        return error
      
def create_category(category):
    try:
        new_rubric_id = category[0]
        new_name      = category[1]
        new_ratings   = category[2]
        new_category = Category(
            rubric_id=new_rubric_id,
            name=new_name,
            ratings=new_ratings
        )
        db.session.add(new_category)
        db.session.commit()
        return new_category
    except SQLAlchemyError as e:
        error = str(e.__dict__('orig'))
        return error

def replace_category(category, category_id):
    try:
        one_category = Category.query.filery_by(category_id=category_id).first()
        if one_category is None:
            raise InvalidCategoryID
        one_category.rubric_id = category[0]
        one_category.name      = category[1]
        one_category.ratings   = category[2]
        db.session.commit()
        return one_category
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCategoryID:
        error = "Invalid category_id, category_id does not exist!"
        return error
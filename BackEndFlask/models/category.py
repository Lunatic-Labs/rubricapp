from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Category, RubricCategory, Rubric

class InvalidCategoryID(Exception):
    "Raised when category_id does not exist!!!"
    pass

def get_categories():
    try:
        # gets all the categories as well as the name of the rubric that category is assigned to be default 
        # every category only goes to one rubric by default, and we can which one that is because it does have an owner
        return db.session.query(Category.category_id, Category.category_name, Category.description, Category.rating_json, Rubric.rubric_name).\
            join(RubricCategory, RubricCategory.category_id == Category.category_id).\
            join(Rubric, RubricCategory.rubric_id == Rubric.rubric_id).\
            filter(Rubric.owner == None).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_categories_per_rubric(rubric_id):
    try:
        category_per_rubric = db.session.query(Category).join(RubricCategory, RubricCategory.category_id == Category.category_id).filter_by(rubric_id=rubric_id)
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
        new_category = Category(
            category_name=category["name"],
            description=category["description"],
            rating_json=category["rating_json"]
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
        one_category.name = category[1]
        db.session.commit()
        return one_category
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCategoryID:
        error = "Invalid category_id, category_id does not exist!"
        return error

"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_category_rubric_id(category_id, new_rubric_id):
#     try:
#         one_category = Category.query.filtery_by(category_id=category_id).first()
#         one_category.rubric_id = new_rubric_id
#         db.session.add(one_category)
#         db.session.commit()
#         all_categories = Category.query.all()
#         return all_categories
#     except:
#         return False

# def update_categorycategory_name(category_id, newcategory_name):
#     try:
#         one_category = Category.query.filtery_by(category_id=category_id).first()
#         one_category.name = newcategory_name
#         db.session.add(one_category)
#         db.session.commit()
#         all_categories = Category.query.all()
#         return all_categories
#     except:
#         return False
    
# def update_category_ratings(category_id, new_ratings):
#     try:
#         one_category = Category.query.filtery_by(category_id=category_id).first()
#         one_category.ratings = new_ratings
#         db.session.add(one_category)
#         db.session.commit()
#         all_categories = Category.query.all()
#         return all_categories
#     except:
#         return False
    
"""
Delete is meant for the summer semester!!!
"""

# # def delete_category(category_id):
# #     try:
# #         Category.query.filtery_by(category_id=category_id).delete()
# #         db.session.commit()
# #         all_categories = Category.query.all()
# #         return all_categories
# #     except:
# #         return False
# # def delete_all_categories():
# #     try:
# #         all_categories = Category.query.all()
# #         db.session.delete(all_categories)
# #         db.session.commit()
# #         all_categories = Category.query.all()
# #         return all_categories
# #     except:
# #         return False
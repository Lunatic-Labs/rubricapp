from core import db, UserMixin
from sqlalchemy import ForeignKey
from sqlalchemy.exc import SQLAlchemyError

class InvalidCategoryID(Exception):
    "Raised when category_id does not exist!!!"
    pass

class Category(UserMixin, db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    ratings = db.Column(db.Integer, nullable=False)

def get_categories():
    try:
        return Category.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_category(category_id):
    try:
        one_category = Category.query.filter_by(category_id=category_id)
        if (type[one_category] == type[None]):
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
        new_category = Category(rubric_id=new_rubric_id, name=new_name, ratings=new_ratings)
        db.session.add(new_category)
        db.session.commit()
        return new_category
    except SQLAlchemyError as e:
        error = str(e.__dict__('orig'))
        return error

def replace_category(category, category_id):
    try:
        one_category = Category.query.filery_by(category_id=category_id).first()
        if (type(one_category) == type(None)):
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

# def update_category_name(category_id, new_name):
#     try:
#         one_category = Category.query.filtery_by(category_id=category_id).first()
#         one_category.name = new_name
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
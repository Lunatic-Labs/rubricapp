from core import db, UserMixin
from sqlalchemy import ForeignKey

class Category(UserMixin, db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    ratings = db.Column(db.Integer, nullable=False)

def get_categories():
    try:
        all_categories = Category.query.all()
        return all_categories
    except:
        return False

def get_category(category_id):
    try:
        one_category = Category.query.filter_by(category_id=category_id)
        return one_category
    except:
        return False
      
def create_category(category):
    try:
        (new_rubric_id, new_name, new_ratings) = category
        new_category = Category(rubric_id=new_rubric_id, name=new_name, ratings=new_ratings)
        db.session.add(new_category)
        db.session.commit()
        return True
    except:
        return False

def replace_category(category_id, new_rubric_id, new_name, new_ratings):
    try:
        one_category = Category.query.filery_by(category_id=category_id)
        one_category.rubric_id = new_rubric_id
        one_category.name = new_name
        one_category.ratings = new_ratings
        db.session.add(one_category)
        db.session.commit()
        all_categories = Category.query.all()
        return all_categories
    except:
        return False

def update_category_rubric_id(category_id, new_rubric_id):
    try:
        one_category = Category.query.filtery_by(category_id=category_id).first()
        one_category.rubric_id = new_rubric_id
        db.session.add(one_category)
        db.session.commit()
        all_categories = Category.query.all()
        return all_categories
    except:
        return False

def update_category_name(category_id, new_name):
    try:
        one_category = Category.query.filtery_by(category_id=category_id).first()
        one_category.name = new_name
        db.session.add(one_category)
        db.session.commit()
        all_categories = Category.query.all()
        return all_categories
    except:
        return False
    
def update_category_ratings(category_id, new_ratings):
    try:
        one_category = Category.query.filtery_by(category_id=category_id).first()
        one_category.ratings = new_ratings
        db.session.add(one_category)
        db.session.commit()
        all_categories = Category.query.all()
        return all_categories
    except:
        return False
    
# def delete_category(category_id):
#     try:
#         Category.query.filtery_by(category_id=category_id).delete()
#         db.session.commit()
#         all_categories = Category.query.all()
#         return all_categories
#     except:
#         return False
# def delete_all_categories():
#     try:
#         all_categories = Category.query.all()
#         db.session.delete(all_categories)
#         db.session.commit()
#         all_categories = Category.query.all()
#         return all_categories
#     except:
#         return False
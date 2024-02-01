from core import db
from models.schemas import Category, RubricCategory, Rubric
from models.utility import error_log

class InvalidCategoryID(Exception):
    def __init__(self, id):
        self.message = f"Invalid category_id: {id}."

    def __str__(self):
        return self.message


@error_log
def get_categories():
    # gets all the categories as well as the name of the rubric that category is assigned to be default 
    # every category only goes to one rubric by default, and we can see which one that is because it does have an owner

    return db.session.query(
        Category.category_id,
        Category.category_name,
        Category.description,
        Category.rating_json,
        Rubric.rubric_id,
        Rubric.rubric_name
    ).join(
        RubricCategory,
        RubricCategory.category_id == Category.category_id
    ).join(
        Rubric,
        RubricCategory.rubric_id == Rubric.rubric_id
    ).filter(
        Rubric.owner == 1
    ).all()


@error_log
def get_categories_per_rubric(rubric_id):
    category_per_rubric = db.session.query(
        Category
    ).join(
        RubricCategory,
        RubricCategory.category_id == Category.category_id
    ).filter_by(
        rubric_id=rubric_id
    ).all()

    return category_per_rubric


@error_log
def get_category(category_id):
    one_category = Category.query.filter_by(category_id=category_id).first()

    if one_category is None:
        raise InvalidCategoryID(category_id)

    return one_category

@error_log
def get_ratings_by_category(category_id):
    one_category = Category.query.filter_by(category_id=category_id).first()

    if one_category is None:
        raise InvalidCategoryID(category_id)

    return one_category.rating_json


@error_log
def create_category(category):
    new_category = Category(
        category_name=category["name"],
        description=category["description"],
        rating_json=category["rating_json"]
    )

    db.session.add(new_category)
    db.session.commit()

    return new_category


@error_log
def replace_category(category, category_id):
    one_category = Category.query.filery_by(category_id=category_id).first()

    if one_category is None:
        raise InvalidCategoryID(category_id)

    one_category.rubric_id = category[0]
    one_category.name = category[1]

    db.session.commit()

    return one_category
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Rubric

class InvalidRubricID(Exception):
    "Raised when rubric_id does not exist!!!"
    pass
 
"""
    Name for new file: rubricFormatter.py
    Rubric
        Category
            OC
            Suggestions
    
    Get all rubric in a array
        all_rubrics = []
        for rubric in rubrics:
            current_rubric = {}
            current_rubric["name"] = rubric.name
            current_rubric["desc"] = rubric.desc
            all_rubrics.append(current_rubric)
        
    Get all categories in a array 
    Get all OC in a array
    Get all Suggestions in a array

    all_categories = get_categories()
    CategoryJSON = {}
    for category in all_categories:
        CategoryJSON["name"] = category.name
        CategoryJSON["rating"] = category.ratings
    RubricJSON = {
        "name":"",
        "description":"",
        "category": [
            
        ]
    }
"""

def get_rubrics():
    try:
        return Rubric.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_rubric(rubric_id):
    try:
        one_rubric = Rubric.query.get(rubric_id)
        if(type(one_rubric) == type(None)):
            raise InvalidRubricID
        return one_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRubricID:
        error = "Invalid rubric_id, rubric_id does not exist!"
        return error

def create_rubric(rubric):
    try:
        new_rubric_name = rubric[0]
        new_rubric_desc = rubric[1]
        new_rubric = Rubric(rubric_name=new_rubric_name, rubric_desc=new_rubric_desc)
        db.session.add(new_rubric)
        db.session.commit()
        return new_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error  

def replace_rubric(rubric, rubric_id):
    try:
        one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()
        if(type(one_rubric) == type(None)):
            raise InvalidRubricID
        one_rubric.rubric_name = rubric[0]
        one_rubric.rubric_desc = rubric[1]
        db.session.commit()
        return one_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRubricID:
        error = "Invalid rubric_id, rubric_id does not exist!"
        return error

"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_rubric_name(rubric_id, new_rubric_name):
#     try:
#         one_rubric = Rubric.query.filter_by(rubric_id=rubric_id).first()
#         one_rubric.rubric_name = new_rubric_name
#         db.session.add(one_rubric)
#         db.session.commit()
#         return True
#     except:
#         return False
    
"""
Delete is meant for the summer semester!!!
"""
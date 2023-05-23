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

"""
def convertSQLQueryToJSON(all_users):
    entire_users = []
    for user in all_users:
        new_user = {}
        new_user["user_id"] = user.user_id
        new_user["first_name"] = user.fname
        new_user["last_name"] = user.lname
        new_user["email"] = user.email
        # Still not sure whether or not to return user passwords!
        # new_user["password"] = user.password
        new_user["role"] = user.role
        new_user["lms_id"] = user.lms_id
        new_user["consent"] = user.consent
        new_user["owner_id"] = user.owner_id
        entire_users.append(new_user)
    return entire_users

"""

from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Rubric
from models.schemas import Category
from models.schemas import ObservableCharacteristics
from models.schemas import SuggestionsForImprovement

def get_critical_thinking(rubric_id):
    one_rubric = Rubric.query.get(rubric_id)
    
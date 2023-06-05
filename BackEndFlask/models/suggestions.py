from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import SuggestionsForImprovement

class Invalid_Suggestion_ID(Exception):
    "Raised when suggestion_id does not exist!!!"
    pass

def get_suggestions():
    try:
        return SuggestionsForImprovement.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_suggestion(suggestion_id):
    try:
        one_suggestion = SuggestionsForImprovement.query.filter_by(suggestion_id=suggestion_id).first()
        if one_suggestion is None:
            raise Invalid_Suggestion_ID
        return one_suggestion
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except Invalid_Suggestion_ID:
        error = "Invalid suggestion_id, suggestion_id does not exist!"
        return error
    
def get_suggestions_per_category(category_id):
    try:
        return SuggestionsForImprovement.query.filter_by(category_id=category_id)
    except SQLAlchemyError as e:
        error = str(e.__dict__["orig"])
        return error

def create_suggestion(suggestion):
    try:
        new_suggestion = SuggestionsForImprovement(
            rubric_id=suggestion[0],
            category_id=suggestion[1],
            suggestion_text=suggestion[2]
        )
        db.session.add(new_suggestion)
        db.session.commit()
        return new_suggestion
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_suggestion(suggestion, id):
    try:
        one_suggestion = SuggestionsForImprovement.query.filter_by(suggestion_id=id).first()
        if one_suggestion is None:
            raise Invalid_Suggestion_ID
        one_suggestion.rubric_id = suggestion[0]
        one_suggestion.category_id = suggestion[1]
        one_suggestion.text = suggestion[2]
        db.session.commit()
        return one_suggestion
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except Invalid_Suggestion_ID:
        error = "Invalid suggestion_id, suggestion_id does not exist!"
        return error
    
"""
Delete is meant for the summer semester!!!
"""
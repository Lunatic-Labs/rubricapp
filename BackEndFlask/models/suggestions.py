from core import db
from models.schemas import SuggestionsForImprovement
from utility import error_log

class Invalid_Suggestion_ID(Exception):
    def __init__(self, id):
        self.message = f"suggestion_id does not exist {id}"

    def __str__(self):
        return self.message


@error_log
def get_suggestions():
    return SuggestionsForImprovement.query.all()


@error_log
def get_suggestion(suggestion_id):
    one_suggestion = SuggestionsForImprovement.query.filter_by(suggestion_id=suggestion_id).first()

    if one_suggestion is None:
        raise Invalid_Suggestion_ID
    
    return one_suggestion


@error_log
def get_suggestions_per_category(category_id):
    return SuggestionsForImprovement.query.filter_by(category_id=category_id).all()


@error_log
def create_suggestion(suggestion):
    new_suggestion = SuggestionsForImprovement(
        category_id=suggestion[0],
        suggestion_text=suggestion[1]
    )
    
    db.session.add(new_suggestion)
    db.session.commit()

    return new_suggestion


def replace_suggestion(suggestion, id):
        one_suggestion = SuggestionsForImprovement.query.filter_by(suggestion_id=id).first()
        
        if one_suggestion is None:
            raise Invalid_Suggestion_ID(id)
        
        one_suggestion.rubric_id = suggestion[0]
        one_suggestion.category_id = suggestion[1]
        one_suggestion.text = suggestion[2]

        db.session.commit()
        
        return one_suggestion
    
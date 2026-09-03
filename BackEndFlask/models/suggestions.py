from core import db
from sqlalchemy import select
from models.schemas import SuggestionsForImprovement
from models.utility import error_log

class Invalid_Suggestion_ID(Exception):
    def __init__(self, id):
        self.message = f"Invalid suggestion_id: {id}."

    def __str__(self):
        return self.message


@error_log
def get_suggestions():
    return db.session.scalars(select(SuggestionsForImprovement)).all()


@error_log
def get_suggestion(suggestion_id):
    one_suggestion = db.session.scalars(
        select(SuggestionsForImprovement).filter_by(suggestion_id=suggestion_id).limit(1)
    ).first()

    if one_suggestion is None:
        raise Invalid_Suggestion_ID(suggestion_id)

    return one_suggestion


@error_log
def get_suggestions_per_category(category_id):
    return db.session.scalars(
        select(SuggestionsForImprovement).filter_by(category_id=category_id)
    ).all()


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
    one_suggestion = db.session.scalars(
        select(SuggestionsForImprovement).filter_by(suggestion_id=id).limit(1)
    ).first()
    
    if one_suggestion is None:
        raise Invalid_Suggestion_ID(id)

    one_suggestion.category_id = suggestion[0]
    one_suggestion.suggestion_text = suggestion[1]

    db.session.commit()

    return one_suggestion
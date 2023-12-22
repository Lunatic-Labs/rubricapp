from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import SuggestionsForImprovement
from models.logger import logger

class Invalid_Suggestion_ID(Exception):
    def __init__(self):
        self.message = "Raised when suggestion_id does not exist"

    def __str__(self):
        return self.message


def get_suggestions():
    try:
        return SuggestionsForImprovement.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_suggestion(suggestion_id):
    try:
        one_suggestion = SuggestionsForImprovement.query.filter_by(suggestion_id=suggestion_id).first()
        if one_suggestion is None:
            logger.error(f"{suggestion_id} does not exist")
            raise Invalid_Suggestion_ID
        return one_suggestion
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except Invalid_Suggestion_ID as e:
        logger.error(f"{str(e)} {suggestion_id}")
        raise e


def get_suggestions_per_category(category_id):
    try:
        return SuggestionsForImprovement.query.filter_by(category_id=category_id)
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


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
        logger.error(str(e.__dict__['orig']))
        raise e


def replace_suggestion(suggestion, id):
    try:
        one_suggestion = SuggestionsForImprovement.query.filter_by(suggestion_id=id).first()
        if one_suggestion is None:
            logger.error(f"{id} does not exist")
            raise Invalid_Suggestion_ID
        one_suggestion.rubric_id = suggestion[0]
        one_suggestion.category_id = suggestion[1]
        one_suggestion.text = suggestion[2]
        db.session.commit()
        return one_suggestion
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except Invalid_Suggestion_ID as e:
        logger.error(f"{str(e)} {id}")
        raise e


"""
Delete is meant for the summer semester!!!
"""

from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Rating

class InvalidRatingsID(Exception):
    "Raised when rating_id does not exist!!!"
    pass

def get_ratings():
    try:
        return Rating.query.all()
    except SQLAlchemyError as e:
        # Log str(e.__dict__['orig'])
        raise e
        # error = str(e.__dict__['orig'])
        # return error

def get_rating(rating_id):
    try:
        one_rating = Rating.query.filter_by(rating_id=rating_id).first()
        if one_rating is None:
            raise InvalidRatingsID
        return one_rating
    except SQLAlchemyError as e:
        # Log str(e.__dict__['orig'])
        raise e
        # error = str(e.__dict__['orig'])
        # return error
    except InvalidRatingsID:
        # Log "Invalid rating_id, rating_id does not exist!"
        raise e
        # error = "Invalid rating_id, rating_id does not exist!"
        # return error

def get_ratings_by_category(category_id):
    try:
        return Rating.query.filter_by(category_id=category_id)
    except SQLAlchemyError as e:
        # Log str(e.__dict__['orig'])
        raise e
        # error = str(e.__dict__['orig'])
        # return error

def create_rating(rating):
    try:
        new_rating_description = rating[0]
        new_rating_json = rating[1]
        new_category_id = rating[2]
        new_rating = Rating(
            rating_description=new_rating_description,
            rating_json=new_rating_json,
            category_id=new_category_id
        )
        db.session.add(new_rating)
        db.session.commit()
        return new_rating
    except SQLAlchemyError as e:
        # Log str(e.__dict__['orig'])
        raise e
        # error = str(e.__dict__['orig'])
        # return error

def replace_rating(rating, rating_id):
    try:
        one_rating = Rating.query.filery_by(rating_id=rating_id).first()
        if one_rating is None:
            raise InvalidRatingsID
        one_rating.rating_id = rating[0]
        one_rating.rating_description = rating[1]
        one_rating.rating_json = rating[2]
        one_rating.category_id = rating[3]
        db.session.commit()
        return one_rating
    except SQLAlchemyError as e:
        # Log str(e.__dict__['orig'])
        raise e
        # error = str(e.__dict__['orig'])
        # return error
    except InvalidRatingsID as e:
        # Log "Invalid rating_id, rating_id does not exist!"'
        raise e
        # error = "Invalid rating_id, rating_id does not exist!"
        # return error

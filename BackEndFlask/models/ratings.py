from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Rating
from models.logger import logger

class InvalidRatingsID(Exception):
    def __init__(self):
        self.message = "Raised when rating_id does not exist!!!"

    def __str__(self):
        return self.message


def get_ratings():
    try:
        return Rating.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_rating(rating_id):
    try:
        one_rating = Rating.query.filter_by(rating_id=rating_id).first()
        if one_rating is None:
            raise InvalidRatingsID
        return one_rating
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidRatingsID:
        logger.error(f"{str(e)} {rating_id}")
        raise e


def get_ratings_by_category(category_id):
    try:
        return Rating.query.filter_by(category_id=category_id)
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


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
        logger.error(str(e.__dict__['orig']))
        raise e


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
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidRatingsID as e:
        logger.error(f"{str(e)} {rating_id}")
        raise e

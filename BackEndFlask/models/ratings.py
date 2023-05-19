from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Ratings

class InvalidRatingsID(Exception):
    "Raised when rating_id does not exist!!!"
    pass

def get_ratings():
    try:
        return Ratings.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_rating(rating_id):
    try:
        one_rating = Ratings.query.filter_by(rating_id=rating_id).first()
        if one_rating is None:
            raise InvalidRatingsID
        return one_rating
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRatingsID:
        error = "Invalid rating_id, rating_id does not exist!"
        return error
      
def create_rating(rating_data):
    try:
        rating_data = Ratings(
            rating_id=rating_data["rating_id"],
            rating_name=rating_data["rating_name"],
            rating_description=rating_data["rating_description"],
            rating_json=rating_data["rating_json"],
            category_id=rating_data["category_id"], 
        )
        db.session.add(rating_data)
        db.session.commit()
        return rating_data
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_rating(rating, rating_id):
    try:
        one_rating = Ratings.query.filery_by(rating_id=rating_id).first()
        if one_rating is None:
            raise InvalidRatingsID
        one_rating.rubric_id = rating[0]
        one_rating.name      = rating[1]
        one_rating.ratings   = rating[2]
        db.session.commit()
        return one_rating
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRatingsID:
        error = "Invalid rating_id, rating_id does not exist!"
        return error
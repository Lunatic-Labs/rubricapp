from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Blacklist

def get_token(token):
    try:
        return Blacklist.query.filter_by(token=token).first()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def blackListToken(bad_token):
    try:
        blacklisted = Blacklist(token = bad_token)
        db.session.add(blacklisted)
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import InstructorTaCourse

class InvalidITCID(Exception):
    "Raised when itc_id does not exist!!!"
    pass

def get_itcs():
    try:
        return InstructorTaCourse.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_itc(itc_id):
    try:
        one_itc = InstructorTaCourse.query.get(itc_id).first()
        if one_itc is None:
            raise InvalidITCID
        return one_itc
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidITCID:
        error = "Invalid itc_id, itc_id does not exist!"
        return error
    
def create_itc(itc_data):
    try:
        itc_data = InstructorTaCourse(
            owner_id=itc_data['owner_id'],
            ta_id=itc_data['ta_id'],
            course_id=itc_data['course_id']
        )
        db.session.add(itc_data)
        db.session.commit()
        return itc_data
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_course(itc_data, itc_id):
    try:
        one_itc = InstructorTaCourse.query.filter_by(itc_id=itc_id).first()
        if one_itc is None:
            raise InvalidITCID
        one_itc.owner_id  = itc_data["owner_id"]
        one_itc.ta_id     = itc_data["ta_id"]
        one_itc.course_id = itc_data["course_id"]
        db.session.commit()
        return one_itc
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidITCID:
        error = "Invalid itc_id, itc_id does not exist!"
        return error



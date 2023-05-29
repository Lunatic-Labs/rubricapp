from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import UserCourse

class InvalidUCID(Exception):
    "Raised when uc_id does not exist!!!"
    pass

def get_user_courses():
    try:
        return UserCourse.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_user_courses_by_course_id(course_id):
    try:
        return UserCourse.query.filter_by(course_id=course_id)
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_user_course_by_user_id_and_course_id(user_id, course_id):
    try:
        return UserCourse.query.filter_by(user_id=user_id, course_id=course_id).first()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_user_course(user_course_id):
    try:
        one_user_course = UserCourse.query.filter_by(user_course_id=user_course_id).first()
        if one_user_course is None:
            raise InvalidUCID
        return one_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUCID:
        error = "Invalid uc_id, uc_id does not exist!"
        return error
 
def create_user_course(usercourse_data):
    try:
        new_user_course = UserCourse(
            user_id = usercourse_data["user_id"],
            course_id = usercourse_data["course_id"]
        )
        db.session.add(new_user_course)
        db.session.commit()
        return new_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_user_course(usercourse_data, user_course_id):
    try:
        one_user_course = UserCourse.query.filter_by(user_course_id=user_course_id).first()
        if one_user_course is None:
            raise InvalidUCID
        one_user_course.user_id = usercourse_data["user_id"]
        one_user_course.course_id = usercourse_data["course_id"]
        db.session.commit()
        return one_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUCID:
        error = "Invalid uc_id, uc_id does not exist!"
        return error

"""
Delete is meant for the summer semester!!!
"""
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import UserCourse

class InvalidUserCourseCombo(Exception):
    "Raised when user_id-course_id combination does not exist!!!"
    pass

def get_user_courses():
    try:
        return UserCourse.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_user_course(user_id, course_id):
    try:
        one_user_course = UserCourse.query.filter((UserCourse.user_id == user_id) & (UserCourse.course_id == course_id))
        if(type(one_user_course) == type(None)):
            raise InvalidUserCourseCombo
        return one_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserCourseCombo:
        error = "Invalid user_id-course_id combination, user_id-course_id combination does not exist!"
        return error

def create_user_course(usercoruse):
    try:
        new_user_id   = usercoruse[0]
        new_course_id = usercoruse[1]
        new_user_course = UserCourse(user_id=new_user_id, course_id=new_course_id)
        db.session.add(new_user_course)
        db.session.commit()
        return new_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_user_course(usercourse, user_id, course_id):
    try:
        one_user_course = UserCourse.query.filter((UserCourse.user_id == user_id) & (UserCourse.course_id == course_id)).first()
        if(type(one_user_course) == type(None)):
            raise InvalidUserCourseCombo
        one_user_course.user_id   = usercourse[0]
        one_user_course.course_id = usercourse[1]
        db.session.commit()
        return one_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserCourseCombo:
        error = "Invalid user_id-course_id combination, user_id-course_id combination does not exist!"
        return error

"""
Delete is meant for the summer semester!!!
"""
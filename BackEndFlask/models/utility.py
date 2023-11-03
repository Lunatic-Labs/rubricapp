from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Course, UserCourse

def get_courses_by_user_courses_by_user_id(user_id):
    try:
        return db.session.query(Course, UserCourse.role_id).join(UserCourse, Course.course_id == UserCourse.course_id).filter_by(user_id=user_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

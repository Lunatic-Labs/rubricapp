from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import User, Course, UserCourse

def get_courses_by_user_courses_by_user_id(user_id):
    try:
        courses = []
        courses_and_role_ids = db.session.query(
            Course,
            UserCourse.role_id
        ).join(
            UserCourse,
            Course.course_id == UserCourse.course_id
        ).filter_by(
            user_id=user_id
        ).all()
        for course_and_role_id in courses_and_role_ids:
            course, role_id = course_and_role_id
            course.role_id = role_id
            courses.append(course)
        return courses
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_users_by_course_id_and_role_id(course_id, role_id):
    try:
        users = []
        users_and_role_ids = db.session.query(
            User,
            UserCourse.role_id
        ).join(
            UserCourse,
            User.user_id == UserCourse.user_id
        ).filter_by(
            course_id=course_id
        )
        if role_id is not None:
            users_and_role_ids = users_and_role_ids.filter_by(
                role_id=role_id
            )
        for user_and_role in users_and_role_ids.all():
            user, retrieved_role_id = user_and_role
            user.role_id = retrieved_role_id
            users.append(user)
        return users
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_users_by_role_id(role_id):
    try:
        users = []
        all_users_with_role_id = db.session.query(
            User,
            UserCourse.role_id
        ).join(
            UserCourse,
            UserCourse.user_id==User.user_id
        ).filter_by(
            role_id=role_id
        ).all()
        for user_with_role_id in all_users_with_role_id:
            user, role_id = user_with_role_id
            user.role_id = role_id
            users.append(user)
        return users
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

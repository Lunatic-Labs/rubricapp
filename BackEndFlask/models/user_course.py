from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import UserCourse
from models.logger import logger

class InvalidUserCourseID(Exception):
    def __init__(self):
        self.message = "Invalid user_course_id, user_course_id does not exist"

    def __str__(self):
        return self.message


def get_user_courses():
    try:
        return UserCourse.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_courses_by_course_id(course_id):
    try:
        return UserCourse.query.filter_by(course_id=course_id, active=True).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_courses_by_user_id(user_id):
    try:
        return UserCourse.query.filter_by(user_id=user_id, active=True).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_courses_by_user_id_and_course_id(user_id, course_id):
    try:
        return UserCourse.query.filter_by(user_id=user_id, course_id=course_id, active=True).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_course_by_user_id_and_course_id(user_id, course_id):
    try:
        return UserCourse.query.filter_by(user_id=user_id, course_id=course_id).first()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_course(user_course_id):
    try:
        one_user_course = UserCourse.query.filter_by(user_course_id=user_course_id).first()
        if one_user_course is None:
            logger.error(f"Invalid user_course_id, user_course_id {user_course_id} does not exist!")
            raise InvalidUserCourseID
        return one_user_course
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidUserCourseID as e:
        logger.error(f"{str(e)}: {user_course_id}")
        raise e


def get_user_course_user_id(user_course_id):
    try:
        return UserCourse.query.filter_by(user_course_id=user_course_id).first().user_id
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def create_user_course(usercourse_data):
    try:
        new_user_course = UserCourse(
            user_id=usercourse_data["user_id"],
            course_id=usercourse_data["course_id"],
            role_id=usercourse_data["role_id"],
            active=True
        )
        db.session.add(new_user_course)
        db.session.commit()
        return new_user_course
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def load_demo_user_course_admin():
    for course_id in range(1, 5):
        create_user_course({
            "user_id": 2,
            "course_id": course_id,
            "role_id": 3
        })

def load_demo_user_course_ta_instructor():
    create_user_course({
        "user_id": 3,
        "course_id": 1,
        "role_id": 4,
        "active": True
    })

def load_demo_user_course_student():
    for user_id in range(4, 14):
        create_user_course({
            "user_id": user_id,
            "course_id": 1,
            "role_id": 5,
            "active": True
        })

def replace_user_course(usercourse_data, user_course_id):
    try:
        one_user_course = UserCourse.query.filter_by(user_course_id=user_course_id).first()
        if one_user_course is None:
            logger.error(f"Invalid user_course_id, user_course_id {user_course_id} does not exist!")
            raise InvalidUserCourseID
        one_user_course.user_id = usercourse_data["user_id"]
        one_user_course.course_id = usercourse_data["course_id"]
        one_user_course.active = usercourse_data["active"]
        one_user_course.role_id = usercourse_data["role_id"]
        db.session.commit()
        return one_user_course
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidUserCourseID as e:
        logger.error(f"{str(e)}: {user_course_id}")
        raise e


def set_inactive_status_of_user_to_active(user_course_id):
    try:
        user_course = UserCourse.query.filter_by(user_course_id=user_course_id).first()
        user_course.active = True
        db.session.commit()
    except InvalidUserCourseID as e:
        logger.error(f"{str(e)}: {user_course_id}")
        raise e
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def set_active_status_of_user_to_inactive(user_id, course_id):
    try:
        one_user_course = UserCourse.query.filter_by(user_id=user_id, course_id=course_id).first()
        one_user_course.active = False
        db.session.commit()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

def delete_user_course_by_user_id_course_id(user_id, course_id):
    try:
        UserCourse.query.filter_by(user_id=user_id, course_id=course_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def delete_user_course(user_course_id):
    try:
        UserCourse.query.filter_by(user_course_id=user_course_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e

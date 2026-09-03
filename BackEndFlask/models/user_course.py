from core import db
from models.schemas import UserCourse
from models.utility import error_log
from sqlalchemy import delete, func, select
from enums.roles import Roles

class InvalidUserCourseID(Exception):
    def __init__(self, id):
        self.message = f"Invalid user_course_id: {id}."

    def __str__(self):
        return self.message


@error_log
def get_user_courses():
    return db.session.scalars(select(UserCourse)).all()


@error_log
def get_user_courses_by_course_id(course_id):
    return db.session.scalars(
        select(UserCourse).filter_by(course_id=course_id, active=True)
    ).all()

@error_log
def get_user_course_student_count_by_course_id(course_id):
    return db.session.scalar(
        select(func.count()).select_from(
            select(UserCourse).filter_by(course_id=course_id, active=True, role_id=5).subquery()
        )
    )

@error_log
def get_user_courses_by_user_id(user_id):
    return db.session.scalars(
        select(UserCourse).filter_by(user_id=user_id, active=True)
    ).all()


@error_log
def get_user_courses_by_user_id_and_course_id(user_id, course_id):
    return db.session.scalars(
        select(UserCourse).filter_by(user_id=user_id, course_id=course_id, active=True)
    ).all()


@error_log
def get_user_course_by_user_id_and_course_id(user_id, course_id):
    return db.session.scalars(
        select(UserCourse).filter_by(user_id=user_id, course_id=course_id).limit(1)
    ).first()


@error_log
def get_user_course(user_course_id):
    one_user_course = db.session.scalars(
        select(UserCourse).filter_by(user_course_id=user_course_id).limit(1)
    ).first()

    if one_user_course is None:
        raise InvalidUserCourseID(user_course_id)

    return one_user_course


@error_log
def get_user_course_user_id(user_course_id):
    return db.session.scalars(
        select(UserCourse).filter_by(user_course_id=user_course_id).limit(1)
    ).first().user_id


@error_log
def create_user_course(usercourse_data):
    new_user_course = UserCourse(
        user_id=usercourse_data["user_id"],
        course_id=usercourse_data["course_id"],
        role_id=usercourse_data["role_id"],
        active=True
    )

    db.session.add(new_user_course)
    db.session.commit()

    return new_user_course


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
    for course_id in range(1, 5):
        for user_id in range(4, 14):
            create_user_course({
                "user_id": user_id,
                "course_id": course_id,
                "role_id": 5,
                "active": True
            })


@error_log
def replace_user_course(usercourse_data, user_course_id):
    one_user_course = db.session.scalars(
        select(UserCourse).filter_by(user_course_id=user_course_id).limit(1)
    ).first()

    if one_user_course is None:
        raise InvalidUserCourseID(user_course_id)

    one_user_course.user_id = usercourse_data["user_id"]
    one_user_course.course_id = usercourse_data["course_id"]
    one_user_course.active = usercourse_data["active"]
    one_user_course.role_id = usercourse_data["role_id"]

    db.session.commit()

    return one_user_course


@error_log
def replace_role_id_given_user_id_and_course_id(user_id, course_id, role_id):
    one_user_course = db.session.scalars(
        select(UserCourse).filter_by(user_id=user_id, course_id=course_id).limit(1)
    ).first()

    if one_user_course is None:
        raise Exception("Invalid user_id or course_id")
    
    one_user_course.role_id = role_id

    db.session.commit()

    return one_user_course


@error_log
def set_inactive_status_of_user_to_active(user_course_id):
    user_course = db.session.scalars(
        select(UserCourse).filter_by(user_course_id=user_course_id).limit(1)
    ).first()
    user_course.active = True

    db.session.commit()


@error_log
def set_active_status_of_user_to_inactive(user_id, course_id):
    one_user_course = db.session.scalars(
        select(UserCourse).filter_by(user_id=user_id, course_id=course_id).limit(1)
    ).first()
    one_user_course.active = False

    db.session.commit()


@error_log
def delete_user_course_by_user_id_course_id(user_id, course_id):
        db.session.execute(delete(UserCourse).filter_by(user_id=user_id, course_id=course_id))

        db.session.commit()


@error_log
def delete_user_course(user_course_id):
    db.session.execute(delete(UserCourse).filter_by(user_course_id=user_course_id))

    db.session.commit()

def get_role_from_usercourse_by_userid_courseid(user_id: int, course_id: int) -> Roles:
    stmt = select(
        UserCourse.role_id
    ).where(
        UserCourse.user_id == user_id,
        UserCourse.course_id == course_id
    )

    value = db.session.execute(stmt).scalar_one()

    return Roles(value)
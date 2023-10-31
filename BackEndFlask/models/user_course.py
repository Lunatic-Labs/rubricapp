from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import UserCourse

class InvalidUserCourseID(Exception):
    "Raised when user_course_id does not exist!!!"
    pass

def get_user_courses():
    try:
        return UserCourse.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

# Check if we also need to only return active user_courses
def get_user_courses_by_course_id(course_id, check_active=True):
    try:
        return UserCourse.query.filter_by(course_id=course_id, active=True).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

# Update function to only return user_courses the student is active in DUN
def get_user_courses_by_user_id(user_id):
    try:
        # return UserCourse.query.filter_by(user_id=user_id).all()
        return UserCourse.query.filter_by(user_id=user_id, active=True).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

# Update function to only return active students DUN
def get_user_courses_by_user_id_and_course_id(user_id, course_id):
    try:
        # return UserCourse.query.filter_by(user_id=user_id, course_id=course_id).all()
        return UserCourse.query.filter_by(user_id=user_id, course_id=course_id, active=True).all()
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
            raise InvalidUserCourseID
        return one_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserCourseID:
        error = "Invalid user_course_id, user_course_id does not exist!"
        return error
 
def get_user_course_user_id(user_course_id):
    try:
        return UserCourse.query.filter_by(user_course_id=user_course_id).first().user_id
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

# Update this function to take in an active status. Ask Brian if first or second if statement is correct or both wrong.
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
        error = str(e.__dict__['orig'])
        return error

# Update this function call to pass an active status of true DUN
def load_demo_user_course_ta_instructor():
    create_user_course({
        "user_id": 3,
        "course_id": 1,
        "role_id": 4,
        "active": True
    })

# Update this function call to pass an active status of true DUN
def load_demo_user_course_student():
    for user_id in range(4, 14):
        create_user_course({
            "user_id": user_id,
            "course_id": 1,
            "role_id": 5,
            "active": True
        })
    
# Update this function to update active status also. Ask Brian if 5th line is correct.
def replace_user_course(usercourse_data, user_course_id):
    try:
        one_user_course = UserCourse.query.filter_by(user_course_id=user_course_id).first()
        if one_user_course is None:
            raise InvalidUserCourseID
        set_active_status_of_user_to_inactive(usercourse_data["user_id"], user_course_id)
        one_user_course.user_id = usercourse_data["user_id"]
        one_user_course.course_id = usercourse_data["course_id"]
        db.session.commit()
        return one_user_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserCourseID:
        error = "Invalid user_course_id, user_course_id does not exist!"
        return error

# TODO: Create a function that toggles the active status of a user_course given a
# user_id
# course_id
def set_active_status_of_user_to_inactive(user_id, course_id):
    user_to_change = UserCourse.query.filter_by(user_id=user_id, course_id=course_id)
    if user_to_change.active is True:
        user_to_change.active = False

def delete_user_course_by_user_id_course_id(user_id, course_id):
    try:
        UserCourse.query.filter_by(user_id=user_id, course_id=course_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
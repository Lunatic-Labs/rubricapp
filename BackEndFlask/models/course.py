from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Course

class InvalidCourseID(Exception):
    "Raised when course_id does not exist!!!"
    pass
    
def get_courses():
    try:
        return Course.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_course(course_id):
    try:
        one_course = Course.query.filter_by(course_id=course_id).first()
        if one_course is None:
            raise InvalidCourseID
        return one_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCourseID:
        error = "Invalid course_id, course_id does not exit!"
        return error

def get_courses_by_admin_id(admin_id):
    try:
        return Course.query.filter_by(admin_id=admin_id)
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def create_course(course_data):
    try:
        course_data = Course(
            course_number=course_data["course_number"],
            course_name=course_data["course_name"],
            year=course_data["year"],
            term=course_data["term"],
            active=course_data["active"],
            admin_id=course_data["admin_id"],
            use_tas=course_data["use_tas"],
            fixed_teams=course_data["fixed_teams"]
        )
        db.session.add(course_data)
        db.session.commit()
        return course_data
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def load_SuperAdminCourse():
    create_course({
        "course_number": "SAU001",
        "course_name": "Super Admin Course",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": 1,
        "use_tas": True,
        "fixed_teams": True
    })

def replace_course(course_data, course_id):
    try:
        one_course = Course.query.filter_by(course_id=course_id).first()
        if one_course is None:
            raise InvalidCourseID
        one_course.course_number = course_data["course_number"]
        one_course.course_name = course_data["course_name"]
        one_course.year = course_data["year"]
        one_course.term = course_data["term"]
        one_course.active = course_data["active"]
        one_course.admin_id = course_data["admin_id"]
        one_course.use_tas = course_data["use_tas"]
        one_course.fixed_teams = course_data["fixed_teams"]
        db.session.commit()
        return one_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCourseID:
        error = "Invalid course_id, course_id does not exist!"
        return error
    
"""
Delete is meant for the summer semester!!!
"""

# def delete_course(course_id):
#     try:
#         Course.query.filter_by(id=course_id).delete()
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False

# def delete_all_Course():
#     try:
#         all_Course = Course.query.all()
#         db.session.delete(all_Course)
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False
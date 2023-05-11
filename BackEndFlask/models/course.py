from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Course

class InvalidCourseID(Exception):
    "Raised when course_id does not exist!!!"
    pass

class Course(UserMixin, db.Model):
    __tablename__ = "Course"
    __table_args__ = {'sqlite_autoincrement': True}
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.Integer, nullable=False)
    course_name = db.Column(db.String(10), nullable=False)
    year = db.Column(db.String(50), nullable=False)
    term = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False)
    
def get_courses():
    try:
        return Course.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_course(course_id):
    try:
        one_course = Course.query.get(course_id)
        if(type(one_course) == type(None)):
            raise InvalidCourseID
        return one_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCourseID:
        error = "Invalid course_id, course_id does not exit!"
        return error

def create_course(course_data):
    try:
        course_data = Course(course_number=course_data["course_number"], course_name=course_data["course_name"], 
                             year=course_data["year"], term=course_data["term"], active=course_data["active"], admin_id=course_data["admin_id"])
        db.session.add(course_data)
        db.session.commit()
        return course_data
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_course(course_data, course_id):
    try:
        one_course = Course.query.filter_by(course_id=course_id).first()
        print(one_course)
        print(course_data["course_name"])
        if(type(one_course) == type(None)):
            raise InvalidCourseID
        one_course.course_number = course_data["course_number"]
        one_course.course_name = course_data["course_name"]
        one_course.year = course_data["year"]
        one_course.term = course_data["term"]
        one_course.active = course_data["active"]
        one_course.admin_id = course_data["admin_id"]
        db.session.commit()
        return one_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCourseID:
        error = "Invalid course_id, course_id does not exist!"

"""
All code below has not been updated since user.py was modified on 4/15/2023
"""
    
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
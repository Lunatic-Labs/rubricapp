from core import db, UserMixin
from sqlalchemy import ForeignKey, Enum, Boolean
from sqlalchemy.exc import SQLAlchemyError

class InvalidCourseID(Exception):
    "Raised when course_id does not exist!!!"
    pass

class Course(UserMixin, db.Model):
    __tablename__ = "Course"
    __table_args__ = {'sqlite_autoincrment': True}
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.Integer, nullable=False)
    course_name = db.Column(db.String(10), nullable=False)
    year = db.Column(db.Date, nullable=False)
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
        one_course = Course.query.filter_by(id=course_id)
        if(type(one_course) == type(None)):
            raise InvalidCourseID
        return one_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCourseID:
        error = "Invalid course_id, course_id does not exit!"
        return error

def create_course(course):
    try:
        new_course_number = course[0]
        new_course_name = course[1]
        new_year = course[2]
        new_term = course[3]
        new_active = course[4]
        new_admin_id = course[5]
        new_course = Course(course_number=new_course_number, course_name=new_course_name, year=new_year, term=new_term, active=new_active, admin_id=new_admin_id)
        db.session.add(new_course)
        db.session.commit()
        return new_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_course(course, id):
    try:
        one_course = Course.query.filter_by(course_id=id).first()
        if(type(one_course) == type(None)):
            raise InvalidCourseID
        one_course.course_number = course[0]
        one_course.course_name = course[1]
        one_course.year = course[2]
        one_course.term = course[3]
        one_course.active = course[4]
        one_course.admin_id = course[5]
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

# def update_course_course_number(course_id, new_course_number):
#     try:
#         one_course = Course.query.filter_by(id=course_id).first()
#         one_course.course_number = new_course_number
#         db.session.add(one_course)
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False
    
# def update_course_course_name(course_id, new_course_name):
#     try:
#         one_course = Course.query.filter_by(id=course_id).first()
#         one_course.course_name = new_course_name
#         db.session.add(one_course)
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False

# def update_course_year(course_id, new_year):
#     try:
#         one_course = Course.query.filter_by(id=course_id).first()
#         one_course.year = new_year
#         db.session.add(one_course)
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False

# def update_course_term(course_id, new_term):
#     try:
#         one_course = Course.query.filter_by(id=course_id).first()
#         one_course.institution = new_term
#         db.session.add(one_course)
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False
    

# def update_course_active(course_id, new_active):
#     try:
#         one_course = Course.query.filter_by(id=course_id).first()
#         one_course.active = new_active
#         db.session.add(one_course)
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False
    
# def update_course_admin_id(course_id, new_admin_id):
#     try:
#         one_course = Course.query.filter_by(id=course_id).first()
#         one_course.admin_id = new_admin_id
#         db.session.add(one_course)
#         db.session.commit()
#         all_Course = Course.query.all()
#         return all_Course
#     except:
#         return False
    
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
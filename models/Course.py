from core import db, UserMixin
import enum
from sqlalchemy import ForeignKey, Enum, Boolean

class Course(UserMixin, db.Model):
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.Integer, nullable=False)
    course_name = db.Column(db.String(10), nullable=False)
    year = db.Column(db.Date, nullable=False)
    term = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey("User.user_id"), nullable=False)
    
def get_Course():
    try:
        return Course.query.all()
    except:
        return False

def get_course(course_id):
    one_course = Course.query.filter_by(id=course_id)
    return one_course

def create_course(course):
    try:
        (new_course_number, new_course_name, new_year, new_term, new_active, new_admin_id) = course
        new_course = Course(course_number=new_course_number, course_name=new_course_name, year=new_year, term=new_term, active=new_active, admin_id=new_admin_id)
        print(new_course)
        db.session.add(new_course)
        db.session.commit()
        print(Course.query.all())
        return True
    except:
        return False

def replace_course(course_id, new_course_number, new_course_name, new_year, new_term, new_active, new_admin_id):
    try:
        one_course = Course.query.filter_by(id=course_id)
        one_course.course_number = new_course_number
        one_course.course_name = new_course_name
        one_course.year = new_year
        one_course.term = new_term
        one_course.active = new_active
        one_course.admin_id = new_admin_id
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course 
    except:
        return False

def update_course_course_number(course_id, new_course_number):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.course_number = new_course_number
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False
    
def update_course_course_name(course_id, new_course_name):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.course_name = new_course_name
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False

def update_course_year(course_id, new_year):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.year = new_year
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False

def update_course_term(course_id, new_term):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False

def update_course_active(course_id, new_active):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.role = new_active
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False

def update_course_admin_id(course_id, new_admin_id):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.institution = new_admin_id
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False

def delete_course(course_id):
    try:
        Course.query.filter_by(id=course_id).delete()
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False

def delete_all_Course():
    try:
        all_Course = Course.query.all()
        db.session.delete(all_Course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False
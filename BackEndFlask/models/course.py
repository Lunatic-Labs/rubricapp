from core import db, courseMixin
import enum
from sqlalchemy import ForeignKey, Enum, Boolean

class Course(courseMixin, db.Model):
    __tablename__ = "Course"
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.Integer, nullable=False)
    course_name = db.Column(db.String(10), nullable=False)
    year = db.Column(db.Date, nullable=False)
    term = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False)
    
    
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

def update_course_role(course_id, new_role):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.role = new_role
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False

def update_course_institution(course_id, new_institution):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.institution = new_institution
        db.session.add(one_course)
        db.session.commit()
        all_Course = Course.query.all()
        return all_Course
    except:
        return False
    

def update_course_consent(course_id, new_consent):
    try:
        one_course = Course.query.filter_by(id=course_id).first()
        one_course.consent = new_consent
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
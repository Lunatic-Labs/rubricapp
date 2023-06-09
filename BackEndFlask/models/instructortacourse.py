from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import InstructorTaCourse

class InvalidInstructorTaCourseID(Exception):
    "Raised when instructor_ta_course_id does not exist!!!"
    pass

def get_instructor_ta_courses():
    try:
        return InstructorTaCourse.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_instructor_ta_course(instructor_ta_course_id):
    try:
        one_instructor_ta_course = InstructorTaCourse.query.get(instructor_ta_course_id).first()
        if one_instructor_ta_course is None:
            raise InvalidInstructorTaCourseID
        return one_instructor_ta_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidInstructorTaCourseID:
        error = "Invalid instructor_ta_course_id, instructor_ta_course_id does not exist!"
        return error

def get_instructor_ta_course_by_owner_id_ta_id_course_id(owner_id, ta_id, course_id):
    try:
        return InstructorTaCourse.query.filter_by(owner_id=owner_id, ta_id=ta_id, course_id=course_id).first()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_instructor_ta_courses_by_course_id(course_id):
    try:
        return InstructorTaCourse.query.filter_by(course_id=course_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def create_instructor_ta_course(instructor_ta_course_data):
    try:
        instructor_ta_course_data = InstructorTaCourse(
            owner_id=instructor_ta_course_data['owner_id'],
            ta_id=instructor_ta_course_data['ta_id'],
            course_id=instructor_ta_course_data['course_id']
        )
        db.session.add(instructor_ta_course_data)
        db.session.commit()
        return instructor_ta_course_data
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_instructor_ta_course(instructor_ta_course_data, instructor_ta_course_id):
    try:
        one_instructor_ta_course = InstructorTaCourse.query.filter_by(instructor_ta_course_id=instructor_ta_course_id).first()
        if one_instructor_ta_course is None:
            raise InvalidInstructorTaCourseID
        one_instructor_ta_course.owner_id = instructor_ta_course_data["owner_id"]
        one_instructor_ta_course.ta_id = instructor_ta_course_data["ta_id"]
        one_instructor_ta_course.course_id = instructor_ta_course_data["course_id"]
        db.session.commit()
        return one_instructor_ta_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidInstructorTaCourseID:
        error = "Invalid instructor_ta_course_id, instructor_ta_course_id does not exist!"
        return error

def delete_instructor_ta_course_by_owner_id_ta_id_course_id(owner_id, ta_id, course_id):
    try:
        InstructorTaCourse.query.filter_by(owner_id=owner_id, ta_id=ta_id, course_id=course_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
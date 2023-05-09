from flask import jsonify, request
from flask_login import login_required
from models.course import *
from controller import bp
import ma

@bp.route('/get', methods = ['GET'])
def get_courses():
    all_courses = Course.query.all()
    results = courses_schema.dump(all_courses)
    return jsonify(results)

@bp.route('/get/<id>/', methods = ['GET'])
def post_details(id):
    course = Course.query.get(id)
    return course_schema.jsonify(course)

@bp.route('/add', methods = ['POST'])
def add_course():
    course_number = request.json['course_number']
    course_name = request.json['course_name']
    year = request.json['year']
    term = request.json['term']
    active = request.json['active']
    admin_id = request.json['admin_id']

    courses = Course(course_number, course_name, year, term, active, admin_id)
    db.session.add(courses)
    db.session.commit()
    return course_schema.jsonify(courses)

@bp.route('/update/<id>/', methods = ['PUT'])
def update_course(id):
    course = Course.query.get(id)
    
    course_number = request.json['course_number']
    course_name = request.json['course_name']
    year = request.json['year']
    term = request.json['term']
    active = request.json['active']
    admin_id = request.json['admin_id']

    course.course_number = course_number
    course.course_name = course_name
    course.year = year
    course.term = term
    course.active = active
    course.admin_id = admin_id

    db.session.commit()
    return course_schema.jsonify(course)

"""
Delete route below! Not to be implemented until the fall semester!
"""

# @bp.route('/delete/<id>/', methods = ['DELETE'])
# def course_delete(id):
#     course = Course.query.get(id)
#     db.session.delete(course)
#     db.session.commit()

#     return course_schema.jsonify(course)

class CourseSchema(ma.ma.Schema):
    class Meta:
        fields = ('course_id', 'course_number', 'course_name', 'year', 'term', 'active', 'admin_id')

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)

from flask import jsonify, request
from flask_login import login_required
from models.course import *
from controller import bp
import ma

@bp.route('/get', methods = ['GET'])
def get_courses():
    results = courses_schema.dump(Course.query.all())
    return jsonify(results)

@bp.route('/get/<id>/', methods = ['GET'])
def post_details(id):
    return course_schema.jsonify(Course.query.get(id))

@bp.route('/add', methods = ['POST'])
def add_course():
    course = Course(**request.json)
    db.session.add(course)
    db.session.commit()
    return course_schema.jsonify(course)

@bp.route('/update/<id>/', methods = ['PUT'])
def update_course(id):
    course = Course.query.get(id)
    course.update(**request.json)
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

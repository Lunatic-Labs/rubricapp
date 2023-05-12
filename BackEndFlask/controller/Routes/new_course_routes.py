from flask import jsonify, request, Response
from flask_login import login_required
from models.course import *
from controller import bp
import ma

@bp.route('/course', methods = ['GET'])
def get_all_courses():
    # edit this to make it one line!
    results = courses_schema.dump(get_courses())
    return jsonify(results)

@bp.route('/course/<id>/', methods = ['GET'])
def post_details(id):
    return course_schema.jsonify(get_course(id))

@bp.route('/add_course', methods = ['POST'])
def add_course():
    try:
        return course_schema.jsonify(create_course(request.json))
    except Exception:
        Response.update({'status' : 400, 'message' : "Error: Course not added", 'success' : False})
        return Response

@bp.route('/update_course/<id>/', methods = ['PUT'])
def update_course(id):
    print(request.json)
    results = course_schema.jsonify(replace_course(request.json, id))
    print(results)
    return results

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
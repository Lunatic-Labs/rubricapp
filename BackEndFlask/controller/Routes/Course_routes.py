from flask import jsonify, request, Response
from flask_login import login_required
from models.course import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/course', methods = ['GET'])
def get_all_courses():
    all_courses = get_courses()
    if type(all_courses)==type(""):
        print("[Course_routes /course GET] An error occurred retrieving all courses: ", all_courses)
        createBadResponse("An error occurred retrieving all courses!", all_courses, "courses")
        return response
    print("[Course_routes /course GET] Successfully retrieved all courses!")
    createGoodResponse("Successfully retrieved all courses!", courses_schema.dump(all_courses), 200, "courses")
    return response

@bp.route('/course/<int:id>', methods = ['GET'])
def get_one_course(id):
    one_course = get_course(id)
    if type(one_course)==type(""):
        print(f"[Course_routes /course/<int:id> GET] An error occurred fetching course_id: {id}, ", one_course)
        createBadResponse(f"An error occurred fetching course_id: {id}!", one_course, "courses")
        return response
    print(f"[Course_routes /course/<int:id> GET] Successfully fetched course_id: {id}!")
    createGoodResponse(f"Successfully fetched course_id: {id}!", course_schema.dump(one_course), 200, "courses")
    return response

@bp.route('/course', methods = ['POST'])
def add_course():
    new_course = create_course(request.json)
    if type(new_course)==type(""):
        print("[Course_routes /course POST] An error occurred creating a new course: ", new_course)
        createBadResponse("An error occurred creating a new course!", new_course, "courses")
        return response
    print("[Course_routes /course POST] Successfully created a new course!")
    createGoodResponse("Successfully created a new course!", course_schema.dump(new_course), 201, "courses")
    return response

@bp.route('/course/<int:id>', methods = ['PUT'])
def update_course(id):
    updated_course = replace_course(request.json, id)
    if type(updated_course)==type(""):
        print(f"[Course_routes /course/<int:id> PUT] An error occurred replacing course_id: {id}, ", updated_course)
        createBadResponse(f"An error occurred replacing course_id: {id}!", updated_course, "courses")
        return response
    print(f"[Course_routes /course/<int:id> PUT] Successfully replacing course_id: {id}!")
    createGoodResponse(f"Sucessfully replacing course_id: {id}!", course_schema.dump(updated_course), 201, "courses")
    return response

"""
Delete route below! Not to be implemented until the fall semester!
"""

# @bp.route('/delete/<id>/', methods = ['DELETE'])
# def course_delete(id):
#     course = Course.query.get(id)
#     db.session.delete(course)
#     db.session.commit()
#     return course_schema.jsonify(course)

class CourseSchema(ma.Schema):
    class Meta:
        fields = ('course_id', 'course_number', 'course_name', 'year', 'term', 'active', 'admin_id', 'use_tas')

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)

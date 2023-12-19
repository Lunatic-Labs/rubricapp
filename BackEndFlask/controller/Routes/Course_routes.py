from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.course import(
    create_course,
    replace_course
)
from models.user_course import (
    create_user_course
)
from models.utility import(
    get_courses_by_user_courses_by_user_id
)

@bp.route('/course', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_courses():
    # user_id of the logged in user is ensured to exist by authentication decorators!
    user_id = int(request.args.get("user_id"))

    # Retrieve all courses given the user_id
    all_courses = get_courses_by_user_courses_by_user_id(user_id)
    if type(all_courses)==type(""):
        print(f"[Course_routes /course GET] An error occurred retrieving all courses, ", all_courses)
        createBadResponse(f"An error occurred retrieving all courses!", all_courses, "courses")
        return response

    # Return a response of success with an array of converted json courses!
    print(f"[Course_routes /course] Successfully retrieved all courses for user_id: {user_id}!")
    createGoodResponse(f"Successfully retrieved all courses for user_id: {user_id}", courses_schema.dump(all_courses), 200, "courses")
    return response

@bp.route('/course', methods = ['POST'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def add_course():
    new_course = create_course(request.json)
    if type(new_course)==type(""):
        print("[Course_routes /course POST] An error occurred creating a new course: ", new_course)
        createBadResponse("An error occurred creating a new course!", new_course, "courses")
        return response

    user_id = int(request.args.get("user_id"))
    user_course = create_user_course({
        "user_id": user_id,
        "course_id": new_course.course_id,
        "role_id": 3
    })

    if type(user_course)==type(""):
        print(f"[User_routes /user?course_id=<int:id> POST] An error occurred enrolling admin in course_id: {new_course.course_id}, ", user_course)
        createBadResponse(f"An error occurred enrolling admin user in course_id: {new_course.course_id}!", user_course, "users")
        return response

    print("[Course_routes /course POST] Successfully created a new course!")
    createGoodResponse("Successfully created a new course!", course_schema.dump(new_course), 201, "courses")
    return response

@bp.route('/course', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def update_course():
    course_id = request.args.get("course_id")
    updated_course = replace_course(request.json, course_id)
    if type(updated_course)==type(""):
        print(f"[Course_routes /course/<int:course_id> PUT] An error occurred replacing course_id: {course_id}, ", updated_course)
        createBadResponse(f"An error occurred replacing a course!", updated_course, "courses")
        return response
    print(f"[Course_routes /course/<int:course_id> PUT] Successfully replaced course_id: {course_id}!")
    createGoodResponse(f"Sucessfully replaced course_id: {course_id}!", course_schema.dump(updated_course), 201, "courses")
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
        fields = (
            'course_id',
            'course_number',
            'course_name',
            'year',
            'term',
            'active',
            'admin_id',
            'use_tas',
            'use_fixed_teams',
            'role_id'
        )

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
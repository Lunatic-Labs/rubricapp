from flask import jsonify, request, Response
from models.course import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/course', methods = ['GET'])
def get_all_courses():
    try:
        if request.args and request.args.get("admin_id"):
            admin_id = request.args.get("admin_id")
            all_courses = get_courses_by_admin_id(admin_id)
            createGoodResponse(f"Successfully retrieved all courses created by admin_id: {admin_id}!", courses_schema.dump(all_courses), 200, "courses")
            return response

        all_courses = get_courses()
        createGoodResponse("Successfully retrieved all courses!",
                           courses_schema.dump(all_courses), 200, "courses")
        return response

    except Exception as e:
        createBadResponse("An error occurred retrieving all courses!", e, "courses")
        return response


@bp.route('/course/<int:course_id>', methods = ['GET'])
def get_one_course(course_id):
    try:
        one_course = get_course(course_id)
        createGoodResponse(f"Successfully fetched course_id: {course_id}!",
                           course_schema.dump(one_course), 200, "courses")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred fetching course_id: {course_id}!", e, "courses")
        return response


@bp.route('/course', methods = ['POST'])
def add_course():
    try:
        new_course = create_course(request.json)
        createGoodResponse("Successfully created a new course!",
                           course_schema.dump(new_course), 201, "courses")
        return response

    except Exception as e:
        createBadResponse("An error occurred creating a new course!", e, "courses")
        return response


@bp.route('/course/<int:course_id>', methods = ['PUT'])
def update_course(course_id):
    try:
        updated_course = replace_course(request.json, course_id)
        createGoodResponse(f"Sucessfully replaced course_id: {course_id}!",
                           course_schema.dump(updated_course), 201, "courses")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred replacing course_id: {course_id}!", e, "courses")
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
            'use_fixed_teams'
        )

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)

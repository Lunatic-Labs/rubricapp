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
from models.queries import(
    get_courses_by_user_courses_by_user_id
)


@bp.route('/course', methods=['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_all_courses():
    try:
        if request.args and request.args.get("admin_id"):
            admin_id = request.args.get("admin_id")
            all_courses = get_courses_by_admin_id(admin_id)

            return create_good_response(courses_schema.dump(all_courses), 200, "courses")

        all_courses = get_courses()

        return create_good_response(courses_schema.dump(all_courses), 200, "courses")

    except Exception as e:
        return create_bad_response(f"An effor occurred fetching all courses: {e}", "c")


@bp.route('/course/<int:course_id>', methods=['GET'])
def get_one_course(course_id):
    try:
        one_course = get_course(course_id)

        return create_good_response(course_schema.dump(one_course), 200, "courses")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching course_id: {e}", "courses")


@bp.route('/course', methods=['POST'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def add_course():
    try:
        new_course = create_course(request.json)

        user_id = int(request.args.get("user_id"))
        create_user_course({
            "user_id": user_id,
            "course_id": new_course.course_id,
            "role_id": 3
        })

        return create_good_response(course_schema.dump(new_course), 201, "courses")

    except Exception as e:
        return create_bad_response(f"An error occurred creating a new course: {e}", "courses")


@bp.route('/course', methods=['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def update_course():
    try:
        course_id = request.args.get("course_id")
        updated_course = replace_course(request.json, course_id)

        return create_good_response(course_schema.dump(updated_course), 201, "courses")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing a course{e}", "courses")


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

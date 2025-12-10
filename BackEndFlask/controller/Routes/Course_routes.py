from flask import request
from marshmallow import fields
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from core import ma


from controller.security.CustomDecorators import( 
    AuthCheck, bad_token_check,
    admin_check
)

from models.course import(
    get_course,
    create_course,
    replace_course,
    get_courses_by_admin_id
)

from models.user_course import (
    create_user_course,
    get_user_course_student_count_by_course_id
)

from models.queries import (
    get_courses_by_user_courses_by_user_id
)

from models.team import (
    get_team_count_by_course_id
)

@bp.route('/course', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_courses():
    try:
        if request.args and request.args.get("admin_id"):
            admin_id = request.args.get("admin_id")

            all_courses = get_courses_by_admin_id(admin_id)

            return create_good_response(courses_schema.dump(all_courses), 200, "courses")
        
        elif request.args and request.args.get("course_id"):
            course_id = request.args.get("course_id")

            student_count = []

            student_count.append(get_user_course_student_count_by_course_id(course_id))

            student_count.append(get_team_count_by_course_id(course_id))

            return create_good_response(student_count, 200, "course_count")

        all_courses = get_courses_by_user_courses_by_user_id(int(request.args.get("user_id")))
        print(all_courses)
        return create_good_response(courses_schema.dump(all_courses), 200, "courses")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching all courses: {e}", "courses", 400)


@bp.route('/one_course', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_one_course():
    try:
        course_id = int(request.args.get("course_id"))

        course = get_course(course_id)

        return create_good_response(course_schema.dump(course), 200, "courses")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching course_id: {e}", "courses", 400)


@bp.route('/course', methods=['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
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
        return create_bad_response(f"An error occurred creating a new course: {e}", "courses", 400)


@bp.route('/course', methods=['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def update_course():
    try:
        course_id = request.args.get("course_id")

        updated_course = replace_course(request.json, course_id)

        return create_good_response(course_schema.dump(updated_course), 201, "courses")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing a course{e}", "courses", 400)


class CourseSchema(ma.Schema):
    course_id         = fields.Integer()
    course_number     = fields.String()
    course_name       = fields.String()
    year              = fields.Integer()
    term              = fields.String()
    active            = fields.Boolean()
    UserCourse_active = fields.Boolean()
    admin_id          = fields.Integer()
    use_tas           = fields.Boolean()
    use_fixed_teams   = fields.Boolean()
    role_id           = fields.Integer()


course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)

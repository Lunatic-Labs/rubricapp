from flask import request, Blueprint, jsonify
from marshmallow import fields
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from models import db
from models.user import create_user, User
from models.course import Course

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

        return create_good_response(courses_schema.dump(all_courses), 200, "courses")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching all courses: {e}", "courses", 400)


@bp.route('/course', methods=['GET'])
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


# This endpoint is to retreive test student's information for 
# view as student feature.
# GET /api/courses/<course_id>/test_student_token
@bp.route('/courses/<int:course_id>/test_student_token', methods=['GET'])
@jwt_required()
def get_test_student_token(course_id):
    admin_id = get_jwt_identity()
    
    # only admin can access this endpoint
    course = Course.query.get(course_id)

    # find test student for the course
    test_email = f"teststudent{course_id}@skillbuilder.edu"
    test_student = User.query.filter_by(email=test_email).first()

    # create demo student if it doesn't exist
    if not test_student:
        payload = {
            "first_name": "Test",
            "last_name": "Student",
            "email": f"teststudent{course_id}@skillbuilder.edu",
            "password": "some_password",  # Make a password(!)
            "owner_id": admin_id
    }

    created = create_user(payload)
    test_student = User.query.filter_by(email=test_email).first()
    
    # Assign the test student to the course
    check_existing = get_user_course_student_count_by_course_id(test_student.user_id, course_id)
    if not check_existing: 
        create_user_course ({
            "user_id" : test_student.user_id,
            "course_id" : course_id,
            "role_id" : 5
        })

    # issue tokens for demo user
    access_token = create_access_token(identity=test_student.user_id)
    refresh_token = create_refresh_token(identity=test_student.user_id)

    return jsonify({
        "user": test_student,
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200


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

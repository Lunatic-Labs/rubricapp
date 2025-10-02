from flask import request, Blueprint, jsonify
from marshmallow import fields
from controller import bp, ma
from controller.Route_response import create_good_response, create_bad_response
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token

from core import db
from models.user import User
from models.user_course import UserCourse, get_user_course
from models.course import Course, get_course

from controller.security.CustomDecorators import( 
    AuthCheck, bad_token_check,
    admin_check
)

from models.course import(
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


# ONLY ONE DEFINITION OF THIS ROUTE
@bp.route('/course', methods=['GET'])
@jwt_required()
# @bad_token_check()  # Commented out to allow test students
# @AuthCheck()  # Commented out to allow test students
def get_all_courses():
    try:
        user_id = request.args.get("user_id")
        jwt_identity = get_jwt_identity()
        
        print(f"\n=== GET_ALL_COURSES CALLED ===")
        print(f"user_id parameter: {user_id}")
        print(f"JWT identity: {jwt_identity}")
        
        # Allow test students to access their own data
        if str(jwt_identity) != str(user_id):
            # Check if it's a test student
            user = User.query.get(user_id)
            if not (user and user.email and user.email.startswith("teststudent")):
                print(f"Access denied: JWT {jwt_identity} != user_id {user_id}")
                return create_bad_response("Unauthorized", "courses", 403)
        
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

        if not user_id:
            print("ERROR: user_id is required")
            return create_bad_response("user_id is required", "courses", 400)
        
        try:
            user_id = int(user_id)
            print(f"Converted user_id to int: {user_id}")
            
            user = User.query.get(user_id)
            
            if not user:
                print(f"ERROR: User {user_id} not found in database")
                return create_bad_response(f"User {user_id} not found", "courses", 404)
            
            print(f"Found user: {user.email}")
            
            # Check if this is a test student
            if user.email and user.email.startswith("teststudent"):
                print(f"This is a test student - handling specially")
                
                # Get enrollments for test student
                enrollments = UserCourse.query.filter_by(
                    user_id=user_id,
                    active=True
                ).all()
                
                print(f"Found {len(enrollments)} enrollments for test student")
                
                courses_data = []
                for enrollment in enrollments:
                    course = Course.query.get(enrollment.course_id)
                    if course:
                        # Build course data matching expected format
                        course_dict = {
                            "course_id": course.course_id,
                            "course_name": course.course_name,
                            "course_number": getattr(course, 'course_number', ''),
                            "year": getattr(course, 'year', 2024),
                            "term": getattr(course, 'term', ''),
                            "active": getattr(course, 'active', True),
                            "admin_id": getattr(course, 'admin_id', None),
                            "use_tas": getattr(course, 'use_tas', False),
                            "use_fixed_teams": getattr(course, 'use_fixed_teams', False),
                            "role_id": enrollment.role_id,
                            "UserCourse_active": enrollment.active
                        }
                        courses_data.append(course_dict)
                        print(f"Added course: {course.course_name} (ID: {course.course_id})")
                
                print(f"Returning {len(courses_data)} courses for test student")
                return create_good_response(courses_data, 200, "courses")
            
            # Normal user - use existing function
            print(f"Normal user, calling get_courses_by_user_courses_by_user_id")
            
            all_courses = get_courses_by_user_courses_by_user_id(user_id)
            
            if all_courses is None:
                print("No courses found, returning empty list")
                all_courses = []
            else:
                print(f"Found {len(all_courses)} courses")
            
            return create_good_response(courses_schema.dump(all_courses), 200, "courses")
            
        except Exception as e:
            print(f"ERROR processing user_id {user_id}: {str(e)}")
            import traceback
            print(f"Traceback:\n{traceback.format_exc()}")
            
            return create_bad_response(f"Error processing user {user_id}: {str(e)}", "courses", 422)

    except Exception as e:
        print(f"UNEXPECTED ERROR in get_all_courses: {str(e)}")
        import traceback
        print(f"Traceback:\n{traceback.format_exc()}")
        return create_bad_response(f"An error occurred fetching all courses: {e}", "courses", 500)


@bp.route('/course/<int:course_id>', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_one_course(course_id):
    try:
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

# New Endpooint: get_test_student_token
# This code creates or retrieves the test student information for a course.
# Used for: "View as Student" feature.
# Important: The JWT identity must be a STRING to avoid "Subject must be a string" error.
@bp.route('/courses/<int:course_id>/test_student_token', methods=['GET'])
@jwt_required()
def get_test_student_token(course_id):
    try:
        admin_id = get_jwt_identity()
        course = get_course(course_id)
        
        if not course:
            print(f"Course {course_id} not found!")
            return jsonify({
                "success": False,
                "error": f"Course {course_id} not found"
            }), 404
        
        test_email = f"teststudent{course_id}@skillbuilder.edu"         
        test_student = User.query.filter_by(email=test_email).first()
        
        # Ceck if test student exists in DB
        if not test_student:
            print(f"Test student not found, creating one...")
            
            try:
                # Create test student with ALL required fields
                test_student = User(
                    first_name="Test",
                    last_name="Student",
                    email=test_email,
                    password="TestPassword123!", # TODO: Change to a secure random password
                    owner_id=course.admin_id if hasattr(course, 'admin_id') else admin_id,
                    has_set_password=True,
                    is_admin=False,
                    consent=True,
                    lms_id=None,
                    reset_code=None
                )
                
                # Add and commit to DB
                db.session.add(test_student)
                db.session.commit()
                
                # Store new test student
                test_student = User.query.filter_by(email=test_email).first()
                
                if test_student: # Check if enrolled
                    existing = UserCourse.query.filter_by(
                        user_id=test_student.user_id,
                        course_id=course_id
                    ).first()
                    
                    if not existing: # Enroll if not already enrolled
                        test_user_course = UserCourse(
                            user_id=test_student.user_id,
                            course_id=course_id,
                            role_id=5,
                            active=True
                        )
                        db.session.add(test_user_course)
                        db.session.commit()
                else:
                    return jsonify({
                        "success": False,
                        "error": "Failed to create test student"
                    }), 500
                    
            except Exception as create_error:
                db.session.rollback()
                return jsonify({
                    "success": False,
                    "error": f"Failed to create test student: {str(create_error)}"
                }), 500
            
            # Check enrollment for existing test student too
            existing = UserCourse.query.filter_by(
                user_id=test_student.user_id,
                course_id=course_id
            ).first()
            
            if not existing:
                test_user_course = UserCourse(
                    user_id=test_student.user_id,
                    course_id=course_id,
                    role_id=5,  # Student role
                    active=True
                )
                db.session.add(test_user_course)
                db.session.commit()
        
        # Create tokens for the test student   
        try:
            # CRITICAL FIX: Convert user_id to string for JWT identity
            # This fixes the "Subject must be a string" error
            access_token = create_access_token(identity=str(test_student.user_id))
            refresh_token = create_refresh_token(identity=str(test_student.user_id))
        except Exception as token_error:
            print(f"Error creating tokens: {str(token_error)}")
            return jsonify({
                "success": False,
                "error": f"Failed to create tokens: {str(token_error)}"
            }), 500
        
        # Build response
        response_data = {
            "success": True,
            "user": {
                "user_id": test_student.user_id,  # Keep as integer in response
                "user_name": f"{test_student.first_name} {test_student.last_name}",
                "first_name": test_student.first_name,
                "last_name": test_student.last_name,
                "email": test_student.email,
                "isAdmin": False,
                "isSuperAdmin": False,
                "has_set_password": True
            },
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"!!! UNEXPECTED ERROR in get_test_student_token: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# Schema definitions
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
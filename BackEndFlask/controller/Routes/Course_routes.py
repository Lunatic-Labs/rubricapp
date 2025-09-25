from flask import request, Blueprint, jsonify
from marshmallow import fields
from controller import bp, ma
from controller.Route_response import create_good_response, create_bad_response
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token

from core import db
from models.user import User
from models.user_course import UserCourse, get_user_course
from models.course import get_course

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
    get_user_course_student_count_by_course_id,
    get_user_course
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
        user_id = request.args.get("user_id")
        
        print(f"\n=== GET_ALL_COURSES CALLED ===")
        print(f"user_id parameter: {user_id}")
        print(f"JWT identity: {get_jwt_identity()}")
        
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
            
            # Check if this is a test student
            from models.user import User
            from models.course import Course
            
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
                            "course_number": course.course_number,
                            "year": course.year,
                            "term": course.term,
                            "active": course.active,
                            "admin_id": course.admin_id,
                            "use_tas": course.use_tas if hasattr(course, 'use_tas') else False,
                            "use_fixed_teams": course.use_fixed_teams if hasattr(course, 'use_fixed_teams') else False,
                            "role_id": enrollment.role_id,
                            "UserCourse_active": enrollment.active
                        }
                        courses_data.append(course_dict)
                        print(f"Added course: {course.course_name} (ID: {course.course_id})")
                
                print(f"Returning {len(courses_data)} courses for test student")
                return create_good_response(courses_data, 200, "courses")
            
            # Normal user - use existing function
            print(f"Normal user, calling get_courses_by_user_courses_by_user_id")
            
            try:
                all_courses = get_courses_by_user_courses_by_user_id(user_id)
                
                if all_courses is None:
                    print("No courses found, returning empty list")
                    all_courses = []
                else:
                    print(f"Found {len(all_courses)} courses")
                
                return create_good_response(courses_schema.dump(all_courses), 200, "courses")
                
            except Exception as func_error:
                print(f"ERROR in get_courses_by_user_courses_by_user_id: {str(func_error)}")
                
                # If it's a test student that somehow got here, return empty courses
                if user.email and user.email.startswith("teststudent"):
                    print("Returning empty courses for test student due to function error")
                    return create_good_response([], 200, "courses")
                
                raise func_error
            
        except Exception as e:
            print(f"ERROR processing user_id {user_id}: {str(e)}")
            import traceback
            print(f"Traceback:\n{traceback.format_exc()}")
            
            # Return 422 with detailed error
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
        # create_course already creates the test student
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


@bp.route('/courses/<int:course_id>/test_student_token', methods=['GET'])
@jwt_required()
def get_test_student_token(course_id):
    print(f"=== TEST STUDENT TOKEN ENDPOINT CALLED ===")
    print(f"Course ID received: {course_id}")
    
    try:
        admin_id = get_jwt_identity()
        print(f"Admin ID from token: {admin_id}")
        
        # Verify the course exists
        print(f"Looking for course {course_id}...")
        course = get_course(course_id)
        
        if not course:
            print(f"Course {course_id} not found!")
            return jsonify({
                "success": False,
                "error": f"Course {course_id} not found"
            }), 404
        
        print(f"Course found: {course.course_name if hasattr(course, 'course_name') else 'course object'}")
        
        # The test student email
        test_email = f"teststudent{course_id}@skillbuilder.edu"
        print(f"Looking for test student with email: {test_email}")
        
        test_student = User.query.filter_by(email=test_email).first()
        
        if not test_student:
            print(f"Test student not found, creating one...")
            
            try:
                # Create test student with ALL required fields
                test_student = User(
                    first_name="Test",
                    last_name="Student",
                    email=test_email,
                    password="TestPassword123!",
                    owner_id=course.admin_id if hasattr(course, 'admin_id') else admin_id,
                    has_set_password=True,  # Set this to True
                    is_admin=False,  # Set this explicitly
                    consent=True,  # Set if required
                    lms_id=None,  # Set if needed
                    reset_code=None  # Set if needed
                )
                
                db.session.add(test_student)
                db.session.commit()
                print(f"Test student created successfully")
                
                # Get the newly created user
                test_student = User.query.filter_by(email=test_email).first()
                
                if test_student:
                    print(f"Test student retrieved, ID: {test_student.user_id}")
                    
                    # Check if already enrolled - FIXED VERSION
                    existing = UserCourse.query.filter_by(
                        user_id=test_student.user_id,
                        course_id=course_id
                    ).first()
                    
                    if not existing:
                        print(f"Enrolling test student in course...")
                        test_user_course = UserCourse(
                            user_id=test_student.user_id,
                            course_id=course_id,
                            role_id=5,  # Student role
                            active=True  # Add this if required
                        )
                        db.session.add(test_user_course)
                        db.session.commit()
                        print(f"Test student enrolled successfully")
                    else:
                        print(f"Test student already enrolled")
                else:
                    print(f"Failed to retrieve created test student")
                    return jsonify({
                        "success": False,
                        "error": "Failed to create test student"
                    }), 500
                    
            except Exception as create_error:
                print(f"Error creating test student: {str(create_error)}")
                db.session.rollback()
                return jsonify({
                    "success": False,
                    "error": f"Failed to create test student: {str(create_error)}"
                }), 500
        else:
            print(f"Test student found: {test_student.first_name} {test_student.last_name}")
        
        # Create tokens for the test student
        print(f"Creating tokens for user ID: {test_student.user_id}")
        
        try:
            access_token = create_access_token(identity=test_student.user_id)
            refresh_token = create_refresh_token(identity=test_student.user_id)
            print(f"Tokens created successfully")
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
                "user_id": test_student.user_id,
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
        
        print(f"Returning success response")
        print(f"=== END TEST STUDENT TOKEN ENDPOINT ===")
        
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
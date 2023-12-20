from flask import request
from flask_sqlalchemy import *
from controller import bp
from models.assessment_task import *
from models.course import get_course
from models.user   import get_user
from models.team   import get_team
from models.role   import get_role
from controller.Route_response import *
from models.user_course import get_user_courses_by_user_id
from flask_jwt_extended import jwt_required
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.assessment_task import (
    get_assessment_tasks_by_course_id,
    get_assessment_tasks_by_role_id,
    get_assessment_tasks_by_team_id,
    get_assessment_tasks,
    get_assessment_task,
    create_assessment_task,
    replace_assessment_task
)


# /assessment_task GET retrieves all assessment tasks
# Supported individual filters:
# /assessment_task?user_id=###
# /assessment_task?course_id=###
# /assessment_task?role_id=###
# /assessment_task?team_id=###
@bp.route("/assessment_task", methods=["GET"])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_all_assessment_tasks():
    try:
        if request.args and request.args.get("user_id"):
            user_id = int(request.args.get("user_id"))
            get_user(user_id)  (course_id)  # Trigger an error if not exists.
            user_courses = get_user_courses_by_user_id(user_id)
            all_assessment_tasks = []

            for user_course in user_courses:
                assessment_tasks = get_assessment_tasks_by_course_id(
                    user_course.course_id
                )
                for assessment_task in assessment_tasks:
                    all_assessment_tasks.append(assessment_task)

            return create_good_response(
                assessment_tasks_schema.dump(all_assessment_tasks),
                200,
                "assessment_tasks",
            )

        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            get_course(course_id)  # Trigger an error if not exists.
            all_assessment_tasks = get_assessment_tasks_by_course_id(course_id)

            return create_good_response(
                assessment_tasks_schema.dump(all_assessment_tasks),
                200,
                "assessment_tasks",
            )

        if request.args and request.args.get("role_id"):
            role_id = int(request.args.get("role_id"))
            get_role(role_id)  # Trigger an error if not exists.
            all_assessment_tasks = get_assessment_tasks_by_role_id(role_id)

            return create_good_response(
                assessment_tasks_schema.dump(all_assessment_tasks),
                200,
                "assessment_tasks",
            )

        if request.args and request.args.get("team_id"):
            team_id = int(request.args.get("team_id"))
            get_team(team_id)  # Trigger an error if not exists.
            team_assessment_tasks = get_assessment_tasks_by_team_id(team_id)

            return create_good_response(
                assessment_tasks_schema.dump(team_assessment_tasks),
                200,
                "assessment_tasks",
            )

        all_assessment_tasks = get_assessment_tasks()
        return create_good_response(
            assessment_task_schema.dump(
                all_assessment_tasks), 200, "assessment_tasks"
        )

    except Exception as e:
        return create_bad_response(
            f"An error occurred retrieving all assessment tasks: {e}", "assessment_task"
        )



# /assessment_task/<int:assessment_task_id> GET fetches one assessment task with the specified assessment_task_id
@bp.route('/assessment_task', methods =['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_one_assessment_task():
    try:
        assessment_task_id = request.args.get("assessment_task_id")
        one_assessment_task = get_assessment_task(assessment_task_id)
        return create_good_response(
            assessment_task_schema.dump(
                one_assessment_task), 200, "assessment_tasks"
        )

    except Exception as e:
        return create_bad_response(
            f"An error occurred retrieving one assessment tasks: {e}", "assessment_task"
        )

# /assessment_task POST creates an assessment task with the requested json!
@bp.route('/assessment_task', methods = ['POST'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def add_assessment_task():
    try:
        new_assessment_task = create_assessment_task(request.json)
        return create_good_response(
            assessment_task_schema.dump(
                new_assessment_task), 201, "assessment_task"
        )

    except Exception as e:
        return create_bad_response(
            f"An error occurred creating an assessment tasks: {e}", "assessment_task"
        )



@bp.route('/assessment_task', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def update_assessment_task():
    try:
        assessment_task_id = request.args.get("assessment_task_id")
        updated_assessment_task = replace_assessment_task(
            request.json, assessment_task_id
        )
        return create_good_response(
            assessment_task_schema.dump(updated_assessment_task),
            201,
            "assessment_tasks",
        )

    except Exception as e:
        return create_bad_response(
            f"An error occurred replacing an assessment tasks: {e}", "assessment_task"
        )

# /assessment_task/ POST
# copies over assessment_tasks from an existing course to another course
# given a source and destination course_id
@bp.route("/assessment_task_copy", methods=["POST"])
def copy_course_assessments():
    try:
        source_course_id = request.args.get('source_course_id')
        get_course(source_course_id)  # Trigger an error if not exists.

        destination_course_id = request.args.get('destination_course_id')
        get_course(destination_course_id)  # Trigger an error if not exists.

        source_assessment_tasks = get_assessment_tasks_by_course_id(
            source_course_id)
        source_assessment_tasks_json = assessment_tasks_schema.dump(
            source_assessment_tasks
        )

        for assessment_task in source_assessment_tasks_json:
            assessment_task["course_id"] = destination_course_id
            create_assessment_task(assessment_task)  # Trigger an error if not exists.

        return create_good_response(
            assessment_task_schema.dump(source_assessment_tasks),
            201,
            "assessment_tasks",
        )

    except Exception as e:
        return create_bad_response(
            f"An error occurred copying course assessments {e}", "assessment_tasks"
        )



class AssessmentTaskSchema(ma.Schema):
    class Meta:
        fields = (
            "assessment_task_id",
            "assessment_task_name",
            "course_id",
            "rubric_id",
            "role_id",
            "due_date",
            "time_zone",
            "show_suggestions",
            "show_ratings",
            "unit_of_assessment",
            "create_team_password",
            "comment",
        )


assessment_task_schema = AssessmentTaskSchema()
assessment_tasks_schema = AssessmentTaskSchema(many=True)

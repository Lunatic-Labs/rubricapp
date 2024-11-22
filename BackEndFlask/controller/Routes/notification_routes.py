#------------------------------------------------------------
# This is file holds the routes that handle sending
#   notifications to individuals.
#
# Explanation of how Assessment.notification_sent will be
#   used:
#       If a completed assessments last update is after
#       assessment.notification_sent, then they are 
#       considered to be new and elligble to send a msg
#       to agian. Any more complex feture will require
#       another table or trigger table to be added.        
#------------------------------------------------------------

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
from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check,
    admin_check
)

@bp.route('/mass_notification', methods = ['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def mass_notify_new_ca_users():
    """
    Description:
    This route will email individuals/teams of a related AT;
    New/updated completed ATs will be notified upon successive
    use.

    Parameters(from the json):
    assessment_task_id: str (AT)
    team: bool (is the at team based)
    notification_message: str (message to send over in the email)

    Exceptions:
    None all should be caught and handled
    """
    try:
        at_id = int(request.args.get('assessment_task_id'))
        is_teams = bool(request.args.get('team'))

        msg_to_students = request.json["notification_message"]

        one_assessment_task = get_assessment_task(at_id)   # Trigger an error if not exists

        return create_good_response(
            "Message Sent",
            201,
            "Mass notified"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred emailing users: {e}", "mass notified", 400
        )
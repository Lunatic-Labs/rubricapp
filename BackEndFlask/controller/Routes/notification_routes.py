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
from models.assessment_task import get_assessment_task, toggle_notification_sent_to_true
from controller.Route_response import *
from models.queries import get_students_for_emailing
from flask_jwt_extended import jwt_required
from models.utility import email_students_feedback_is_ready_to_view
import datetime

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
    assessment_task_id: <class 'str'>r (AT)
    team: <class 'bool'> (is the at team based)
    notification_message: <class 'str'> (message to send over in the email)

    Exceptions:
    None all should be caught and handled
    """
    try:
        at_id = int(request.args.get('assessment_task_id'))
        is_teams = bool(request.args.get('team'))
        msg_to_students = request.json["notification_message"]
        date = request.json["date"]

        # Raises InvalidAssessmentTaskID if non-existant AT.
        at_time = get_assessment_task(at_id).notification_sent

        # Lowest possible time for easier comparisons.
        if at_time == None : at_time = datetime.datetime(1,1,1,0,0,0,0)

        students = get_students_for_emailing(at_id)

        left_to_notifiy = [singular_student for singular_student in students if singular_student.last_update > at_time]

        email_students_feedback_is_ready_to_view(left_to_notifiy, msg_to_students)

        #update the at noti time
        toggle_notification_sent_to_true(at_id, date)

        with open("ap.txt", 'w') as out:
            print(left_to_notifiy, file=out)

        return create_good_response(
            "Message Sent",
            201,
            "Mass_notified"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred emailing users: {e}", "mass_not_notified", 400
        )
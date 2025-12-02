#------------------------------------------------------------
# This file holds the routes that handle sending
#   notifications to individuals or teams.
#
# Explanation of how Assessment.notification_sent will be
#   used:
#       If a completed assessment's last update is after
#       assessment.notification_sent, then they are 
#       considered to be new and eligible to send a msg
#       to again. Any more complex feature will require
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

    Parameters (from the json / query args):
        assessment_task_id: <class 'str'> (AT)       [query arg]
        team: <class 'bool'> (is the AT team based)  [query arg]
        notification_message: <class 'str'> (message to send)
        date: <class 'str'> (date to record things)

    Returns:
        Bad or good response.

    Exceptions:
        None – all should be caught and handled.
    """
    try:
        at_id = int(request.args.get('assessment_task_id'))
        is_teams = request.args.get('team') == "true"
        msg_to_students = request.json["notification_message"]
        date = request.json["date"]

        # Raises InvalidAssessmentTaskID if non-existent AT.
        at_time = get_assessment_task(at_id).notification_sent

        # Lowest possible time for easier comparisons.
        if at_time is None:
            at_time = datetime.datetime(1, 1, 1, 0, 0, 0, 0)

        collection = get_students_for_emailing(is_teams, at_id=at_id)

        left_to_notifiy = [
            singular_student
            for singular_student in collection
            if singular_student.last_update > at_time
        ]

        email_students_feedback_is_ready_to_view(left_to_notifiy, msg_to_students)

        # Updating AT notification time
        toggle_notification_sent_to_true(at_id, date)

        return create_good_response(
            "Message Sent",
            201,
            "Mass_notified"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred emailing users: {e}",
            "mass_not_notified",
            400
        )
    

@bp.route('/send_single_email', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def send_single_email():
    """
    Description:
        Sends emails to a single student or team based on a completed_assessment_id.

    Parameters (from json / query args):
        team: <class 'bool'> (is this a team message)                 [query arg]
        completed_assessment_id: <class 'int'> (targeted CA id)      [query arg]
        assessment_task_id: <class 'int'> (owning AT)                [query arg, optional]
        notification_message: <class 'str'> (message to send)        [json]
        date: <class 'str'> (date to record for notification time)   [json, optional]

    Behavior:
        - Always sends the email to the given completed_assessment_id.
        - If both assessment_task_id and date are provided, also updates
          AssessmentTask.notification_sent so the rating/timelag logic
          can use this notification time.

    Returns:
        Good or bad Response.

    Exceptions:
        None – all should be caught and handled.
    """

    try:
        is_teams = request.args.get('team') == "true"
        completed_assessment_id = request.args.get('completed_assessment_id')
        msg = request.json['notification_message']

        # Optional data to sync the notification time with the AT
        at_id_str = request.args.get('assessment_task_id')
        date = request.json.get('date')

        collection = get_students_for_emailing(
            is_teams,
            completed_at_id=completed_assessment_id
        )

        # Putting into a list as that's what email_students_feedback_is_ready_to_view expects.
        left_to_notifiy = [singular_student for singular_student in collection]

        email_students_feedback_is_ready_to_view(left_to_notifiy, msg)

        # If we know the owning AT and have a date, update its notification time
        if at_id_str is not None and date is not None:
            try:
                at_id = int(at_id_str)
                toggle_notification_sent_to_true(at_id, date)
            except ValueError:
                # If assessment_task_id can't be parsed, just skip the update;
                # the email has still been sent at this point.
                pass

        return create_good_response(
            "Message Sent",
            201,
            "Individual/Team notified"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred emailing user/s: {e}",
            "Individual/Team not notified",
            400
        )

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
    date: <class 'str'> (date to record things)
    user_id: <class 'int'> (who is requested the route[The decorators need it])

    Exceptions:
    None all should be caught and handled
    """
    try:
        at_id = int(request.args.get('assessment_task_id'))
        is_teams = request.args.get('team') == "true"
        msg_to_students = request.json["notification_message"]
        date = request.json["date"]

        # Raises InvalidAssessmentTaskID if non-existant AT.
        at_time = get_assessment_task(at_id).notification_sent

        # Lowest possible time for easier comparisons.
        if at_time == None : at_time = datetime.datetime(1,1,1,0,0,0,0)

        collection = get_students_for_emailing(is_teams, at_id=at_id)

        left_to_notifiy = [singular_student for singular_student in collection if singular_student.last_update > at_time]

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
            f"An error occurred emailing users: {e}", "mass_not_notified", 400
        )
    

@bp.route('/send_single_email', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def send_single_email():
    """
    Description:
    Parameters:
    user_id: <class 'int'> (who requested the route {decorators uses it})
    is_team: <class 'bool'> (is this a team or individual msg)
    targeted_id: <class 'int'> (intended student/team for the message)
    msg: <class 'str'> (The message the team or individual should recive)

    Returns:
    Good or bad Response

    Exceptions:
    None
    """

    try:
        is_teams = request.args.get('team') == "true"
        completed_assessment_id = request.args.get('completed_assessment_id')
        msg = request.json['notification_message']

        # Find the students to email. Need first_name, last_name, and email.

        # Put into a compreshion list and call emailing funciton(same func at above)


        return create_good_response(
            "Message Sent",
            201,
            "Individual/Team notified"
        )
    except Exception as e:
        return create_good_response(
            "Message Sent",
            201,
            "Individual/Team notified"
        )
        return create_bad_response(
            f"An error occurred emailing user/s: {e}", "Individual/Team not notified", 400
        )
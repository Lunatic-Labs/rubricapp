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
from marshmallow import fields
from models.queries import get_students_for_emailing, get_admin_notifications, delete_admin_notifications, send_notification_update
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.utility import email_students_feedback_is_ready_to_view, email_admins_notification
from models.schemas import AdminNotification
import datetime

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check,
    admin_check, super_admin_check
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

@bp.route('/send_admin_notification', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@super_admin_check()
def send_admin_notification():
    """
    Description:
        Sends an email notification from the SuperAdmin to all admin users
        who have at least one active course.

    Parameters (from json body):
        subject: <class 'str'> (email subject line)
        message: <class 'str'> (email message body)

    Returns:
        Good or bad response.

    Exceptions:
        None – all should be caught and handled.
    """
    try:
        data = request.json
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()

        if not subject or not message:
            return create_bad_response(
                "Subject and message are required.",
                "missing_fields",
                400
            )

        email_admins_notification(subject, message)

        # Log the sent notification to the database
        notification_record = AdminNotification(
            sender_id=int(get_jwt_identity()),
            subject=subject,
            message=message,
            sent_at=datetime.datetime.utcnow()
        )
        from core import db
        db.session.add(notification_record)
        db.session.commit()

        return create_good_response(
            "Notification sent to admins",
            200,
            "admins_notified"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred sending admin notification: {e}",
            "admins_not_notified",
            400
        )

@bp.route('/admin_notifications', methods=['DELETE'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@super_admin_check()
def delete_admin_notifications_route():
    """
    Description:
    Deletes one or more admin notifications by their IDs.

    Parameters (JSON body):
        notification_ids: <class 'list[int]'> (list of notification IDs to delete)

    Returns:
        Good response with count of deleted notifications, or bad response on error.
    """
    try:
        data = request.get_json()
        if not data or 'notification_ids' not in data or not data['notification_ids']:
            return create_bad_response(
                "notification_ids is required and must be a non-empty list",
                "missing_notification_ids",
                400
            )
        notification_ids = data['notification_ids']
        if not isinstance(notification_ids, list):
            return create_bad_response(
                "notification_ids must be a list",
                "invalid_notification_ids",
                400
            )
        deleted_count = delete_admin_notifications(notification_ids)
        return create_good_response(
            {"deleted_count": deleted_count},
            200,
            "delete_result"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred deleting notifications: {e}",
            "notifications_not_deleted",
            400
        )

@bp.route('/admin_notifications', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@super_admin_check()
def get_admin_notification_history():
    """
    GET /api/admin_notifications

    Returns a list of all admin notifications sent by the SuperAdmin,
    ordered by most recent first. Only accessible by the SuperAdmin.

    Response:
        { success: true, content: { admin_notifications: [...] } }
    """
    try:
        notifications = get_admin_notifications()
        return create_good_response(
            admin_notifications_schema.dump(notifications),
            200,
            "admin_notifications"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred fetching admin notifications: {e}",
            "notifications_not_fetched",
            400
        )

@bp.route('/admin_notifications/<int:notification_id>', methods=['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@super_admin_check()
def update_admin_notification(notification_id):
    """
    Description:
    Sends an update to an existing admin notification.
    Creates a new AdminNotification record linked to the original via thread_id,
    and re-emails all admins with the update.

    Parameters (JSON body):
        subject: <class 'str'> (the subject of the update)
        message: <class 'str'> (the message body of the update)

    Returns:
        Good response with the new notification record, or bad response on error.
    """
    try:
        data = request.get_json()
        if not data:
            return create_bad_response(
                "Request body is required",
                "missing_body",
                400
            )
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        if not subject or not message:
            return create_bad_response(
                "Subject and message are required",
                "missing_fields",
                400
            )
        sender_id = int(get_jwt_identity())
        new_notification = send_notification_update(notification_id, sender_id, subject, message)
        email_admins_notification(subject, message)
        return create_good_response(
            admin_notifications_schema.dump([new_notification])[0],
            200,
            "admin_notification"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred sending notification update: {e}",
            "notification_not_updated",
            400
        )


class AdminNotificationSchema(ma.Schema):
    admin_notification_id = fields.Int()
    sender_id = fields.Int()
    thread_id = fields.Int()
    subject = fields.Str()
    message = fields.Str()
    sent_at = fields.DateTime()

admin_notifications_schema = AdminNotificationSchema(many=True)
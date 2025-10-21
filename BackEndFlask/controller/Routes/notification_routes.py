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

def make_timezone_aware(dt):
    """Ensure datetime is timezone-aware for comparison"""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=datetime.timezone.utc)
    return dt

@bp.route('/mass_notification', methods=['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def mass_notify_new_ca_users():
    """
    Description:
    This route will email individuals/teams of a related AT.
    NOW REQUIRES MANUAL TRIGGER - will not auto-send based on last_update.
    
    Parameters(from the json):
    assessment_task_id: <class 'str'> (AT)
    team: <class 'bool'> (is the at team based)
    notification_message: <class 'str'> (message to send over in the email)
    date: <class 'str'> (date to record things)
    notify_all: <class 'bool'> (optional - if true, notify all locked assessments regardless of previous notifications)
    user_id: <class 'int'> (who is requested the route[The decorators need it])
    
    Returns:
    Bad or good response with count of students notified.
    
    Exceptions:
    None all should be caught and handled
    """
    try:
        at_id = int(request.args.get('assessment_task_id'))
        is_teams = request.args.get('team') == "true"
        msg_to_students = request.json["notification_message"]
        date = request.json["date"]
        notify_all = request.json.get("notify_all", False)  # New parameter
        
        # Raises InvalidAssessmentTaskID if non-existent AT.
        assessment_task = get_assessment_task(at_id)
        at_time = assessment_task.notification_sent
        
        # Lowest possible time for easier comparisons.
        if at_time == None:
            at_time = datetime.datetime(1, 1, 1, 0, 0, 0, 0)
        
        collection = get_students_for_emailing(is_teams, at_id=at_id)
        
        # Filter based on notify_all flag
        if notify_all:
            # Notify all locked assessments
            left_to_notify = [
                student for student in collection 
                if hasattr(student, 'locked') and student.locked
            ]
        else:
            # Only notify those updated since last notification
            left_to_notify = [
                student for student in collection 
                if student.last_update > at_time and 
                (hasattr(student, 'locked') and student.locked)
            ]
        
        if not left_to_notify:
            return create_good_response(
                {
                    "message": "No students to notify",
                    "count": 0
                },
                200,
                "Mass_notified"
            )
        
        # Send emails
        email_students_feedback_is_ready_to_view(left_to_notify, msg_to_students)
        
        # Update AT notification time
        toggle_notification_sent_to_true(at_id, date)
        
        return create_good_response(
            {
                "message": "Messages Sent",
                "count": len(left_to_notify)
            },
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
    This function sends emails to select single students or teams based on a completed_assessment_id.
    The function was teased out from the above function to allow the addition of new features.

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

        collection = get_students_for_emailing(is_teams, completed_at_id= completed_assessment_id)

        # Putting into a list as thats what the function wants.
        left_to_notifiy = [singular_student for singular_student in collection]

        email_students_feedback_is_ready_to_view(left_to_notifiy, msg)

        return create_good_response(
            "Message Sent",
            201,
            "Individual/Team notified"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred emailing user/s: {e}", "Individual/Team not notified", 400
        )
    
    
@bp.route('/auto_notify_past_due', methods=['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def auto_notify_past_due_assessments():
    """
    Description:
    Automatically notifies students for graded assessments where the due date has passed.
    Only notifies assessments that:
    1. Are locked (graded)
    2. Have a due date that has passed
    3. Haven't been notified since last update
    
    Parameters:
    course_id: <class 'int'> (optional - limit to specific course)
    assessment_task_id: <class 'int'> (optional - limit to specific assessment task)
    notification_message: <class 'str'> (message to send in email)
    
    Returns:
    Response with count of notifications sent
    """
    try:
        course_id = request.args.get('course_id')
        assessment_task_id = request.args.get('assessment_task_id')
        msg_to_students = request.json.get("notification_message", 
                                           "Your graded assessment is now available.")
        
        current_time = datetime.datetime.now(datetime.timezone.utc)
        notified_count = 0
        
        # Get assessment tasks that are past due
        from models.assessment_task import get_assessment_tasks_by_course_id
        
        if assessment_task_id:
            # Single assessment task
            tasks = [get_assessment_task(int(assessment_task_id))]
        elif course_id:
            # All tasks for a course
            tasks = get_assessment_tasks_by_course_id(int(course_id))
        else:
            return create_bad_response(
                "Must provide course_id or assessment_task_id", 
                "auto_notify", 
                400
            )
        
        # Filter to tasks past due date
        past_due_tasks = [
            task for task in tasks 
            if task.due_date and make_timezone_aware(task.due_date) < current_time
        ]
        
        for task in past_due_tasks:
            at_time = task.notification_sent
            if at_time == None:
                at_time = datetime.datetime(1, 1, 1, 0, 0, 0, 0)
            
            # Check if team or individual assessment
            is_teams = task.unit_of_assessment == "team"
            
            collection = get_students_for_emailing(is_teams, at_id=task.assessment_task_id)
            
            # Only notify locked assessments updated since last notification
            left_to_notify = [
                student for student in collection 
                if student.last_update > at_time and
                hasattr(student, 'locked') and student.locked
            ]
            
            if left_to_notify:
                email_students_feedback_is_ready_to_view(left_to_notify, msg_to_students)
                toggle_notification_sent_to_true(
                    task.assessment_task_id, 
                    current_time.isoformat()
                )
                notified_count += len(left_to_notify)
        
        return create_good_response(
            {
                "message": f"Notified {notified_count} student(s)",
                "count": notified_count,
                "tasks_processed": len(past_due_tasks)
            },
            200,
            "auto_notify"
        )
        
    except Exception as e:
        return create_bad_response(
            f"An error occurred with auto-notification: {e}", 
            "auto_notify", 
            400
        )
    
    
@bp.route('/notification_status', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def check_notification_status():
    """
    Check which students are ready to be notified for an assessment task.
    This shows counts of: ready to notify, already notified, still grading.
    
    Parameters:
    - assessment_task_id: int (required)
    - team: bool (required) - "true" or "false"
    
    Returns:
    Response with notification status counts and dates
    """
    try:
        at_id = int(request.args.get('assessment_task_id'))
        is_teams = request.args.get('team') == "true"
        
        # Get the assessment task
        assessment_task = get_assessment_task(at_id)
        at_time = assessment_task.notification_sent
        
        # Lowest possible time for easier comparisons if never notified
        if at_time == None:
            at_time = datetime.datetime(1, 1, 1, 0, 0, 0, 0)
        
        # Get all completed assessments for this task
        collection = get_students_for_emailing(is_teams, at_id=at_id)
        
        # Count locked assessments that need notification (updated since last notification)
        ready_to_notify = [
            student for student in collection 
            if student.last_update > at_time and
            hasattr(student, 'locked') and student.locked
        ]
        
        # Count locked assessments already notified (not updated since last notification)
        already_notified = [
            student for student in collection
            if student.last_update <= at_time and
            hasattr(student, 'locked') and student.locked
        ]
        
        # Count unlocked assessments (still being graded)
        still_grading = [
            student for student in collection
            if not (hasattr(student, 'locked') and student.locked)
        ]
        
        # Check if due date has passed
        due_date_passed = False
        if assessment_task.due_date:
            current_time = datetime.datetime.now(datetime.timezone.utc)
            # Make sure due_date is timezone-aware for comparison
            due_date = assessment_task.due_date
            if due_date.tzinfo is None:
                due_date = due_date.replace(tzinfo=datetime.timezone.utc)
            due_date_passed = due_date < current_time
        
        return create_good_response(
            {
                "ready_to_notify_count": len(ready_to_notify),
                "already_notified_count": len(already_notified),
                "still_grading_count": len(still_grading),
                "due_date": assessment_task.due_date.isoformat() if assessment_task.due_date else None,
                "due_date_passed": due_date_passed,
                "last_notification_sent": at_time.isoformat() if at_time != datetime.datetime(1, 1, 1, 0, 0, 0, 0) else None
            },
            200,
            "notification_status"
        )
        
    except Exception as e:
        return create_bad_response(
            f"An error occurred checking notification status: {e}",
            "notification_status",
            400
        )
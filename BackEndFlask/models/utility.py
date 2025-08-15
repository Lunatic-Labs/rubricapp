import re
import string
import secrets
import html
from time import time
from models.logger import logger
from core import sendgrid_client, config
from sendgrid.helpers.mail import Mail
from controller.Routes.RouteExceptions import EmailFailureException
from constants.Email import DEFAULT_SENDER_EMAIL

# NOTE: MARKED FOR EDITING
def check_bounced_emails(from_timestamp=None):
    """
    This function returns a list of all bounced emails.

    Args:
        from_timestamp(int): Unix timestamp from where to start considering emails (inclusive).
    """

    if config.rubricapp_running_locally:
        return

    MAX_FETCHED_EMAILS = 32
    DEFAULT_LOOKBACK_DAYS  = 30

    if from_timestamp is None:
        from_timestamp = int(time.time()) - DEFAULT_LOOKBACK_DAYS * 86400 

    try:
        bounced_emails = []
        headers = {"Accept": "application/json"}
        params = {
            'start_time': from_timestamp,
            "limit": MAX_FETCHED_EMAILS
        }
        sender = DEFAULT_SENDER_EMAIL

        response = sendgrid_client.client.suppression.bounces.get(
            request_headers = headers,
            query_params = params,
        )

        if response.status_code == 200 and response.body:
            email_json = response.body
            for entry in email_json:
                bounced_emails.append({
                    'id': entry['created'],
                    'to': entry['email'],
                    'msg': entry['status'],
                    'sender': sender,
                    'main_failure': entry['reason'],
                })

            return bounced_emails if len(bounced_emails) != 0 else None

    except Exception as e:
        config.logger.error("Could not check for bounced email: " + str(e))
        raise EmailFailureException()

def send_bounced_email_notification(dest_addr: str, msg: str, failure: str):
    subject = "Student's email failed to send."
    message = f'''The email could not sent due to:

                {msg}

                {failure}'''
    send_email(dest_addr, subject, message, 0)

def send_email_for_updated_email(address: str):
    subject = "Your email has been updated."
    message = f'''Your email has been updated by an admin.

                Access the app at this link: skill-builder.net

                Your new username is {address}'''
    send_email(address, subject, message, 0)

def send_new_user_email(address: str, password: str):
    subject = "Welcome to Skillbuilder!"
    message = f'''Welcome to SkillBuilder, a tool to enhance your learning experience this semester! This app will be our hub for assessing and providing feedback on transferable skills (these are also referred to as process skills, professional skills, durable skills).

                Access the app at this link: skill-builder.net

                Login Information: Your Username is {address}

                Temporary Password: {password}

                Please change your password after your first login to keep your account secure.'''

    send_email(address, subject, message, 0)

def send_reset_code_email(address: str, code: str):
    subject = "Skillbuilder - Reset your password"
    message = f'''
        <!DOCTYPE html>
        <html>
        <head></head>
        <body>
            <p>Your reset code is <b>{code}</b>.</p>

            <p>Go to <a href="https://skill-builder.net" target="_blank">skill-builder.net</a> to login.<p>

            <p>Cheers,<br>The Skillbuilder Team<p>
        <body>
        </html>'''

    send_email(address, subject, message, 1)

def email_students_feedback_is_ready_to_view(students: list, notification_message : str):
    for student in students:
        subject = "Skillbuilder - Your Feedback is ready to view!"

        message = f'''Greetings {student.first_name} {student.last_name},

                    Your skill development assessment is available to view and act upon. Please log in to SkillBuilder and look in Your Completed Assessments.

                    Message from Professor:
                    {notification_message}

                    Cheers,
                    The Skillbuilder Team'''

        send_email(student.email, subject, message, 0)

def send_email(address: str, subject: str, content: str, type: int) -> None:
    """
    Sends an email.
    
    Args:
        address (str): Recipient address.
        subject (str): Email subject.
        content (str): Email content.
        type    (int): Is the content html: 1 indicates html, 0 plain text. 

    Raises:
        Email errors from connecting and sending via SendGrid.
    """
    if config.rubricapp_running_locally:
        return

    kwargs = {
        'from_email' : DEFAULT_SENDER_EMAIL,
        'subject'    : subject,
        'to_emails'  : address,
    }

    if type == 1:
        kwargs['html_content'] = content
    elif type == 2:
        kwargs['amp_html_content'] = content
    else:# 0 is plain text and works as a catch all.
        kwargs['plain_text_content'] = content

    try:
        message = Mail(**kwargs)
        sendgrid_client.send(message)
    except Exception as e:
        config.logger.error("Could not send email: " + str(e))
        raise EmailFailureException()


def generate_random_password(length: int):
    letters = string.ascii_letters + string.digits

    return ''.join(secrets.choice(letters) for i in range(length))

def error_log(f):
    '''
    Custom decorator to automatically log errors and than raise
    them.

    Use as a decorator: @error_log above functions you want to have
    error logging
    '''
    def wrapper(*args, **kwargs):
        try:
            return f(*args, *kwargs)

        except BaseException as e:
            logger.error(f"{e.__traceback__.tb_frame.f_code.co_filename} { e.__traceback__.tb_lineno} Error Type: {type(e).__name__} Message: {e}")
            raise e

    return wrapper

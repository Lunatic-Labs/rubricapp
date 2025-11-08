import json
import string
import secrets
from time import time
from typing import Any
from models.logger import logger
from core import sendgrid_client, config
from sendgrid.helpers.mail import Mail
from controller.Routes.RouteExceptions import EmailFailureException
from constants.Email import DEFAULT_SENDER_EMAIL
from enums.Email_type import EmailContentType

def output(text, clear=False):# Marked for deletion func
    with open("ap.txt" ,'w' if clear else 'a') as out:
        print(text, file=out)

def print_object_details(obj:object) -> None: # Marked for deletion func
    for attr in dir(obj):
        if attr.startswith("__"):
            continue
        value = getattr(obj, attr)
        if not callable(value):
            output(f"{attr}: {value}")


def check_bounced_emails(from_timestamp:int|None=None) -> dict|None:
    """
    Returns a list of all bounced emails.

    Note:
        None default for the timestamp means that the system will retrive bounced emails as old as
        30 days from when the function runs.
    
    Args:
        from_timestamp(int): Unix timestamp from where to start considering emails (inclusive).

    Returns:
        dict|None: A dictionary full of bounced emails if any are found else it is None.
            - id (int)     : Also a unix timestamp from when it was created used as an id.
            - to (str)     : Intended reciver of the email.
            - msg (str)    : Enhanced SMTP bounce response.
            - sender (str) : Who sent the bounced email.
            - main_failure (str) : Reason for the bounced email.
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
            decoded_body = response.body.decode('utf-8')  # Convert bytes to string
            email_json = json.loads(decoded_body)
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

def send_bounced_email_notification(dest_addr: str, msg: str, failure: str) -> None:
    """
    Sends bounced email notification to the user.

    Args:
        dest_addr (str): Recipient of the email.
        msg (str)      : Human-friendly reason for the failure.
        failure (str)  : Specific error from the system.
    """
    subject = "Student's email failed to send."
    message = f'''The email could not sent due to:

                {msg}

                {failure}'''
    send_email(dest_addr, subject, message, EmailContentType.PLAIN_TEXT_CONTENT)

def send_email_for_updated_email(to_address: str) -> None:
    """
    Sends update email.

    Args:
        to_address (str): Recipient of email.
    """
    subject = "Your email has been updated."
    message = f'''Your email has been updated by an admin.

                Access the app at this link: skill-builder.net

                Your new username is {to_address}'''
    send_email(to_address, subject, message, EmailContentType.PLAIN_TEXT_CONTENT)

def send_new_user_email(to_address: str, password: str) -> None:
    """
    Sends new user an email.

    Args:
        to_address (str): Recipent of the email.
        password   (str): Users temporary password.
    """
    subject = "Welcome to Skillbuilder!"
    message = f'''Welcome to SkillBuilder, a tool to enhance your learning experience this semester! This app will be our hub for assessing and providing feedback on transferable skills (these are also referred to as process skills, professional skills, durable skills).

                Access the app at this link: skill-builder.net

                Login Information: Your Username is {to_address}

                Temporary Password: {password}

                Please change your password after your first login to keep your account secure.'''

    send_email(to_address, subject, message, EmailContentType.PLAIN_TEXT_CONTENT)

def send_reset_code_email(to_address: str, code: str) -> None:
    """
    Sends reset code.

    Args:
        to_address (str): Recipent address.
        code       (str): Rest code.
    """
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

    send_email(to_address, subject, message, EmailContentType.HTML_CONTENT)

def email_students_feedback_is_ready_to_view(students: list, notification_message : str) -> None:
    """
    Emails batch of students that their feedback is ready.

    Args:
        students (list): List of students.
        notification_message (str): Message to be included in the email.
    """
    for student in students:
        subject = "Skillbuilder - Your Feedback is ready to view!"

        message = f'''Greetings {student.first_name} {student.last_name},

                    Your skill development assessment is available to view and act upon. Please log in to SkillBuilder and look in Your Completed Assessments.

                    Message from Professor:
                    {notification_message}

                    Cheers,
                    The Skillbuilder Team'''

        send_email(student.email, subject, message, EmailContentType.PLAIN_TEXT_CONTENT)

def send_email(address: str, subject: str, content: str, type: EmailContentType) -> None:
    """
    Sends an email.
    
    Args:
        address (str): Recipient address.
        subject (str): Email subject.
        content (str): Email content.
        type    (EmailContentType): What type of email content is desired. EX: plain-text or html. 

    Raises:
        Email errors from connecting and sending via SendGrid.
    """
    if config.rubricapp_running_locally:
        return

    kwargs = {
        'from_email' : DEFAULT_SENDER_EMAIL,
        'subject'    : subject,
        'to_emails'  : address,
        type.value   : content,
    }

    try:
        message = Mail(**kwargs)
        sendgrid_client.send(message)
    except Exception as e:
        config.logger.error("Could not send email: " + str(e))
        raise EmailFailureException()

def generate_random_password(length: int) -> str:
    """
    Generates random password of the desired length.

    Args:
        length (int): Desired size of the password.
    
    Returns:
        str : Generated password.
    """
    letters = string.ascii_letters + string.digits

    return ''.join(secrets.choice(letters) for i in range(length))

def error_log(f:Any) -> Any:
    '''
    Custom decorator to automatically log errors and than raise
    them.

    Note:
        Use as a decorator @error_log above functions you want to have
        error logging
    '''
    def wrapper(*args, **kwargs):
        try:
            return f(*args, *kwargs)

        except BaseException as e:
            logger.error(f"{e.__traceback__.tb_frame.f_code.co_filename} { e.__traceback__.tb_lineno} Error Type: {type(e).__name__} Message: {e}")
            raise e

    return wrapper

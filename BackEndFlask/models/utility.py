import os
import re
import sys
import time
import string, secrets
import html

import base64
from email.message import EmailMessage

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

from models.logger import logger
from controller.Routes.RouteExceptions import EmailFailureException

from core import oauth2_service, config

def check_bounced_emails(from_timestamp=None):
    if config.rubricapp_running_locally:
        return

    max_fetched_emails = 32

    try:
        # Fetch the emails
        query, messages_result = (None, None)

        # TODO: handle timestamp correctly
        # if from_timestamp is not None:
        #     query = f"after:{int(from_timestamp.timestamp())}"

        if query is not None:
            messages_result = oauth2_service.users().messages().list(
                userId="me", maxResults=max_fetched_emails, q=query
            ).execute()
        else:
            messages_result = oauth2_service.users().messages().list(
                userId="me", maxResults=max_fetched_emails
            ).execute()

        messages, bounced_emails = (messages_result.get("messages", []), [])

        if messages:
            for msg in messages:
                msg_detail = oauth2_service.users().messages().get(userId="me", id=msg["id"]).execute()
                headers = msg_detail.get("payload", {}).get("headers", [])
                sender = next(
                    (header["value"] for header in headers if header["name"] == "From"),
                    None,
                )

                # Parse the sender
                if sender:
                    parts = sender.split("<")
                    if len(parts) > 1:
                        sender = parts[1][0:-1]

                if sender and sender == "mailer-daemon@googlemail.com":
                    snippet = msg_detail.get("snippet", "No snippet available")
                    snippet = html.unescape(snippet)
                    main_failure = snippet[0]
                    to_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', snippet)
                    to_ = None
                    if to_match:
                        to_ = to_match.group()

                    for i in range(1, len(snippet)):
                        if snippet[i].isupper():
                            break
                        main_failure += snippet[i]

                    bounced_emails.append({
                        'id': msg['id'],
                        'to': to_,
                        'msg': snippet.split('LEARN')[0],
                        'sender': sender,
                        'main_failure': main_failure.strip(),
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

def send_email(address: str, subject: str, content: str, type: int):
    if config.rubricapp_running_locally:
        return

    try:
        message = EmailMessage()
        if type == 0:
            message.set_content(content)
        else:
            message.set_content(content, subtype='html')
        message["To"] = address
        message["From"] = "skillbuilder02@gmail.com"
        message["Subject"] = subject

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {
                "raw": encoded_message,
        }   
        send_message = oauth2_service.users().messages().send(userId="me", body=create_message).execute()

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

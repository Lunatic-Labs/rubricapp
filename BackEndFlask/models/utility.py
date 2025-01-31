import traceback # Debugging, remove once done

import os
import sys
import time
import yagmail
import string, secrets

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

OAUTH2_CREDS_FP = '/home/ubuntu/private/client_secret.json'
OAUTH2_TOKEN_FP = '/home/ubuntu/private/token.json'

def send_email_and_check_for_bounces(func,
                                     dest_addr,
                                     start_timestamp,
                                     end_timestamp,
                                     *vargs):
    func(*vargs)
    check_bounced_emails(dest_addr, start_timestamp, end_timestamp)


def check_bounced_emails(dest_addr, start_timestamp=None, end_timestamp=None):
    time.sleep(1)

    scopes, max_fetched_emails, mailer_daemon_sender = (
        ["https://www.googleapis.com/auth/gmail.readonly"],
        5,
        "mailer-daemon@googlemail.com",
    )

    creds = None
    if os.path.exists("gmail-token.json"):
        creds = Credentials.from_authorized_user_file("gmail-token.json", scopes)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "gmail-credentials.json", scopes
            )
            creds = flow.run_local_server(port=0)

        with open("gmail-token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("gmail", "v1", credentials=creds)

        # Fetch the emails

        query, messages_result = (None, None)

        if start_timestamp is not None and end_timestamp is not None:
            query = f"after:{int(start_timestamp)} before:{int(end_timestamp)}"

        if query is not None:
            messages_result = service.users().messages().list(
                userId="me", maxResults=max_fetched_emails, q=query
            ).execute()
        else:
            messages_result = service.users().messages().list(
                userId="me", maxResults=max_fetched_emails
            ).execute()

        messages, bounced_emails = (messages_result.get("messages", []), [])

        if messages:
            for msg in messages:
                msg_detail = service.users().messages().get(userId="me", id=msg["id"]).execute()
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

                if sender and sender == mailer_daemon_sender:
                    snippet = msg_detail.get("snippet", "No snippet available")
                    snippet = html.unescape(snippet)
                    main_failure = snippet[0]

                    for i in range(1, len(snippet)):
                        if snippet[i].isupper():
                            break
                        main_failure += snippet[i]

                    bounced_emails.append({
                        'id': msg['id'],
                        'msg': snippet,
                        'sender': sender,
                        'main_failure': main_failure.strip(),
                    })

            for bounced in bounced_emails:
                send_bounced_email_notification(dest_addr, bounced['msg'], bounced['main_failure'])

    except HttpError as error:
        print(f"An error occurred: {error}")

def send_bounced_email_notification(dest_addr: str, msg: str, failure: str):
    subject = "Student's email failed to send."
    message = f'''The email could not send due to

                {msg}

                {failure}'''
    send_email(dest_addr, subject, message)

def send_email_for_updated_email(address: str):
    subject = "Your email has been updated."
    message = f'''Your email has been updated by an admin.

                Access the app at this link: skill-builder.net

                Your new username is {address}'''
    send_email(address, subject, message)

def send_new_user_email(address: str, password: str):
    subject = "Welcome to Skillbuilder!"
    message = f'''Welcome to SkillBuilder, a tool to enhance your learning experience this semester! This app will be our hub for assessing and providing feedback on transferable skills (these are also referred to as process skills, professional skills, durable skills).

                Access the app at this link: skill-builder.net

                Login Information: Your Username is {address}

                Temporary Password: {password}

                Please change your password after your first login to keep your account secure.'''

    send_email(address, subject, message)

def send_reset_code_email(address: str, code: str):
    subject = "Skillbuilder - Reset your password"
    message = f'''Your reset code is <b>{code}</b>.

                go to skill-builder.net to login.

                Cheers,
                The Skillbuilder Team'''

    send_email(address, subject, message)

def email_students_feedback_is_ready_to_view(students: list, notification_message : str):
    for student in students:
        subject = "Skillbuilder - Your Feedback is ready to view!"

        message = f'''Greetings {student.first_name} {student.last_name},

                    Your skill development assessment is available to view and act upon. Please log in to SkillBuilder and look in Your Completed Assessments.

                    Message from Professor:
                    {notification_message}

                    Cheers,
                    The Skillbuilder Team
        '''

        send_email(student.email, subject, message)

def send_email(address: str, subject: str, content: str):
    try:
        scopes = ["https://www.googleapis.com/auth/gmail.compose"]

        creds = None

        if os.path.exists(OAUTH2_TOKEN_FP):
            creds = Credentials.from_authorized_user_file(OAUTH2_TOKEN_FP, scopes)

        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())

        if not creds or not creds.valid:
            raise EmailFailureException("creds is invalid")

        service = build("gmail", "v1", credentials=creds)

        message = EmailMessage()
        message.set_content(content)
        message["To"] = address
        message["From"] = "skillbuilder02@gmail.com"
        message["Subject"] = subject

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {
                "raw": encoded_message,
        }

        send_message = service.users().messages().send(userId="me", body=create_message).execute()

    # except RecursionError:
    #     s = traceback.format_exc()
    #     raise EmailFailureException(f"STACK ERROR: {s}")

    except Exception as e:
        raise EmailFailureException(str(e))


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

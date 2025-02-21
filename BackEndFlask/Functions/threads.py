from core import app
<<<<<<< HEAD
import threading

import time

from models.email_validation import *

def spawn_thread(f, *args, **kwargs):
    threading.Thread(
        target=f,
        args=args,
        kwargs=kwargs,
        daemon=True
    ).start()

def validate_pending_emails():
    """
    The purpose of this function is to be the entrypoint of a thread
    that gets all entries in the EmailValidation table with the
    status of 'pending'. It will then search for any bounced emails
    and send an email to the the person that added that user.
    """

    # Imports are placed here to handle circular dependencies.
    from models.user import get_user
    from models.utility import (
        check_bounced_emails,
        send_bounced_email_notification,
    )

    time.sleep(30)

    with app.app_context():
        try:
            print("Fetching emails to check")
            emails_to_check = get_emails_need_checking()

            if emails_to_check:
                oldest_time, all_pending_emails, data = (
                    emails_to_check[0].user.last_update, [], {},
                )

                for email_obj in emails_to_check:
                    if email_obj.user.last_update < oldest_time:
                        oldest_time = email_obj.user.last_update
                    owner_email = get_user(email_obj.user.owner_id).email
                    user_email = email_obj.user.email
                    data[user_email] = owner_email
                    all_pending_emails.append(user_email)

                # Regardless of if we find any bounces or not, we need
                # to update these.
                mark_emails_as_checked(all_pending_emails)

                bounced = check_bounced_emails(oldest_time)

                if bounced is None:
                    return

                for bounce in bounced:
                    # TODO: Find solution if the student's email in the message is not there.
                    #       Will this ever happen?
                    # if bounce["to"]:
                    send_bounced_email_notification(data[bounce['to']], bounce['msg'], bounce['main_failure'])

        except Exception as e:
            print(f'failed to run thread {e}')
=======
import time

from models.email_validation import *

def spawn_thread(f, *args, **kwargs):
    threading.Thread(
        target=f,
        args=args,
        kwargs=kwargs,
        daemon=True
    ).start()

def validate_pending_emails():
    """
    The purpose of this function is to be the entrypoint of a thread
    that gets all entries in the EmailValidation table with the
    status of 'pending'. It will then search for any bounced emails
    and send an email to the the person that added that user.
    """

    # Imports are placed here to handle circular dependencies.
    from models.user import get_user
    from models.utility import (
        check_bounced_emails,
        send_bounced_email_notification,
    )

    time.sleep(30)

    with app.app_context():
        try:
            print("Fetching emails to check")
            emails_to_check = get_emails_need_checking()

            if emails_to_check:
                oldest_time, all_pending_emails, data = (
                    emails_to_check[0].user.last_update, [], {},
                )

                for email_obj in emails_to_check:
                    if email_obj.user.last_update < oldest_time:
                        oldest_time = email_obj.user.last_update
                    owner_email = get_user(email_obj.user.owner_id).email
                    user_email = email_obj.user.email
                    data[user_email] = owner_email
                    all_pending_emails.append(user_email)

                # Regardless of if we find any bounces or not, we need
                # to update these.
                mark_emails_as_checked(all_pending_emails)

                bounced = check_bounced_emails(oldest_time)

                if bounced is None:
                    return

                for bounce in bounced:
                    # TODO: Find solution if the student's email in the message is not there.
                    #       Will this ever happen?
                    # if bounce["to"]:
                    send_bounced_email_notification(data[bounce['to']], bounce['msg'], bounce['main_failure'])

            except Exception as e:
                print(f"Error in email checker thread: {e}")
>>>>>>> 86ce120c4 (add threading, local runtime detection, EmailValidation table)

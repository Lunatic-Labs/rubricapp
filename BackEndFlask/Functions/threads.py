from core import app
import time
from models.email_validation import *
from models.user import get_user
from models.utility import check_bounced_emails

def email_checker_thread():
    timeout = 90
    while True:
        with app.app_context():
            try:
                print("Fetching emails to check")
                emails_to_check = get_emails_need_checking()

                if emails_to_check:
                    print(f"Found {len(emails_to_check)} emails to check.")

                    user_ids = [entry.user_id for entry in emails_to_check]
                    oldest_time = emails_to_check[0].user.last_update
                    data = {}

                    for email_obj in emails_to_check:
                        if email_obj.user.last_update < oldest_time:
                            oldest_time = email_obj.user.last_update
                        owner_email = get_user(email_obj.user.owner_id).email
                        user_email = email_obj.user.email
                        if owner_email not in data:
                            data[owner_email] = [user_email]
                        else:
                            data[owner_email].append(email_obj.user.email)

                check_bounced_emails(data, oldest_time)

                time.sleep(timeout)
            except Exception as e:
                print(f"Error in email checker thread: {e}")

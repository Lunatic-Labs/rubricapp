import time
import threading
from core import app
from models.email_validation import *  # exports update_email_to_pending, get_emails_need_checking, mark_emails_as_checked
from models.logger import logger
from enums.Bounced_email import BouncedEmailFields


_email_processor = None


class EmailValidationProcessor:
    def __init__(self, app=None):
        self._should_stop = False

    def _get_pending_emails_data(self, emails_to_check):
        from models.user import get_user

        oldest_time = emails_to_check[0].user.last_update
        email_to_owner_map = {}
        all_pending_emails = []

        for email_obj in emails_to_check:
            if email_obj.user.last_update < oldest_time:
                oldest_time = email_obj.user.last_update

            owner = get_user(email_obj.user.owner_id)
            if owner is None:
                continue

            user_email = email_obj.user.email
            email_to_owner_map[user_email] = owner.email
            all_pending_emails.append(user_email)

        return oldest_time, all_pending_emails, email_to_owner_map

    def process_pending_emails_once(self):
        try:
            emails_to_check = get_emails_need_checking()

            if not emails_to_check:
                return 0

            oldest_time, all_pending_emails, email_to_owner_map = self._get_pending_emails_data(emails_to_check)

            mark_emails_as_checked(all_pending_emails)

            self._process_bounced_emails(oldest_time, email_to_owner_map)

            return len(emails_to_check)

        except Exception as e:
            logger.error(f"Error in process_pending_emails_once: {e}")
            return None

    def _process_bounced_emails(self, oldest_time, email_to_owner_map):
        from models.utility import check_bounced_emails, send_bounced_email_notification

        if email_to_owner_map is None:
            return 0

        count = 0

        bounced = check_bounced_emails(int(oldest_time.timestamp()) - (2 * 60))

        if bounced is None:
            return count

        for bounce in bounced:
            to_email = bounce.get(BouncedEmailFields.TO.value)
            if to_email is None:
                continue
            if to_email not in email_to_owner_map:
                continue

            owner_email = email_to_owner_map[to_email]
            msg = bounce.get(BouncedEmailFields.MSG.value)
            failure = bounce.get(BouncedEmailFields.MAIN_FAILURE.value)

            try:
                send_bounced_email_notification(owner_email, msg, failure)
                count += 1
            except Exception:
                pass

        return count

    def run_continuous(self, sleep_interval=60, initial_delay=60):
        time.sleep(initial_delay)
        while not self._should_stop:
            self.process_pending_emails_once()
            time.sleep(sleep_interval)


def spawn_thread(f, *args, **kwargs):
    threading.Thread(
        target=f,
        args=args,
        kwargs=kwargs,
        daemon=True
    ).start()


def validate_pending_emails(sleep_interval=60):
    """
    Entrypoint for the email validation background process.
    Creates an EmailValidationProcessor and runs it continuously.
    Intended to be called via spawn_thread for production use.
    """
    global _email_processor
    _email_processor = EmailValidationProcessor()
    _email_processor.run_continuous(sleep_interval=sleep_interval, initial_delay=0)


def process_pending_emails_once():
    """Module-level convenience function wrapping EmailValidationProcessor."""
    processor = EmailValidationProcessor()
    return processor.process_pending_emails_once()


def stop_email_validation():
    """Signal the running EmailValidationProcessor to stop after its current iteration."""
    global _email_processor
    if _email_processor is not None:
        _email_processor._should_stop = True

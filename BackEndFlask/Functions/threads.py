from core import app
import threading
import time
from models.email_validation import *
from models.logger import logger
from datetime import datetime
from typing import Optional, List, Dict, Tuple


def spawn_thread(f, *args, **kwargs):
    """Spawn a daemon thread to run the given function."""
    threading.Thread(
        target=f,
        args=args,
        kwargs=kwargs,
        daemon=True
    ).start()


class EmailValidationProcessor:
    """
    Processes pending email validations and handles bounced emails.
    Separated into a class for better testability and maintainability.
    """
    
    def __init__(self, app_context=None):
        """
        Initialize the processor.
        
        Args:
            app_context: Flask app context (defaults to global app)
        """
        self.app = app_context or app
        self._should_stop = False
    
    def stop(self):
        """Signal the processor to stop after the current iteration."""
        self._should_stop = True
    
    def _get_pending_emails_data(self, emails_to_check: List) -> Tuple[datetime, List[str], Dict[str, str]]:
        """
        Extract and organize data from pending email objects.
        
        Args:
            emails_to_check: List of EmailValidation objects
            
        Returns:
            Tuple of (oldest_timestamp, list_of_emails, email_to_owner_mapping)
        """
        from models.user import get_user
        
        oldest_time = emails_to_check[0].user.last_update
        all_pending_emails = []
        email_to_owner_map = {}
        
        for email_obj in emails_to_check:
            # Track the oldest update time
            if email_obj.user.last_update < oldest_time:
                oldest_time = email_obj.user.last_update
            
            # Get owner email for this user
            owner = get_user(email_obj.user.owner_id)
            if owner is None:
                logger.warning(f"Owner {email_obj.user.owner_id} not found for user {email_obj.user.email}")
                continue
                
            user_email = email_obj.user.email
            email_to_owner_map[user_email] = owner.email
            all_pending_emails.append(user_email)
        
        return oldest_time, all_pending_emails, email_to_owner_map
    
    def _process_bounced_emails(
        self, 
        oldest_time: datetime, 
        email_to_owner_map: Dict[str, str]
    ) -> int:
        """
        Check for bounced emails and send notifications.
        
        Args:
            oldest_time: Oldest timestamp to check from
            email_to_owner_map: Mapping of user emails to owner emails
            
        Returns:
            Number of bounce notifications sent
        """
        from models.utility import check_bounced_emails, send_bounced_email_notification
        
        if not email_to_owner_map:
            logger.info("No valid owners found, skipping bounced emails check")
            return 0
    
        bounced_emails = check_bounced_emails(int(oldest_time.timestamp()))
        
        if bounced_emails is None:
            return 0
        
        notifications_sent = 0
        for bounce in bounced_emails:
            recipient_email = bounce.get('to')
            
            if not recipient_email:
                logger.warning(f"Bounced email missing 'to' field: {bounce}")
                continue
            
            if recipient_email not in email_to_owner_map:
                logger.warning(f"No owner found for bounced email: {recipient_email}")
                continue
            
            owner_email = email_to_owner_map[recipient_email]
            try:
                send_bounced_email_notification(
                    owner_email,
                    bounce.get('msg', 'Unknown error'),
                    bounce.get('main_failure', 'Unknown failure')
                )
                notifications_sent += 1
            except Exception as e:
                logger.error(f"Failed to send bounce notification to {owner_email}: {e}")
        
        return notifications_sent
    
    def process_pending_emails_once(self) -> Optional[int]:
        """
        Process pending emails once without looping.
        This is the core business logic, separated for testability.
        
        Returns:
            Number of emails processed, or None if an error occurred
        """
        
        try:
            logger.info("Fetching emails to check")
            emails_to_check = get_emails_need_checking()
            
            if not emails_to_check:
                logger.debug("No pending emails to check")
                return 0
            
            # Extract data from email objects
            oldest_time, all_pending_emails, email_to_owner_map = \
                self._get_pending_emails_data(emails_to_check)
            
            # Mark emails as checked regardless of bounce status
            mark_emails_as_checked(all_pending_emails)
            logger.info(f"Marked {len(all_pending_emails)} emails as checked")
            
            # Process any bounced emails
            notifications_sent = self._process_bounced_emails(oldest_time, email_to_owner_map)
            
            if notifications_sent > 0:
                logger.info(f"Sent {notifications_sent} bounce notifications")
            
            return len(all_pending_emails)
            
        except Exception as e:
            logger.error(f"Failed to process pending emails: {e}")
            return None
    
    def run_continuous(self, sleep_interval: int = 60, initial_delay: int = 30):
        """
        Continuously process pending emails in a loop.
        
        Args:
            sleep_interval: Seconds to sleep between iterations
            initial_delay: Seconds to wait before first iteration
        """
        # Initial delay before starting
        time.sleep(initial_delay)
        
        while not self._should_stop:
            with self.app.app_context():
                self.process_pending_emails_once()
            
            # Sleep between iterations
            time.sleep(sleep_interval)
        
        logger.info("Email validation processor stopped")


# Global processor instance
_email_processor: Optional[EmailValidationProcessor] = None


def validate_pending_emails(sleep_interval: int = 60, initial_delay: int = 30):
    """
    The purpose of this function is to be the entrypoint of a thread
    that gets all entries in the EmailValidation table with the
    status of 'pending'. It will then search for any bounced emails
    and send an email to the person that added that user.
    
    Args:
        sleep_interval: Seconds to sleep between checks (default: 60)
        initial_delay: Seconds to wait before first check (default: 30)
    """
    global _email_processor
    
    _email_processor = EmailValidationProcessor(app)
    _email_processor.run_continuous(sleep_interval, initial_delay)


def stop_email_validation():
    """Stop the email validation processor gracefully."""
    global _email_processor
    if _email_processor:
        _email_processor.stop()


def process_pending_emails_once():
    """
    Process pending emails once without continuous loop.
    Useful for testing or manual invocation.
    
    Returns:
        Number of emails processed, or None if an error occurred
    """
    processor = EmailValidationProcessor(app)
    with app.app_context():
        return processor.process_pending_emails_once()
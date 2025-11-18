import pytest
from datetime import datetime, timedelta
from Functions.threads import (
    EmailValidationProcessor,
    validate_pending_emails,
    process_pending_emails_once,
    stop_email_validation,
)
from models.user import create_user, delete_user, get_user
from models.schemas import EmailValidation
from core import db, app
from unittest.mock import patch
from Tests.PopulationFunctions import cleanup_test_users
from integration.integration_helpers import sample_user
from models.email_validation import create_validation

@pytest.fixture
def seed_users(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        user_data1 = sample_user(email="student1@example.com")
        user1 = create_user(user_data1)
        user_data2 = sample_user(email="student2@example.com")
        user2 = create_user(user_data2)

        email1 = create_validation(user1.user_id, user1.email)
        email2 = create_validation(user2.user_id, user2.email)

        yield [user1, user2]

        # Cleanup
        try:
            db.session.delete(email1)
            db.session.delete(email2)
            db.session.commit()
            delete_user(user1.user_id)
            delete_user(user2.user_id)
        except Exception as e:
            print(f"Cleanup skipped: {e}")


def test_process_pending_emails_once(flask_app_mock, seed_users):
    users = seed_users
    processor = EmailValidationProcessor()
    with flask_app_mock.app_context():
        with patch("models.utility.check_bounced_emails") as mock_check_bounced, \
             patch("models.utility.send_bounced_email_notification") as mock_send:

            # Simulate one bounced email
            mock_check_bounced.return_value = [
                {
                    "to": users[0].email,
                    "msg": "550 Mailbox not found",
                    "main_failure": "Invalid recipient"
                }
            ]

            result = processor.process_pending_emails_once()
            assert result == len(users)

            owner = get_user(users[0].owner_id)
            # Bounce notification sent for the first user
            mock_send.assert_called_once_with(
                owner.email,  # owner/teacher email
                "550 Mailbox not found",
                "Invalid recipient"
            )


def test_process_pending_emails_once_no_pending_emails(flask_app_mock):
    processor = EmailValidationProcessor()
    with flask_app_mock.app_context():
        result = processor.process_pending_emails_once()
        assert result == 0

def test_process_pending_emails_once_bounces_return_none(flask_app_mock, seed_users):
    emails = seed_users
    processor = EmailValidationProcessor()
    with flask_app_mock.app_context():
        with patch("models.utility.send_bounced_email_notification") as mock_send, \
             patch("models.utility.check_bounced_emails") as mock_check_bounced:

            result = processor.process_pending_emails_once()
            assert result == len(emails)
            mock_send.assert_not_called()
            mock_check_bounced.assert_called_once()


def test_run_continuous_stops_after_one_iteration(flask_app_mock, seed_users):
    users = seed_users
    processor = EmailValidationProcessor()

    with flask_app_mock.app_context():
        with patch.object(processor, "process_pending_emails_once") as mock_process, \
             patch("time.sleep", side_effect=KeyboardInterrupt):

            try:
                processor.run_continuous(sleep_interval=10, initial_delay=0)
            except KeyboardInterrupt:
                pass 

            pending_emails = EmailValidation.query.all()
            assert len(pending_emails) == len(users)
            mock_process.assert_not_called()  


def test_validate_pending_emails_entrypoint(flask_app_mock, seed_users):
    users = seed_users
    with flask_app_mock.app_context():
        # Patch sleep to stop after first iteration
        with patch("time.sleep", side_effect=KeyboardInterrupt):
            try:
                validate_pending_emails(sleep_interval=5)
            except KeyboardInterrupt:
                pass

        # _email_processor should have been set
        from Functions import threads
        assert threads._email_processor is not None

        stop_email_validation()
        assert threads._email_processor._should_stop is True

def test_process_pending_emails_once_function(flask_app_mock, seed_users):
    users = seed_users
    with flask_app_mock.app_context():
        result = process_pending_emails_once()
        assert result == len(users)


def test_process_bounced_emails_without_email_to_owner_map(flask_app_mock):
    processor = EmailValidationProcessor()

    oldest_time = datetime.now()
    with flask_app_mock.app_context():
        result = processor._process_bounced_emails(oldest_time, None)

        assert result == 0

def test_process_bounced_emails_without_recipient_email(flask_app_mock):
    processor = EmailValidationProcessor()

    oldest_time = datetime.now()
    email_to_owner_map = {"student@example.com": "owner@example.com"}
    
    # Mock bounced emails without "to" 
    bounced_emails = [
        {
            "msg": "550 Mailbox not found",
            "main_failure": "Invalid recipient"
        }
    ]
    
    with flask_app_mock.app_context():
        with patch("models.utility.check_bounced_emails", return_value=bounced_emails):
            
            result = processor._process_bounced_emails(oldest_time, email_to_owner_map)
            assert result == 0


def test_process_bounced_emails_with_no_recipient_email_in_email_to_owner_map(flask_app_mock):
    processor = EmailValidationProcessor()

    oldest_time = datetime.now()
    email_to_owner_map = {"student1@example.com": "owner@example.com"}
    
    # Mock bounced emails without "to" for not recipient email test
    bounced_emails = [
        {
            "to": "student@example.com",
            "msg": "550 Mailbox not found",
            "main_failure": "Invalid recipient"
        }
    ]
    
    with flask_app_mock.app_context():
        with patch("models.utility.check_bounced_emails", return_value=bounced_emails):
            
            result = processor._process_bounced_emails(oldest_time, email_to_owner_map)
            assert result == 0

def test_process_bounced_emails_notification_exception(flask_app_mock):
    processor = EmailValidationProcessor()

    oldest_time = datetime.now()
    email_to_owner_map = {"student@example.com": "owner@example.com"}
    
    # Mock bounced emails 
    bounced_emails = [
        {
            "to": "student@example.com",
            "msg": "550 Mailbox not found",
            "main_failure": "Invalid recipient"
        }
    ]
    
    with flask_app_mock.app_context():
        with patch("models.utility.check_bounced_emails", return_value=bounced_emails), \
             patch("models.utility.send_bounced_email_notification", side_effect=Exception("Email service down")):
            
            result = processor._process_bounced_emails(oldest_time, email_to_owner_map)
            assert result == 0

def test_run_continuous_with_exception_to_stop_loop(flask_app_mock):
    processor = EmailValidationProcessor()

    with flask_app_mock.app_context():
        with patch.object(processor, "process_pending_emails_once") as mock_process, \
             patch("time.sleep", side_effect=[None, KeyboardInterrupt]):

            try:
                processor.run_continuous(sleep_interval=0, initial_delay=0)
            except KeyboardInterrupt:
                pass

            mock_process.assert_called_once()


def test_process_pending_emails_once_raises_exception(flask_app_mock):
    processor = EmailValidationProcessor()
    with flask_app_mock.app_context():
        with patch("Functions.threads.get_emails_need_checking", side_effect=Exception("DB failure")):
            result = processor.process_pending_emails_once()
            assert result is None


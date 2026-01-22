import pytest
from core import db
from models.email_validation import (
    create_validation,
    get_emails_need_checking,
    update_email_to_pending,
    mark_emails_as_checked,
    mark_emails_as_pending,
)
from Tests.PopulationFunctions import cleanup_test_users
from models.schemas import EmailValidation, User
from datetime import datetime, timezone
from integration.integration_helpers import sample_user
from models.user import create_user, delete_user
import os


def test_create_validation(flask_app_mock):
    """Ensure a new EmailValidation row is created correctly."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            data = sample_user()
            user = create_user(data)
            create_validation(user.user_id, user.email)

            result = EmailValidation.query.filter_by(user_id=user.user_id).first()
            assert result is not None
            assert result.email == user.email
            assert result.status == "pending"
            assert isinstance(result.validation_time, datetime)
        
        finally:
            #cleanup
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_get_emails_need_checking_returns_only_pending(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            data = sample_user(email="pending1@example.com")
            user = create_user(data)
        
            # Create two, one pending and one checked
            create_validation(user.user_id, user.email)
            ev2 = EmailValidation(user_id=user.user_id, email="checked@example.com", status="checked")
            db.session.add(ev2)
            db.session.commit()

            results = get_emails_need_checking()
            emails = [r.email for r in results]

            assert "pending1@example.com" in emails
            assert "checked@example.com" not in emails

        finally:
            #cleanup
            try:
                db.session.delete(ev2)
                db.session.commit()
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_update_email_to_pending_updates_existing(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            data = sample_user()
            user = create_user(data)
            # Create initial checked validation
            ev = EmailValidation(user_id=user.user_id, email="old@example.com", status="checked")
            db.session.add(ev)
            db.session.commit()

            update_email_to_pending(user.user_id)

            updated = EmailValidation.query.filter_by(user_id=user.user_id).first()
            assert updated.status == "pending"
            assert updated.email == user.email

        finally:
            #cleanup
            try:
                db.session.delete(ev)
                db.session.commit()
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


from datetime import timedelta

def test_mark_emails_as_checked_updates_status_and_time(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            data = sample_user()
            user = create_user(data)
            # Create two pending validations
            ev1 = EmailValidation(user_id=user.user_id, email="a@example.com", status="pending")
            ev2 = EmailValidation(user_id=user.user_id, email="b@example.com", status="pending")
            db.session.add_all([ev1, ev2])
            db.session.commit()

            # Capture time before the operation
            time_before = datetime.now(timezone.utc)
            mark_emails_as_checked(["a@example.com", "b@example.com"])
            time_after = datetime.now(timezone.utc)

            result = EmailValidation.query.filter_by(email="a@example.com").first()
            assert result.status == "checked"

            # Normalize to UTC before comparing
            validation_time = result.validation_time
            if validation_time.tzinfo is None:
                validation_time = validation_time.replace(tzinfo=timezone.utc)

            # Allow 2 seconds tolerance for database rounding
            tolerance = timedelta(seconds=2)
            assert time_before - tolerance <= validation_time <= time_after + tolerance, \
                f"validation_time {validation_time} not within tolerance of {time_before} and {time_after}"
            
            # Also verify it's recent (additional safety check)
            assert (datetime.now(timezone.utc) - validation_time).total_seconds() < 5, \
                "validation_time should be recent"

        finally:
            # cleanup
            try:
                db.session.delete(ev1)
                db.session.delete(ev2)
                db.session.commit()
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_mark_emails_as_checked_empty_list_does_nothing(flask_app_mock):
    with flask_app_mock.app_context():
        # Should not raise errors or modify anything
        mark_emails_as_checked([])
        assert True  # No exceptions == pass


def test_mark_emails_as_pending(flask_app_mock):
    #if os.getenv("TESTING") == "true":
        #pytest.skip("Skipping pending email tests in Docker")
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            data = sample_user()
            user = create_user(data)
            ev = EmailValidation(user_id=user.user_id, email="pending@example.com", status="checked")
            db.session.add(ev)
            db.session.commit()

            mark_emails_as_pending(["pending@example.com"])

            updated = EmailValidation.query.filter_by(email="pending@example.com").first()
            assert updated.status == "pending"

        finally:
            #cleanup
            try:
                db.session.delete(ev)
                db.session.commit()
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_mark_emails_as_pending_empty_list_does_nothing(flask_app_mock):
    #if os.getenv("TESTING") == "true":
        #pytest.skip("Skipping pending email tests in Docker")
    with flask_app_mock.app_context():
        mark_emails_as_pending([])
        assert True

from core import db
from models.schemas import EmailValidation
from datetime import datetime, timezone

def create_validation(user_id, email):
    email_validation = EmailValidation(
        user_id=user_id,
        email=email,
        status="pending",
        validation_time=datetime.now(timezone.utc),
    )

    db.session.add(email_validation)
    db.session.commit()

def get_emails_need_checking():
    return EmailValidation.query.filter_by(status="pending").all()

def update_email_to_pending(user_id):
    email_validation = EmailValidation.query.filter_by(user_id=user_id).first()

    if email_validation:
        email_validation.email = email_validation.user.email
        email_validation.status = "pending"
        db.session.commit()

def mark_emails_as_checked(emails):
    if not emails:
        return

    now_utc = datetime.now(timezone.utc)
    records = EmailValidation.query.filter(EmailValidation.email.in_(emails)).all()

    for record in records:
        record.status = "checked"
        record.validation_time = now_utc

    db.session.commit()


def mark_emails_as_pending(emails):
    if len(emails) == 0:
        return

    EmailValidation.query.filter(EmailValidation.email.in_(emails)).update(
        {"status": "pending"}
    )

    db.session.commit()

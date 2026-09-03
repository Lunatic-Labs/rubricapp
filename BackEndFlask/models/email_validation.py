from core import db
from sqlalchemy import select, update
from models.schemas import EmailValidation
from datetime import datetime, timezone

def create_validation(user_id, email):
    email_validation = EmailValidation(
        user_id=user_id,
        email=email,
        status="pending",
        validation_time=datetime.now(),
    )

    db.session.add(email_validation)
    db.session.commit()
    return email_validation

def get_emails_need_checking():
    return db.session.scalars(select(EmailValidation).filter_by(status="pending")).all()

def update_email_to_pending(user_id):
    email_validation = db.session.scalars(select(EmailValidation).filter_by(user_id=user_id).limit(1)).first()

    if email_validation:
        email_validation.email = email_validation.user.email
        email_validation.status = "pending"
        db.session.commit()

def mark_emails_as_checked(emails):
    if len(emails) == 0:
        return

    db.session.execute(
        update(EmailValidation)
        .where(EmailValidation.email.in_(emails))
        .values(status="checked", validation_time=datetime.now(timezone.utc).replace(tzinfo=None))
    )

    db.session.commit()

def mark_emails_as_pending(emails):
    if len(emails) == 0:
        return

    db.session.execute(
        update(EmailValidation)
        .where(EmailValidation.email.in_(emails))
        .values(status="pending")
    )

    db.session.commit()
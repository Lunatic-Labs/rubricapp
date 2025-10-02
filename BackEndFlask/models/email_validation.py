from core import db
from models.schemas import EmailValidation
from datetime import datetime

def create_validation(user_id, email):
    email_validation = EmailValidation(
        user_id=user_id,
        email=email,
        status="pending",
        validation_time=datetime.now(),
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
    if len(emails) == 0:
        return

    EmailValidation.query.filter(EmailValidation.email.in_(emails)).update(
        {"status": "checked", "validation_time": datetime.utcnow()}
    )

    db.session.commit()

def mark_emails_as_pending(emails):
    if len(emails) == 0:
        return

    EmailValidation.query.filter(EmailValidation.email.in_(emails)).update(
        {"status": "pending"}
    )

    db.session.commit()

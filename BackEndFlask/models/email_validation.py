from core import db
from models.schemas import EmailValidation
from datetime import datetime

def create_validation(user_id, email):
    email_validation = EmailValidation(
        user_id=user_id,
        email=email,
        status="pending",
        validation_time=datetime.utcnow(),
    )

    db.session.add(email_validation)
    db.session.commit()

def get_emails_need_checking():
    return EmailValidation.query.filter_by(status="pending").all()

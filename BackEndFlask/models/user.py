from core import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import User
from models.utility import generate_random_password, send_new_user_email
from dotenv import load_dotenv
import os
from models.logger import logger

load_dotenv()

class InvalidUserID(Exception):
    def __init__(self):
        self.message = "Raised when user_id does not exist"

    def __str__(self):
        return self.message

class EmailAlreadyExists(Exception):
    def __init__(self):
        self.message = "Raised when email already exists and password did not match"

    def __str__(self):
        return self.message


def get_users():
    try:
        return User.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_users_by_role_id(role_id):
    try:
        return User.query.filter_by(role_id=role_id).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_users_by_email(email):
    try:
        return User.query.filter_by(email=email).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_consent(user_id):
    try:
        return User.query.filter_by(user_id=user_id).first().consent
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user(user_id):
    try:
        one_user = User.query.filter_by(user_id=user_id).first()
        if one_user is None:
            logger.error(f"{user_id} does not exist")
            raise InvalidUserID
        return one_user
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidUserID as e:
        logger.error(f"{str(e)}: {user_id}")
        raise e


def get_user_password(user_id):
    try:
        user = User.query.filter_by(user_id=user_id).first()
        if user is None:
            logger.error(f"{user_id} does not exist")
            raise InvalidUserID
        return user.password
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidUserID as e:
        logger.error(f"{str(e)}: {user_id}")
        raise e


def get_user_first_name(user_id):
    try:
        return User.query.filter_by(user_id=user_id).first().first_name
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_user_id_by_first_name(first_name):
    try:
        return User.query.filter_by(first_name=first_name).first().user_id
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_user_id_by_email(email):
    try:
        return get_user_by_email(email).user_id
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_by_email(email):
    try:
        return User.query.filter_by(email=email).first()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_user_user_id_by_email(email):
    try:
        user = User.query.filter_by(email=email).first()
        return (lambda: "Invalid user_id, user_id does not exist!", lambda: user.user_id)[user is not None]()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def has_changed_password(user_id: int, status: bool) -> None:  # marks a user as having logged in before
    user = User.query.filter_by(user_id=user_id).first()
    setattr(user, 'has_set_password', status)
    db.session.commit()


def update_password(user_id, password) -> str: 
    user = User.query.filter_by(user_id=user_id).first()
    pass_hash = generate_password_hash(password)
    setattr(user, 'password', pass_hash)
    db.session.commit()
    return pass_hash


def set_reset_code(user_id, code_hash): 
    user = User.query.filter_by(user_id=user_id).first()
    setattr(user, 'reset_code', code_hash)
    db.session.commit()

def user_already_exists(user_data):
    try:
        user = User.query.filter_by(email=user_data["email"]).first()
        if user is None:
            return None
        elif check_password_hash(user.password, user_data["password"]) is False:
            logger.error(f"{user_data['email']} already exists and password did not match")
            raise EmailAlreadyExists
        return user
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def create_user(user_data):
    try:
        if "password" in user_data: 
            password = user_data["password"]
            has_set_password = True # for demo users, avoid requirement to choose new password 
        else: 
            password = generate_random_password(6)
            send_new_user_email(user_data["email"], password)
            has_set_password = False
        password_hash = generate_password_hash(password)
        user_data = User(
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            password=password_hash,
            lms_id=user_data["lms_id"],
            consent=user_data["consent"],
            owner_id=user_data["owner_id"],
            isAdmin="role_id" in user_data.keys() and user_data["role_id"]==3,
            has_set_password=has_set_password,
            reset_code=None
        )
        db.session.add(user_data)
        db.session.commit()
        return user_data
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def makeAdmin(user_id):
    try:
        user = User.query.filter_by(user_id=user_id).first()
        user.isAdmin = True
        db.session.add(user)
        db.session.commit()
        return user
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


# user_id = 1
def load_SuperAdminUser():
    create_user({
        "first_name": "Super",
        "last_name": "Admin",
        "email": "superadminuser01@skillbuilder.edu",
        "password": str(os.environ.get('SUPER_ADMIN_PASSWORD')),
        "lms_id": 0,
        "consent": None,
        "owner_id": 0,
        "role_id": None
    })

# user_id = 2
def load_demo_admin():
    create_user({
        "first_name": "Braden",
        "last_name": "Grundmann",
        "email": "demoadmin02@skillbuilder.edu",
        "password": str(os.environ.get('DEMO_ADMIN_PASSWORD')),
        "lms_id": 1,
        "consent": None,
        "owner_id": 1,
        "role_id": 3
    })

# user_id = 3
def load_demo_ta_instructor():
    create_user({
        "first_name": "Lesley",
        "last_name": "Sheppard",
        "email": "demotainstructor03@skillbuilder.edu",
        "password": str(os.environ.get('DEMO_TA_INSTRUCTOR_PASSWORD')),
        "lms_id": 2,
        "consent": None,
        "owner_id": 2,
        "role_id": 4
    })

def load_demo_student():
    listOfDemoNames = [
        # user_id = 4
        {
            "first_name": "Maria",
            "last_name": "Rodriguez"
        },
        # user_id = 5
        {
            "first_name": "Liam",
            "last_name": "Walker"
        },
        # user_id = 6
        {
            "first_name": "Wade",
            "last_name": "Cooper"
        },
        # user_id = 7
        {
            "first_name": "Lucy",
            "last_name": "Parks"
        },
        # user_id = 8
        {
            "first_name": "Gilbert",
            "last_name": "Francis"
        },
        # user_id = 9
        {
            "first_name": "Isabel",
            "last_name": "Holland"
        },
        # user_id = 10
        {
            "first_name": "Nathaniel",
            "last_name": "Allen"
        },
        # user_id = 11
        {
            "first_name": "Blake",
            "last_name": "Perez"
        },
        # user_id = 12
        {
            "first_name": "Stella",
            "last_name": "Griffin"
        },
        # user_id = 13
        {
            "first_name": "Deborah",
            "last_name": "Warren"
        },
    ]
    count = 4
    for name in listOfDemoNames:
        create_user({
            "first_name": name["first_name"],
            "last_name": name["last_name"],
            # demostudent4@skillbuilder.edu
            "email": f"demostudent{count}@skillbuilder.edu",
            "password": str(os.environ.get('DEMO_STUDENT_PASSWORD')) + f"{count}",
            "lms_id": count,
            "consent": None,
            "owner_id": 2,
            "role_id": 5
        })
        count += 1

def replace_user(user_data, user_id):
    try:
        one_user = User.query.filter_by(user_id=user_id).first()
        if one_user is None:
            logger.error(f"{user_id} does not exist")
            raise InvalidUserID
        one_user.first_name = user_data["first_name"]
        one_user.last_name = user_data["last_name"]
        one_user.email = user_data["email"]
        one_user.password = user_data["password"]
        one_user.lms_id = user_data["lms_id"]
        one_user.consent = user_data["consent"]
        one_user.owner_id = user_data["owner_id"]
        db.session.commit()
        return one_user
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidUserID:
        logger.error(f"{str(e)}: {user_id}")
        raise e


def delete_user(user_id):
    try:
        User.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return True
    except SQLAlchemyError as e:
        # Log str(e.__dict__['orig'])
        raise e
        # error = str(e.__dict__['orig'])
        # return error

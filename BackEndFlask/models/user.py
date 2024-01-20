from core import db
from werkzeug.security import generate_password_hash, check_password_hash
from models.schemas import User
from models.utility import generate_random_password, send_new_user_email
from dotenv import load_dotenv
from models.utility import error_log
import os
load_dotenv()

class InvalidUserID(Exception):
    def __init__(self, id):
        self.message = f"Invalid user_id: {id}."

    def __str__(self):
        return self.message

class EmailAlreadyExists(Exception):
    def __init__(self, email):
        self.message = f"Invalid email: {email}."

    def __str__(self):
        return self.message


@error_log
def get_users():
    return User.query.all()


@error_log
def get_users_by_role_id(role_id):
    return User.query.filter_by(role_id=role_id).all()


@error_log
def get_users_by_owner_id(owner_id):
    return User.query.filter_by(owner_id=owner_id).all()


@error_log
def get_users_by_email(email):
    return User.query.filter_by(email=email).all()


@error_log
def get_user_consent(user_id):
    return User.query.filter_by(user_id=user_id).first().consent


@error_log
def get_user(user_id):
    one_user = User.query.filter_by(user_id=user_id).first()

    if one_user is None:
        raise InvalidUserID(user_id)

    return one_user


@error_log
def get_user_password(user_id):
    user = User.query.filter_by(user_id=user_id).first()

    if user is None:
        raise InvalidUserID(user_id)

    return user.password


@error_log
def get_user_admins():
   all_user_admins = db.session.query(
       User.user_id,
       User.first_name,
       User.last_name,
       User.email,
       User.lms_id,
       User.consent,
       User.owner_id
   ).filter_by(
       isAdmin=True
   ).all()

   db.session.query()

   return all_user_admins


@error_log
def get_user_first_name(user_id):
    return User.query.filter_by(user_id=user_id).first().first_name


@error_log
def get_user_user_id_by_first_name(first_name):
    return User.query.filter_by(first_name=first_name).first().user_id


@error_log
def get_user_user_id_by_email(email):
    return get_user_by_email(email).user_id


@error_log
def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


@error_log
def get_user_user_id_by_email(email):
    return User.query.filter_by(email=email).first().user_id


@error_log
def has_changed_password(user_id: int, status: bool) -> None:  # marks a user as having logged in before
    user = User.query.filter_by(user_id=user_id).first()

    setattr(user, 'has_set_password', status)

    db.session.commit()


@error_log
def update_password(user_id, password) -> str: 
    user = User.query.filter_by(user_id=user_id).first()
    pass_hash = generate_password_hash(password)

    setattr(user, 'password', pass_hash)

    db.session.commit()

    return pass_hash


@error_log
def set_reset_code(user_id, code_hash): 
    user = User.query.filter_by(user_id=user_id).first()

    setattr(user, 'reset_code', code_hash)

    db.session.commit()


@error_log
def user_already_exists(user_data):
    user = User.query.filter_by(email=user_data["email"]).first()

    if user is None:
        return None
    elif check_password_hash(user.password, user_data["password"]) is False:
        raise EmailAlreadyExists(user_data["email"])

    return user


@error_log
def create_user(user_data):
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
        is_admin="role_id" in user_data.keys() and user_data["role_id"]==3,
        has_set_password=has_set_password,
        reset_code=None
    )

    db.session.add(user_data)
    db.session.commit()

    return user_data


@error_log
def makeAdmin(user_id):
    user = User.query.filter_by(user_id=user_id).first()
    user.is_admin = True

    db.session.add(user)
    db.session.commit()

    return user


# user_id = 1
def load_SuperAdminUser():
    create_user({
        "first_name": "Super",
        "last_name": "Admin",
        "email": "superadminuser01@skillbuilder.edu",
        "password": str(os.environ.get('SUPER_ADMIN_PASSWORD')),
        "lms_id": 0,
        "consent": None,
        "owner_id": None,
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


@error_log
def replace_user(user_data, user_id):
    one_user = User.query.filter_by(user_id=user_id).first()

    if one_user is None:
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


@error_log
def delete_user(user_id):
    User.query.filter_by(user_id=user_id).delete()

    db.session.commit()

    return True

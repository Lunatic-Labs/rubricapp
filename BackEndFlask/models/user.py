from core import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import User
from models.logger import logger

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


def user_already_exists(user_data):
    try:
        user = User.query.filter_by(
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            role_id=user_data["role_id"],
            lms_id=user_data["lms_id"],
            consent=user_data["consent"],
            owner_id=user_data["owner_id"]
        ).first()
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
        password = user_data["password"]
        password_hash = generate_password_hash(password)
        user_data = User(
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            password=password_hash,
            role_id=user_data["role_id"],
            lms_id=user_data["lms_id"],
            consent=user_data["consent"],
            owner_id=user_data["owner_id"]
        )
        db.session.add(user_data)
        db.session.commit()
        return user_data
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


# user_id = 1
def load_SuperAdminUser():
    create_user({
        "first_name": "Super Admin",
        "last_name": "User",
        "email": "superadminuser01@skillbuilder.edu",
        "password": "superadminsecretpassword01",
        "role_id": 2,
        "lms_id": 0,
        "consent": None,
        "owner_id": 0
    })

# user_id = 2
def load_demo_admin():
    create_user({
        "first_name": "Braden",
        "last_name": "Grundmann",
        "email": "demoadmin02@skillbuilder.edu",
        "password": "demoadminsecretpassword02",
        "role_id": 3,
        "lms_id": 1,
        "consent": None,
        "owner_id": 1
    })

# user_id = 3
def load_demo_ta_instructor():
    create_user({
        "first_name": "Lesley",
        "last_name": "Sheppard",
        "email": "demotainstructor03@skillbuilder.edu",
        "password": "demotainstructorsecretpassword03",
        "role_id": 4,
        "lms_id": 2,
        "consent": None,
        "owner_id": 2
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
            "email": f"demostudent{count}@skillbuilder.edu",
            "password": f"demostudentsecretpassword{count}",
            "role_id": 5,
            "lms_id": count,
            "consent": None,
            "owner_id": 2
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
        one_user.role_id = user_data["role_id"]
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


# def update_user_first_name(user_id, new_first_name):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         one_user.first_name = new_first_name
#         db.session.add(one_user)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except:
#         return False

# def update_user_last_name(user_id, new_last_name):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         one_user.last_name = new_last_name
#         db.session.add(one_user)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except:
#         return False

# def update_user_email(user_id, new_email):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         one_user.email = new_email
#         db.session.add(one_user)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except:
#         return False

# def update_user_password(user_id, new_password):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         password_hash = generate_password_hash(new_password, method='sha256')
#         one_user.password = password_hash
#         db.session.add(one_user)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except:
#         return False

# def update_user_role(user_id, new_role):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         one_user.role = new_role
#         db.session.add(one_user)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except:
#         return False

# def update_user_institution(user_id, new_institution):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         one_user.institution = new_institution
#         db.session.add(one_user)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except:
#         return False

# def update_user_consent(user_id, new_consent):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         one_user.consent = new_consent
#         db.session.add(one_user)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except:
#         return False

# def delete_all_users():
#     try:
#         all_users = Users.query.all()
#         db.session.delete(all_users)
#         db.session.commit()
#         all_users = Users.query.all()
#         return all_users
#     except SQLAlchemyError as e:
#         error = str(e.__dict__['orig'])
#         return error

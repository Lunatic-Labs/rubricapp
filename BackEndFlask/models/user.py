from core import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Users
from numpy import genfromtxt # had to pip install numpy

class InvalidUserID(Exception):
    "Raised when user_id does not exist!!!"
    pass

def get_users():
    try: 
        return Users.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_user(user_id):
    try:
        one_user = Users.query.filter_by(user_id=user_id).first()
        if one_user is None:
            raise InvalidUserID
        return one_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserID:
        error = "Invalid user_id, user_id does not exist!"
        return error

def get_user_password(user_id):
    try:
        user = Users.query.filter_by(user_id=user_id).first()
        if user is None:
            raise InvalidUserID
        return user.password
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserID:
        error = "Invalid user_id, user_id does not exist!"
        return InvalidUserID

def get_user_by_email(email):
    user = Users.query.filter_by(email=email).first()
    if user is None:
        return True
    else:
        return user

def user_already_exists(user_data):
    try:
        user = Users.query.filter_by(
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            role_id=user_data["role_id"],
            lms_id=user_data["lms_id"],
            consent=user_data["consent"],
            owner_id=user_data["owner_id"]
        ).first()
        if user is not None and check_password_hash(user.password, user_data["password"]) is False:
            return None
        return user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def create_user(user_data):
    try:
        password = user_data["password"]
        password_hash = generate_password_hash(password)
        user_data = Users(
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
        error = str(e.__dict__['orig'])
        return error

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

""" Bulkupload function made as an alternative to the function in bulkupload/studentImport.py """
# def studenttoCSV(csv_file_path): # takes csv file  
#     try:
#         data = genfromtxt(csv_file_path, delimiter=',', skip_header=1, converters={0: lambda s: str(s)})
#         data = data.tolist()

#         for i in data:
#             student = Users(**{
#                 'fname': i[1], # Notice: expect last name will come before first name in csv files
#                 'lname': i[0],
#                 'email': i[2],
#                 'password': 'skillbuilder',
#                 'role': '3',
#                 'lms_id': i[3],
#                 'consent': None,
#                 'owner_id': i[4] # default to csv, but will eventually be derived from current user
#             })
#             db.session.add(student)
#         db.session.commit()
#     except:
#         db.session.rollback()
#     finally:
#         db.session.close()

def replace_user(user_data, user_id):
    try:
        one_user = Users.query.filter_by(user_id=user_id).first()
        if one_user is None:
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
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserID:
        error = "Invalid user_id, user_id does not exist!"
        return error

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

# def delete_user(user_id):
#     try:
#         one_user = Users.query.filter_by(user_id=user_id).first()
#         Users.query.filter_by(user_id=user_id).delete()
#         db.session.commit()
#         return one_user
#     except SQLAlchemyError as e:
#         error = str(e.__dict__['orig'])
#         return error

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
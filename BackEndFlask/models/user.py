from core import db
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Users
from models.role import get_role
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
        one_user = Users.query.filter_by(user_id=user_id)
        if(type(one_user) == type(None)):
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
        one_user = get_user(user_id).first()
        if(type(one_user) == type(None)):
            raise InvalidUserID
        return one_user.password
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidUserID:
        error = "Invalid user_id, user_id does not exist!"
        return error

def create_user(user):
    try: 
        new_fname = user[0]
        new_lname = user[1]
        new_email = user[2]
        new_password = user[3]
        new_role_id = user[4]
        one_role = get_role(new_role_id)
        if(type(one_role.first())==type(None)):
            return "Invalid Role!"
        new_lms_id = user[5]
        new_consent = user[6]
        new_owner_id = user[7]
        password_hash = generate_password_hash(new_password)
        new_user = Users(fname=new_fname, lname=new_lname, email=new_email, password=password_hash, role_id=new_role_id, lms_id=new_lms_id, consent=new_consent, owner_id=new_owner_id)
        db.session.add(new_user)
        db.session.commit()
        return new_user
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

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

def replace_user(user, id):
    try:
        one_user = Users.query.filter_by(user_id=id).first()
        if(type(one_user) == type(None)):
            raise InvalidUserID
        one_user.fname = user[0]
        one_user.lname = user[1]
        one_user.email = user[2]
        one_user.password = user[3]
        one_user.role_id = user[4]
        one_user.lms_id = user[5]
        one_user.consent = user[6]
        one_user.owner_id = user[7]
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
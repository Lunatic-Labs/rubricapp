from core import db
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Users

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

    
#def getallEmails():


def create_user(user):
    try: 
        password_ = user["password"]
        password_hash = generate_password_hash(password_, method='scrypt')
        new_user = Users(fname=user["fname"],lname=user["lname"],email=user["email"],password=password_hash,role=user["role"],lms_id=user["lms_id"],consent=user["consent"],consent_is_null=user["consent_is_null"],owner_id=user["owner_id"])
        db.session.add(new_user)
        db.session.commit()
        return new_user
    except SQLAlchemyError as e:
        error = str(e)
        return error


def replace_user(user_data, user_id):
    try:
        one_user = Users.query.filter_by(user_id=user_id).first()
        if(type(one_user) == type(None)):
            raise InvalidUserID
        one_user.fname = user_data["fname"]
        one_user.lname = user_data["lname"]
        one_user.email = user_data["email"]
        one_user.password = user_data["password"]
        one_user.role = user_data["role"]
        one_user.lms_id = user_data["lms_id"]
        one_user.consent = user_data["consent"]
        one_user.consent_is_null = user_data["consent_is_null"]
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
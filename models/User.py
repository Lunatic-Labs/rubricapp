from core import db, UserMixin, generate_password_hash

class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    # Email is the same as username
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(20), nullable=True)
    # lms_id = db.Column(db.Integer, unique=True, nullable=False)
    institution = db.Column(db.String(30), nullable=False)
    consent = db.Column(db.String(6), nullable=False)

def get_users():
    try:
        all_user = Users.query.all()
        return all_user
    except:
        return False

def get_user(user_id):
    one_user = Users.query.filter_by(id=user_id)
    return one_user

def create_user(new_first_name, new_last_name, new_email, new_password, new_role, new_institution, new_consent):
    try:
        password_hash = generate_password_hash(new_password, method='sha256')
        new_user = Users(first_name=new_first_name, last_name=new_last_name, email=new_email, password = password_hash, role=new_role, institution=new_institution, consent=new_consent)
        db.session.add(new_user)
        db.session.commit()
        return True
    except:
        return False

def replace_user(user_id, new_first_name, new_last_name, new_email, new_password, new_role, new_institution, new_consent):
    try:
        one_user = Users.query.filter_by(id=user_id)
        password_hash = generate_password_hash(new_password, method='sha256')
        one_user.first_name = new_first_name
        one_user.last_name = new_last_name
        one_user.email = new_email
        one_user.password = password_hash
        one_user.role = new_role
        one_user.institution = new_institution
        one_user.consent = new_consent
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users 
    except:
        return False

def update_user_first_name(user_id, new_first_name):
    try:
        one_user = Users.query.filter_by(id=user_id).first()
        one_user.first_name = new_first_name
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False
    
def update_user_last_name(user_id, new_last_name):
    try:
        one_user = Users.query.filter_by(id=user_id).first()
        one_user.last_name = new_last_name
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False

def update_user_email(user_id, new_email):
    try:
        one_user = Users.query.filter_by(id=user_id).first()
        one_user.email = new_email
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False

def update_user_password(user_id, new_password):
    try:
        one_user = Users.query.filter_by(id=user_id).first()
        password_hash = generate_password_hash(new_password, method='sha256')
        one_user.password = password_hash
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False

def update_user_role(user_id, new_role):
    try:
        one_user = Users.query.filter_by(id=user_id).first()
        one_user.role = new_role
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False

def update_user_institution(user_id, new_institution):
    try:
        one_user = Users.query.filter_by(id=user_id).first()
        one_user.institution = new_institution
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False
    
def update_user_consent(user_id, new_consent):
    try:
        one_user = Users.query.filter_by(id=user_id).first()
        one_user.consent = new_consent
        db.session.add(one_user)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False

def delete_user(user_id):
    try:
        Users.query.filter_by(id=user_id).delete()
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False

def delete_all_users():
    try:
        all_users = Users.query.all()
        db.session.delete(all_users)
        db.session.commit()
        all_users = Users.query.all()
        return all_users
    except:
        return False
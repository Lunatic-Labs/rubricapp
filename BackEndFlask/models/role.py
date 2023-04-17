from core import db, UserMixin
from sqlalchemy import ForeignKey
from sqlalchemy.exc import SQLAlchemyError

""" 
Roles will equal the following:
    0 = SuperAdmin
    1 = Admin
    2 = TA/Instructor
    3 = Student
    4 = Researcher
"""
class InvalidRoleID(Exception):
    "Raised when role_id does not exist!!!"
    pass

class Role(UserMixin, db.Model):
    __tablename__ = "Role"
    role_id = db.Column(db.Integer, primary_key=True)
    
def get_roles():
    try:
        return Role.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_role(role_id):
    try:
        one_role = Role.query.filter_by(id=role_id)
        if(type(one_role) == type(None)):
            raise InvalidRoleID
        return one_role
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRoleID:
        error = "Invalid role_id, role_id does not exist!"
        return error
    
def create_role(role):
    try:
        new_role_id = role[0]
        new_role = Role(role_id=new_role_id)
        db.session.add(new_role)
        db.session.commit()
        return new_role
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def replace_role(role, id):
    try:
        one_role = Role.query.filter_by(role_id=id).first()
        if(type(one_role) == type(None)):
            raise InvalidRoleID
        one_role.role_id = role[0]
        db.session.commit()
        return one_role
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidRoleID:
        error = "Invalid role_id, role_id does not exist!"
        return error
        
"""
Delete is meant for the summer semester!!!
"""
        

from core import db, UserMixin
from sqlalchemy import ForeignKey

# Do we need to create a "create role" thing?

""" 
Roles will equal the following:
    0 = SuperAdmin
    1 = Admin
    2 = TA/Instructor
    3 = Student
    4 = Researcher
"""

class Role(UserMixin, db.Model):
    __tablename__ = "Role"
    role_id = db.Column(db.Integer, primary_key=True)
    
def get_roles():
    try:
        return Role.query.all()
    except:
        return False

def get_role(role_id):
    one_role = Role.query.filter_by(id=role_id)
    return one_role
    
def create_role(role):
    try:
        (role_id) = role
        new_role = Role(role_id)
        print(new_role)
        db.session.add(new_role)
        db.session.commit()
        print(Role.query.all())
        return True
    except:
        return False

def replace_user(role_id)
        
        
        

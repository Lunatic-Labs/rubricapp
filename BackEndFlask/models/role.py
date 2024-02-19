from core import db
from models.schemas import Role
from models.utility import error_log

class InvalidRoleID(Exception):
    def __init__(self, id):
        self.message = f"Invalid role_id: {id}."

    def __str__(self):
        return self.message

@error_log
def get_roles():
    return Role.query.all()


@error_log
def get_role(role_id):
    one_role = Role.query.filter_by(role_id=role_id).first()

    if one_role is None:
        raise InvalidRoleID(role_id)

    return one_role


@error_log
def create_role(new_role_name):
    new_role = Role(
        role_name=new_role_name
    )

    db.session.add(new_role)
    db.session.commit()

    return new_role


def load_existing_roles():
    create_role("Researcher")     # 1
    create_role("SuperAdmin")     # 2
    create_role("Admin")          # 3
    create_role("TA/Instructor")  # 4
    create_role("Student")        # 5


@error_log
def replace_role(new_role_name, role_id):
    one_role = Role.query.filter_by(role_id=role_id).first()

    if one_role is None:
        raise InvalidRoleID(role_id)

    one_role.role_name = new_role_name

    db.session.commit()

    return one_role
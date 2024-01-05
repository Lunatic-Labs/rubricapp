from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Role
from models.logger import logger

class InvalidRoleID(Exception):
    def __init__(self):
        self.message = "Invalid role_id, role_id does not exist"

    def __str__(self):
        return self.message


def get_roles():
    try:
        return Role.query.all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def get_role(role_id):
    try:
        one_role = Role.query.filter_by(role_id=role_id).first()
        if one_role is None:
            logger.error(f"{str(InvalidRoleID)} {role_id}")
            raise InvalidRoleID
        return one_role
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidRoleID as e:
        logger.error(f"{str(e)} {role_id}")
        raise e

def create_role(new_role_name):
    try:
        new_role = Role(
            role_name=new_role_name
        )
        db.session.add(new_role)
        db.session.commit()
        return new_role
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def load_existing_roles():
    create_role("Researcher")     # 1
    create_role("SuperAdmin")     # 2
    create_role("Admin")          # 3
    create_role("TA/Instructor")  # 4
    create_role("Student")        # 5

def replace_role(new_role_name, role_id):
    try:
        one_role = Role.query.filter_by(role_id=role_id).first()
        if one_role is None:
            logger.error(f"{str(e)} {role_id}")
            raise InvalidRoleID
        one_role.role_name = new_role_name
        db.session.commit()
        return one_role
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    except InvalidRoleID as e:
        logger.error(f"{str(e)} {role_id}")
        raise e


"""
Delete is meant for the summer semester!!!
"""


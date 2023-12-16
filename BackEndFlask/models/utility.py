from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import User, Course, UserCourse, TeamUser

def get_courses_by_user_courses_by_user_id(user_id):
    try:
        courses_and_role_ids = db.session.query(
            Course.course_id,
            Course.course_number,
            Course.course_name,
            Course.year,
            Course.term,
            Course.active,
            Course.admin_id,
            Course.use_tas,
            Course.use_fixed_teams,
            UserCourse.role_id
        ).join(
            UserCourse,
            Course.course_id == UserCourse.course_id
        ).filter_by(
            user_id=user_id
        ).all()
        return courses_and_role_ids
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_users_by_course_id(course_id):
    try:
        users_and_role_ids = db.session.query(
            User.user_id,
            User.first_name,
            User.last_name,
            User.email,
            User.lms_id,
            User.consent,
            User.owner_id,
            UserCourse.role_id
        ).join(
            UserCourse,
            User.user_id == UserCourse.user_id
        ).filter_by(
            course_id=course_id
        ).all()
        return users_and_role_ids
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_users_by_course_id_and_role_id(course_id, role_id):
    try:
        users_and_role_ids = db.session.query(
            User.user_id,
            User.first_name,
            User.last_name,
            User.email,
            User.lms_id,
            User.consent,
            User.owner_id,
            UserCourse.role_id
        ).join(
            UserCourse,
            User.user_id == UserCourse.user_id
        ).filter_by(
            course_id=course_id,
            role_id=role_id
        ).all()
        return users_and_role_ids
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_users_by_role_id(role_id):
    try:
        all_users_with_role_id = db.session.query(
            User.user_id,
            User.first_name,
            User.last_name,
            User.email,
            User.lms_id,
            User.consent,
            User.owner_id,
            UserCourse.role_id
        ).join(
            UserCourse,
            UserCourse.user_id==User.user_id
        ).filter_by(
            role_id=role_id
        ).all()
        return all_users_with_role_id
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_user_admins():
    try:
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
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_users_by_team_id(team_id):
    try:
        return db.session.query(
            User
        ).join(
            TeamUser,
            User.user_id == TeamUser.user_id
        ).filter_by(
            team_id = team_id
        ).all()
    except SQLAlchemyError as e:
        error = e.__dict__['orig']
        return error

def get_users_not_in_team_id(team_id):
    try:
        return db.session.query(
            User
        ).join(
            TeamUser,
            User.user_id == TeamUser.user_id
        ).filter(
            TeamUser.team_id != team_id
        ).all()
    except SQLAlchemyError as e:
        error = e.__dict__['orig']
        return error
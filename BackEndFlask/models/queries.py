from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.logger import logger
from models.schemas import *
from models.team_user import (
    create_team_user
)

from sqlalchemy import (
    and_,
    or_
)

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
            UserCourse.role_id,
            UserCourse.active
        ).join(
            UserCourse,
            Course.course_id == UserCourse.course_id
        ).filter_by(
            user_id=user_id,
            active=True
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
            UserCourse.role_id,
            UserCourse.active
        ).join(
            UserCourse,
            User.user_id == UserCourse.user_id
        ).filter_by(
            course_id=course_id,
            active=True
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
            UserCourse.role_id,
            UserCourse.active
        ).join(
            UserCourse,
            User.user_id == UserCourse.user_id
        ).filter_by(
            course_id=course_id,
            role_id=role_id,
            active=True
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
            UserCourse.role_id,
            UserCourse.active
        ).join(
            UserCourse,
            UserCourse.user_id==User.user_id
        ).filter_by(
            role_id=role_id,
            active=True
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

def get_users_by_team_id(team):
    try:
        return db.session.query(
            User
        ).join(
            TeamUser,
            User.user_id == TeamUser.user_id
        ).join(
            UserCourse,
            User.user_id == UserCourse.user_id
        ).filter(
            TeamUser.team_id == team.team_id,
            UserCourse.course_id == team.course_id,
            UserCourse.role_id == 5,
            UserCourse.active == True
        ).all()

    except SQLAlchemyError as e:
        error = e.__dict__['orig']
        return error

def get_users_not_in_team_id(team):
    try:
        return db.session.query(
            User
        ).join(
            UserCourse,
            User.user_id == UserCourse.user_id
        ).join(
            TeamUser,
            User.user_id == TeamUser.user_id,
            isouter=True
        ).filter(
            and_(
                UserCourse.course_id == team.course_id,
                and_(
                    and_(
                        or_(
                            TeamUser.team_id == None,
                            TeamUser.team_id != team.team_id
                        ),
                        UserCourse.role_id == 5
                    ),
                    UserCourse.active == True
                )
            )
        ).all()

    except SQLAlchemyError as e:
        error = e.__dict__['orig']
        return error
    
def get_team_members(user_id: int, course_id: int): 
    """
        Description:
        Returns all members of the team corresponding to a user 
        in a specific course. 

        Parameters:
        user_id: int: id of user
        course_id: int: id of course
    """
    try: 
        team_id = db.session.query(TeamUser.team_id).\
            join(Team, TeamUser.team_id == Team.team_id).\
            join(User, TeamUser.user_id == User.user_id).\
            filter(
                and_(
                    # Team.course_id == course_id, 
                    User.user_id == user_id
                )
            ).first()[0]
        
        if team_id is None: 
            return None

        team_members = db.session.query(
            User
        ).join(
            TeamUser, 
            TeamUser.user_id == User.user_id
        ).join( 
            UserCourse, 
            User.user_id == UserCourse.user_id
        ).filter(
            TeamUser.team_id == team_id
        ).all()

        return team_members
        
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e


def add_user_to_team(user_id, team_id):
    try:
        team_user = TeamUser.query.filter_by(
            user_id=user_id
        ).first()

        if team_user is None:
            return create_team_user({
                "user_id": user_id,
                "team_id": team_id
            })
        else:
            team_user.team_id = team_id
            db.session.commit()
            return team_user

    except SQLAlchemyError as e:
        error = e.__dict__['orig']
        return error

def remove_user_from_team(user_id, team_id):
    try:
        team_user = TeamUser.query.filter_by(
            user_id=user_id,
            team_id=team_id
        ).delete()
        db.session.commit()
        return team_user

    except SQLAlchemyError as e:
        error = e.__dict__['orig']
        return error
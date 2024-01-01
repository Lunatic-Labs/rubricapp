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
    """
        Description:
        Gets all the courses a user is in along with 
        their role and active status.

        Parameters:
        user_id: int: to user to look for 
    """
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
        logger.error(str(e.__dict__['orig']))
        raise e

def get_users_by_course_id(course_id):
    """
        Description:
        Gets lists of users in a course along with role and
        active information

        Parameters:
        course_id: int: course to retrieve from 
    """
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
        logger.error(str(e.__dict__['orig']))
        raise e

def get_users_by_course_id_and_role_id(course_id, role_id):
    """
        Description:
        Gets lists of users in a course who have a given role_id

        Parameters:
        course_id: int: course to look in
        role_id: int: role to look for 
    """
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
        logger.error(str(e.__dict__['orig']))
        raise e

def get_users_by_role_id(role_id):
    """
        Description:
        Gets a list of users who have have a role in any course.

        Parameters:
        role_id: int: role to look for 
    """
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
        logger.error(str(e.__dict__['orig']))
        raise e
    

def get_users_by_team_id(team):
    """
        Description:
        Gets all users in the same coure as a team that 
        are not on that team 

        Parameters:
        team: Team Object: team to get users not on 
    """
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
        logger.error(str(e.__dict__['orig']))
        raise e

def get_users_not_in_team_id(team):
    """
        Description:
        Gets all users in the same coure as a team that 
        are not on that team 

        Parameters:
        team: Team Object: team to get users not on 
    """
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
        logger.error(str(e.__dict__['orig']))
        raise e

def add_user_to_team(user_id, team_id):
    """
        Description:
        Adds a user from a team

        Parameters:
        user_id: int: id of user to adds 
        team_id: int: id of team to add user to
    """
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
        logger.error(str(e.__dict__['orig']))
        raise e

def remove_user_from_team(user_id, team_id):
    """
        Description:
        Removes a user from a team

        Parameters:
        user_id: id of user to remove 
        team_id: id of team to remove user from
    """
    try:
        team_user = TeamUser.query.filter_by(
            user_id=user_id,
            team_id=team_id
        ).delete()
        db.session.commit()
        return team_user

    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
    
def get_individual_ratings(assessment_task_id):
    """
        Description:
        Retrieves all students and their rating information for an individual assessment task

        Parameters:
        assessment_task_id: int: id of assessment task
    """
    try:
       return db.session.query(
           User.first_name,
           User.last_name,
           CompletedAssessment.rating_observable_characteristics_suggestions_data,
           Feedback.feedback_time,
           CompletedAssessment.last_update,
           Feedback.feedback_id
        ).join(
            User,
            CompletedAssessment.user_id == User.user_id
        ).join(
            Feedback,
            User.user_id == Feedback.user_id
            and
            CompletedAssessment.completed_assessment_id == Feedback.completed_assessment_id,
            isouter=True # allows to still get students who haven't viewed their feedback yet
        ).filter(
            and_(
                CompletedAssessment.team_id == None,
                CompletedAssessment.assessment_task_id == assessment_task_id
            )
        ).all()
    except SQLAlchemyError as e:
        logger.error(str(e.__dict__['orig']))
        raise e
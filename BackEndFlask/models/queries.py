from core import db
from models.utility import error_log
from models.schemas import *
from models.team_user import (
    create_team_user
)
from sqlalchemy import (
    and_,
    or_
)
@error_log
def get_courses_by_user_courses_by_user_id(user_id):
    """
        Description:
        Gets all courses the given user is enrolled in.

        Parameters:
        user_id: int (The id of a user)
    """
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


@error_log
def get_users_by_course_id(course_id):
    """
        Description:
        Gets all users in the given course with their role.

        Parameters:
        course_id: int (The id of a course)
    """
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

@error_log
def get_users_by_course_id_and_role_id(course_id, role_id):
    """
        Description:
        Gets all users with the given role in the given course.

        Parameters:
        course_id: int (The id of a course)
        role_id: int (The role of a user)
    """
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


@error_log
def get_users_by_role_id(role_id):
    """
        Description:
        Gets all users with the given role.

        Parameters:
        role_id: int (The role of a user)
    """
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

    
@error_log
def get_role_in_course(user_id: int, course_id: int):
    """
        Description:
        Gets the role of the given user in the given course.
        Returns None if the given user is not in the given course.

        Parameters:
        user_id: int (The id of a user)
        course_id: int (The id of a course)
    """ 
    role = db.session.query(Role).\
        join(UserCourse, UserCourse.role_id == Role.role_id).\
        join(User, UserCourse.user_id == User.user_id).\
        filter(
            and_(
                User.user_id == user_id, 
                UserCourse.course_id == course_id
            )
        ).first()
    
    return role
    
@error_log
def get_users_by_team_id(team):
    """
        Description:
        Gets all of the users assigned to the given team.
        Ensures that users are enrolled in the same
        course as the given team. 

        Parameters:
        team: Team SQLAlchemy Object (The object of a team)
    """
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


@error_log
def get_users_not_in_team_id(team):
    """
        Description:
        Gets all of the users not assigned to the given team.
        Ensures that users are enrolled in the same course
        as the given team.

        Parameters:
        team: Team SQLAlchemy Object (The object of a team)
    """
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

  
@error_log
def get_team_members(user_id: int, course_id: int): 
    """
        Description:
        Gets all of the team members in the team the given
        user is in. Ensures the team the given user is in
        is assigned to the given course.

        Returns a tuple: 
        - List of team members 
        - team_id

        Returns (None, None) on fail 

        Parameters:
        user_id: int (The id of a user)
        course_id: int (The id of a course)
    """
    team_id = db.session.query(TeamUser.team_id).\
        join(Team, TeamUser.team_id == Team.team_id).\
        join(User, TeamUser.user_id == User.user_id).\
        filter(
            and_(
                Team.course_id == course_id, 
                User.user_id == user_id
            )
        ).first()
    
    if team_id is None: 
        return None, None
    
    team_id = team_id[0]
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
    return team_members, team_id
        

@error_log
def add_user_to_team(user_id, team_id):
    """
        Description:
        Adds the given user to the given team.

        Parameters:
        user_id: int (The id of a user)
        team_id: int (The id of a team)
    """
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


@error_log
def remove_user_from_team(user_id, team_id):
    """
        Description:
        Removes the given user from the given team.

        Parameters:
        user_id: int (The id of a user)
        team_id: int (The id of a team)
    """
    team_user = TeamUser.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).delete()
    db.session.commit()
    return team_user


@error_log    
def get_individual_ratings(assessment_task_id):
    """
        Description:
        Gets all students and their rating information
        given the assessment task.

        Parameters:
        assessment_task_id: int (The id of an assessment task)
    """
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


@error_log
def get_all_checkins_for_student_for_course(user_id, course_id):
    """
        Description:
        Gets all of the assessment task ids the given user has
        already checked in. Ensures the assessment tasks are in
        the given course.
        
        Parameters:
        user_id: int (The id of a user)
        course_id: int (The id of a course)
    """
    assessment_task_ids = db.session.query(Checkin.assessment_task_id).\
        join(AssessmentTask, AssessmentTask.assessment_task_id == Checkin.assessment_task_id).\
        filter(
            and_(
                AssessmentTask.course_id == course_id),
                Checkin.user_id == user_id
    ).all()
    return [x[0] for x in assessment_task_ids]

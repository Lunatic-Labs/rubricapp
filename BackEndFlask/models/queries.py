from core import db
from models.utility import error_log
from models.schemas import *

from models.team_user import (
    create_team_user,
    replace_team_user
)

from models.user import (
    get_user
)

from models.utility import (
    email_students_feedback_is_ready_to_view
)

from models.completed_assessment import (
    get_completed_assessments_by_assessment_task_id
)

from models.assessment_task import (
    get_assessment_task
)

from models.team import (
    get_team
)

from sqlalchemy import (
    and_,
    or_,
    union
)

import sqlalchemy



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
        UserCourse.active.label("UserCourse_active")
    ).join(
        UserCourse,
        Course.course_id == UserCourse.course_id
    ).filter(
        and_(
            UserCourse.user_id == user_id,
            UserCourse.active == True
        )
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
    ).filter(
        UserCourse.course_id == course_id,
        UserCourse.active == True
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
    ).filter(
        UserCourse.course_id == course_id,
        UserCourse.role_id == role_id,
        UserCourse.active == True
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
    ).filter(
        UserCourse.role_id == role_id,
        UserCourse.active == True
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
def get_team_by_course_id_and_user_id(course_id, user_id):
    """
    Description:
    Gets the teams for the given user in the given course.
    Returns None if the given user is not in the given course.

    Parameters:
    user_id: int (The id of a user logged in)
    course_id: int (The id of a course)
    """
    teams = db.session.query(
        Team
    ).join(
        TeamUser, TeamUser.team_id == Team.team_id
    ).filter(
        and_(
            Team.course_id == course_id,
            TeamUser.user_id == user_id
        )
    ).all()

    return teams

@error_log
def get_team_by_course_id_and_observer_id(course_id, observer_id):
    """
    Description:
    Gets the teams for the given observer (primarily TA) in the given course.
    Returns None if the given observer is not in the given course.

    Parameters:
    observer_id: int (The id of a user (observer) logged in)
    course_id: int (The id of a course)
    """
    teams = db.session.query(
        Team
    ).join(
        TeamUser, TeamUser.team_id == Team.team_id
    ).filter(
        and_(
            Team.course_id == course_id,
            Team.observer_id == observer_id
        )
    ).all()

    return teams

@error_log
def get_students_by_team_id(course_id: int, team_id: int):
    """
    Description:
    Gets all of the users assigned to the given team.
    Ensures that users are enrolled in the same
    course as the given team.

    Parameters:
    course_id: int (The id of a course)
    team_id: int (The id of a team)
    """
    return db.session.query(
        User.user_id,
        User.first_name,
        User.last_name,
        User.email,
        Team.team_id,
        Team.team_name,
    ).join(
        UserCourse,
        User.user_id == UserCourse.user_id
    ).join(
        TeamUser,
        User.user_id == TeamUser.user_id
    ).join(
        Team,
        TeamUser.team_id == Team.team_id
    ).filter(
        and_(
            UserCourse.course_id == course_id,
            UserCourse.role_id == 5,
            TeamUser.team_id == team_id
        )
    ).all()


@error_log
def get_students_not_in_a_team(course_id: int, team_id: int):
    """
    Description:
    Gets all of the students not assigned to a team.
    Ensures that students are enrolled in the given course.

    Parameters:
    course_id: int (The id of a course)
    team_id: int (The id of a team)
    """
    all_students_not_in_a_team = db.session.query(
        User.user_id,
        User.first_name,
        User.last_name,
        User.email,
    ).join(
        UserCourse,
        User.user_id == UserCourse.user_id
    ).filter(
        and_(
            UserCourse.course_id == course_id,
            UserCourse.role_id == 5,
            UserCourse.user_id.notin_(
                db.session.query(
                    TeamUser.user_id
                ).join(
                    Team,
                    Team.team_id == TeamUser.team_id
                ).filter(
                    Team.course_id == course_id
                )
            )
        )
    ).all()

    all_students_in_other_teams = db.session.query(
        User.user_id,
        User.first_name,
        User.last_name,
        User.email,
        Team.team_id,
        Team.team_name,
    ).join(
        UserCourse,
        User.user_id == UserCourse.user_id
    ).filter(
        and_(
            UserCourse.course_id == course_id,
            UserCourse.role_id == 5,
        )
    ).join(
        TeamUser,
        TeamUser.user_id == UserCourse.user_id
    ).filter(
        TeamUser.team_id != team_id
    ).join(
        Team,
        Team.team_id == TeamUser.team_id
    ).filter(
        Team.course_id == course_id
    ).all()

    sorted_list = sorted(
        all_students_not_in_a_team + all_students_in_other_teams
    )

    return sorted_list

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
def get_team_members_in_course(course_id: int): 
    """
    Description:
    Gets all of the team members in the teams in the course. 

    Returns a two dimensional list of team members with their team id: 
    - List of team members 
    - team_id

    Returns None on fail 

    Parameters:
    course_id: int (The id of a course)
    """
    
    name_list = []
    team_list = []
    for (team_id,) in db.session.query(Team.team_id).filter_by(course_id=course_id).all():
        for (team_member,) in db.session.query(
            User.last_name
        ).join(
            TeamUser, 
            TeamUser.user_id == User.user_id
        ).filter(
            TeamUser.team_id == team_id
        ).all():
            name_list.append(team_member)
        
        team_list.append([name_list, team_id])
        name_list = []
    
    return team_list


@error_log
def add_user_to_team(course_id: int, user_id: int, team_id: int):
    """
    Description:
    Adds the given user to the given team.
    Ensures that only teams are pulled from
    the same course as the target team.
    Or updates the current team the user
    is assigned to the new given team.

    Parameters:
    course_id: int (The id of a course)
    user_id: int (The id of a user)
    team_id: int (The id of a team)
    """
    team_user = db.session.query(
        TeamUser
    ).join(
        Team,
        Team.team_id == TeamUser.team_id
    ).filter(
        and_(
            Team.course_id == course_id,
            TeamUser.user_id == user_id,
        )
    ).first()

    team_user_json = {
        "team_id": team_id,
        "user_id": user_id
    }

    if team_user == None:
        return create_team_user(team_user_json)

    return replace_team_user(
        team_user_json,
        team_user.team_user_id
    )


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


@error_log
def get_rubrics_and_total_categories(user_id):
    """
    Description:
    Gets all of the default and custom rubrics with
    corresponding total categories for the given user
    logged in.

    Parameters:
    user_id: int (The id of a user)
    """
    user = get_user(user_id)

    all_rubrics_and_total_categories = db.session.query(
        Rubric.rubric_id,
        Rubric.rubric_name,
        Rubric.rubric_description,
        sqlalchemy.func.count(Category.category_id).label('category_total')
    ).join(
        RubricCategory, Rubric.rubric_id == RubricCategory.rubric_id
    ).join(
        Category, RubricCategory.category_id == Category.category_id
    ).filter(
        or_(
            Rubric.owner == 1,
            or_(
                Rubric.owner == user_id,
                Rubric.owner == user.owner_id
            )
        )
    ).group_by(
        Rubric.rubric_id
    ).all()
    
    return all_rubrics_and_total_categories


@error_log
def get_rubrics_and_total_categories_for_user_id(user_id, get_all=False):
    """
    Description:
    Gets all of the custom rubrics with
    corresponding total categories for the given user
    logged in. Optionally, if get_all is true, then
    the default rubrics are also returned.

    Parameters:
    user_id: int (The id of a user)
    get_all: bool (Whether to get default rubrics with custom rubrics)
    """
    all_rubrics_and_total_categories = db.session.query(
        Rubric.rubric_id,
        Rubric.rubric_name,
        Rubric.rubric_description,
        sqlalchemy.func.count(Category.category_id).label('category_total')
    ).join(
        RubricCategory, Rubric.rubric_id == RubricCategory.rubric_id
    ).join(
        Category, RubricCategory.category_id == Category.category_id
    )

    if get_all:
        all_rubrics_and_total_categories = all_rubrics_and_total_categories.filter(
            or_(
                Rubric.owner == 1,
                Rubric.owner == user_id
            )
        )

    else:
        all_rubrics_and_total_categories = all_rubrics_and_total_categories.filter(
            Rubric.owner == user_id
        )

    all_rubrics_and_total_categories = all_rubrics_and_total_categories.group_by(
        Rubric.rubric_id
    ).all()

    return all_rubrics_and_total_categories


@error_log
def get_categories_for_user_id(user_id):
    """
    Description:
    Gets all of the categories for the
    custom rubrics owned by the given
    user logged in.

    Parameters:
    user_id = int (The id of a user)
    """
    all_custom_category_ids = db.session.query(
        Category.category_id,
        Category.category_name,
        Category.description,
        Category.rating_json,
        Rubric.rubric_id,
        Rubric.rubric_name,
        Rubric.owner,
    ).join(
        RubricCategory,
        RubricCategory.category_id == Category.category_id
    ).join(
        Rubric,
        Rubric.rubric_id == RubricCategory.rubric_id
    ).filter(
        Rubric.owner == user_id
    ).subquery()

    all_default_categories = db.session.query(
        Category.category_id,
        Rubric.rubric_name
    ).join(
        RubricCategory,
        RubricCategory.category_id == Category.category_id
    ).join(
        Rubric,
        Rubric.rubric_id == RubricCategory.rubric_id
    ).filter(
        Rubric.owner == 1,
    ).subquery()

    combined = db.session.query(
        all_custom_category_ids,
        all_default_categories.c.rubric_name.label("default_rubric"),
    ).outerjoin(
        all_default_categories,
        all_default_categories.c.category_id == all_custom_category_ids.c.category_id
    ).all()

    return combined


@error_log
def send_teams_and_students_email_to_view_completed_assessment_feedback(assessment_task_id):
    """
    Description:
    Sends an email to assigned teams and students
    of only marked done completed assessments
    made for the given assessment.

    Parameters:
    assessment_task_id: int (The id of an assessment task)
    """
    one_assessment_task = get_assessment_task(assessment_task_id)

    all_completed=get_completed_assessments_by_assessment_task_id(assessment_task_id)

    for completed in all_completed:
        if completed.team_id is not None and completed.done:
            email_students_feedback_is_ready_to_view(
                get_students_by_team_id(
                    one_assessment_task.course_id, 
                    get_team(completed.team_id)
                )
            )


@error_log
def get_all_checkins_for_assessment(assessment_task_id):
    """
    Description:
    Gets all of the students checked in for the
    given assessment task.

    Parameters:
    assessment_task_id: int (The id of an assessment task)
    """
    checkins=db.session.query(
        Checkin
    ).filter(
        Checkin.assessment_task_id == assessment_task_id,
    ).all()

    return checkins


@error_log
def get_completed_assessment_with_team_name(assessment_task_id):
    """
    Description:
    Gets all of the completed assessments with team names
    for the given assessment task.

    Parameters: 
    assessment_task_id: int (The id of an assessment task)
    """
    complete_assessments=db.session.query(
        CompletedAssessment.completed_assessment_id,
        CompletedAssessment.assessment_task_id,
        CompletedAssessment.team_id,
        CompletedAssessment.user_id,
        CompletedAssessment.completed_by,
        CompletedAssessment.initial_time,
        CompletedAssessment.last_update,
        CompletedAssessment.rating_observable_characteristics_suggestions_data,
        CompletedAssessment.done,
        Team.team_name
    ).join(
        Team, Team.team_id == CompletedAssessment.team_id
    ). filter(
        CompletedAssessment.assessment_task_id == assessment_task_id,
    ).all()

    return complete_assessments

@error_log
def get_completed_assessment_with_user_name(assessment_task_id):
    """
    Description:
    Gets all of the completed assessments with user names
    for the given assessment task.

    Parameters: 
    assessment_task_id: int (The id of an assessment task)
    """
    complete_assessments=db.session.query(
        CompletedAssessment.completed_assessment_id,
        CompletedAssessment.assessment_task_id,
        CompletedAssessment.team_id,
        CompletedAssessment.user_id,
        CompletedAssessment.completed_by,
        CompletedAssessment.initial_time,
        CompletedAssessment.last_update,
        CompletedAssessment.rating_observable_characteristics_suggestions_data,
        CompletedAssessment.done,
        User.first_name,
        User.last_name
    ).join(
        User, User.user_id == CompletedAssessment.user_id
    ). filter(
        CompletedAssessment.assessment_task_id == assessment_task_id,
    ).all()

    return complete_assessments

@error_log
def get_assessment_task_by_course_id_and_role_id(course_id, role_id):
    """
    Description:
    Gets all of the assessment tasks for
    the given course and filtered by the
    given role id.

    Parameters:
    course_id: int (The id of a course)
    role_id: int (The id of a role)
    """
    all_assessment_tasks = db.session.query(
        AssessmentTask
    ).filter(
        and_(
            AssessmentTask.course_id == course_id,
            AssessmentTask.role_id == role_id,
        )
    ).all()

    return all_assessment_tasks

@error_log
def get_completed_assessment_by_user_id(course_id, user_id):
    """
    Description:
    Gets all of the completed assessments by
    the given user in the given course.

    Parameters: 
    user_id: int (The id of the current logged student user)
    course_id: int (The id of given course)
    """

    complete_assessments_team = db.session.query(
        CompletedAssessment.completed_assessment_id,
        CompletedAssessment.assessment_task_id,
        CompletedAssessment.team_id,
        CompletedAssessment.user_id,
        CompletedAssessment.completed_by,
        CompletedAssessment.initial_time,
        CompletedAssessment.last_update,
        CompletedAssessment.rating_observable_characteristics_suggestions_data,
        CompletedAssessment.done,
        AssessmentTask.assessment_task_name,
        AssessmentTask.rubric_id,
        AssessmentTask.unit_of_assessment
    ).join(
        AssessmentTask,
        AssessmentTask.assessment_task_id == CompletedAssessment.assessment_task_id
    ).filter(
        AssessmentTask.course_id == course_id
    ).join(
        TeamUser,
        CompletedAssessment.team_id == TeamUser.team_id and TeamUser.user_id == user_id  
    )

    complete_assessments_ind = db.session.query(
        CompletedAssessment.completed_assessment_id,
        CompletedAssessment.assessment_task_id,
        CompletedAssessment.team_id,
        CompletedAssessment.user_id,
        CompletedAssessment.completed_by,
        CompletedAssessment.initial_time,
        CompletedAssessment.last_update,
        CompletedAssessment.rating_observable_characteristics_suggestions_data,
        CompletedAssessment.done,
        AssessmentTask.assessment_task_name,
        AssessmentTask.rubric_id,
        AssessmentTask.unit_of_assessment
    ).join(
        AssessmentTask,
        AssessmentTask.assessment_task_id == CompletedAssessment.assessment_task_id
    ).filter(
        CompletedAssessment.user_id == user_id,
    )

    complete_assessments = complete_assessments_team.union(complete_assessments_ind)

    return complete_assessments

@error_log
def get_completed_assessment_by_ta_user_id(course_id, user_id):
    """
    Description:
    Gets all of the completed assessments by
    the given user in the given course.

    Parameters: 
    user_id: int (The id of the current logged student user)
    course_id: int (The id of given course)
    """
    complete_assessments = db.session.query(
        CompletedAssessment.completed_assessment_id,
        CompletedAssessment.assessment_task_id,
        CompletedAssessment.team_id,
        CompletedAssessment.user_id,
        CompletedAssessment.completed_by,
        CompletedAssessment.initial_time,
        CompletedAssessment.last_update,
        CompletedAssessment.rating_observable_characteristics_suggestions_data,
        CompletedAssessment.done,
        AssessmentTask.assessment_task_name,
        AssessmentTask.rubric_id,
        AssessmentTask.unit_of_assessment
    ).filter(
        CompletedAssessment.completed_by == user_id,
    ).join(
        AssessmentTask,
        AssessmentTask.assessment_task_id == CompletedAssessment.assessment_task_id
    ).filter(
        AssessmentTask.course_id == course_id
    ).all()

    return complete_assessments


@error_log
def get_csv_data_by_at_id(at_id: int) -> list[dict[str]]:
    """
    Description:
    Returns the needed info for the csv file creator function.
    See queries.py createCsv() for further info.

    Parameters:
    at_id: int (The id of an assessment task)

    Return:
    list[dict][str]
    """

    """
    Note that the current plan sqlite3 seems to execute is:
        QUERY PLAN
    |--SCAN CompletedAssessment
    |--SEARCH AssessmentTask USING INTEGER PRIMARY KEY (rowid=?)
    |--SEARCH Role USING INTEGER PRIMARY KEY (rowid=?)
    |--SEARCH Team USING INTEGER PRIMARY KEY (rowid=?)
    `--SEARCH User USING INTEGER PRIMARY KEY (rowid=?)
    Untested but assume other tables are also runing a search instead of a scan
    everywhere where there is no index to scan by.
    The problem lies in the search the others are doing. Future speed optimications
    can be reached by implementing composite indices.
    """
    pertinent_assessments = db.session.query(
        AssessmentTask.assessment_task_name,
        AssessmentTask.unit_of_assessment,
        AssessmentTask.rubric_id,
        Rubric.rubric_name,
        Role.role_name,
        Team.team_name,
        User.first_name,
        User.last_name,
        CompletedAssessment.last_update,
        Feedback.feedback_time,
        AssessmentTask.notification_sent,
        CompletedAssessment.rating_observable_characteristics_suggestions_data
    ).join(
        Role,
        AssessmentTask.role_id == Role.role_id,
    ).join(
        CompletedAssessment,
        AssessmentTask.assessment_task_id == CompletedAssessment.assessment_task_id
    ).outerjoin(
        Team,
        CompletedAssessment.team_id == Team.team_id
    ).join(
        User,
        CompletedAssessment.user_id == User.user_id
    ).join(
        Rubric,
        AssessmentTask.rubric_id == Rubric.rubric_id
    ).outerjoin(
        Feedback,
        and_(
            CompletedAssessment.completed_assessment_id == Feedback.completed_assessment_id,
            CompletedAssessment.user_id == Feedback.user_id
        )
    ).filter(
        AssessmentTask.assessment_task_id == at_id
    ).all()

    return pertinent_assessments


def get_csv_categories(rubric_id: int) -> tuple[dict[str],dict[str]]:
    """
    Description:
    Returns the sfi and the oc data to fill out the csv file.
    
    Parameters:
    rubric_id : int (The id of a rubric)

    Return: tuple two  Dict [Dict] [str] (All of the sfi and oc data)
    """

    """
    Note that a better choice would be to create a trigger, command, or virtual table
    for performance reasons later down the road. The decision depends on how the
    database evolves from now.
    """
    sfi_data = db.session.query(
        RubricCategory.rubric_id,
        SuggestionsForImprovement.suggestion_text
    ).join(
        Category,
        Category.category_id == RubricCategory.rubric_category_id
    ).outerjoin(
        SuggestionsForImprovement,
        Category.category_id == SuggestionsForImprovement.category_id
    ).filter(
        RubricCategory.rubric_id == rubric_id
    ).order_by(
        RubricCategory.rubric_id
    ).all()

    oc_data = db.session.query(
        RubricCategory.rubric_id,
        ObservableCharacteristic.observable_characteristic_text
    ).join(
        Category,
        Category.category_id == RubricCategory.rubric_category_id
    ).outerjoin(
        ObservableCharacteristic,
        Category.category_id == ObservableCharacteristic.category_id
    ).filter(
        RubricCategory.rubric_id == rubric_id
    ).order_by(
        RubricCategory.rubric_id
    ).all()

    return sfi_data,oc_data
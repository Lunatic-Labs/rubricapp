from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import TeamCourse
from models.team import update_team_status

class InvalidTCID(Exception):
    "Raised when tc_id does not exist!!!"
    pass

class InvalidCourseID(Exception):
    "Raised when course_id does not exist!!!"
    pass

def get_team_courses():
    try:
        return TeamCourse.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_team_courses_by_course_id(course_id):
    try:
        return TeamCourse.query.filter_by(course_id=course_id).all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def get_team_course(tc_id):
    try:
        one_team_course_course = TeamCourse.query.filter_by(tc_id=tc_id).first()
        if one_team_course_course is None:
            raise InvalidTCID
        return one_team_course_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTCID:
        error = "Invalid tc_id, tc_id does not exist!"
        return error
 
def create_team_course(teamcourse):
    try:
        new_team_id = teamcourse["team_id"]
        new_course_id = teamcourse["course_id"]
        new_team_course = TeamCourse(
            team_id=new_team_id,
            course_id=new_course_id
        )
        db.session.add(new_team_course)
        db.session.commit()
        return new_team_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def deactivate_teams_in_course(course_id):
    try:
        team_courses = TeamCourse.query.filter_by(course_id=course_id).all()
        teams = []
        if team_courses is None:
            raise InvalidCourseID
        for team_course in team_courses:
            update_team_status(team_course.team_id, False)
            teams.append(team_course.team_id)
        db.session.commit()
        return teams
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCourseID:
        error = "Invalid course_id, course_id does not exist!"
        return error

def load_demo_team_course():
    for team_id in range(1, 4):
        create_team_course({
            "team_id": team_id,
            "course_id": 1
        })
    
def replace_team_course(teamcourse, tc_id):
    try:
        one_team_course_course = TeamCourse.query.filter_by(tc_id=tc_id).first()
        if one_team_course_course is None:
            raise InvalidTCID
        one_team_course_course.team_id = teamcourse["team_id"]
        one_team_course_course.course_id = teamcourse["course_id"]
        db.session.commit()
        return one_team_course_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTCID:
        error = "Invalid tc_id, tc_id does not exist!"
        return error

"""
Delete is meant for the summer semester!!!
"""
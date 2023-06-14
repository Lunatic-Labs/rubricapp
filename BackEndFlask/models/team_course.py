from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import TeamCourse

class InvalidTeamCourseID(Exception):
    "Raised when team_course_id does not exist!!!"
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
    
def get_team_course(team_course_id):
    try:
        one_team_course = TeamCourse.query.filter_by(team_course_id=team_course_id).first()
        if one_team_course is None:
            raise InvalidTeamCourseID
        return one_team_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamCourseID:
        error = "Invalid team_course_id, team_course_id does not exist!"
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

def load_demo_team_course():
    for team_id in range(1, 4):
        create_team_course({
            "team_id": team_id,
            "course_id": 1
        })
    
def replace_team_course(teamcourse, team_course_id):
    try:
        one_team_course = TeamCourse.query.filter_by(team_course_id=team_course_id).first()
        if one_team_course is None:
            raise InvalidTeamCourseID
        one_team_course.team_id = teamcourse["team_id"]
        one_team_course.course_id = teamcourse["course_id"]
        db.session.commit()
        return one_team_course
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidTeamCourseID:
        error = "Invalid team_course_id, team_course_id does not exist!"
        return error

def delete_team_course(team_course_id):
    try:
        TeamCourse.query.filter_by(team_course_id=team_course_id).delete()
        db.session.commit()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
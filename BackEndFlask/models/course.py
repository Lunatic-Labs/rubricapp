from core import db
from models.schemas import Course
from models.utility import error_log 

class InvalidCourseID(Exception):
    def __init__(self, id):
        self.message = f"Invalid course_id {id}"

    def __str__(self):
        return self.message


@error_log
def get_courses():
    return Course.query.all()


@error_log
def get_course(course_id):
    return Course.query.filter_by(course_id=course_id).first()


@error_log
def get_course_use_tas(course_id):
    return Course.query.filter_by(course_id=course_id).first()


@error_log
def get_courses_by_admin_id(admin_id):
    return Course.query.filter_by(admin_id=admin_id).all()


@error_log
def create_course(course_data):
    course_data = Course(
        course_number=course_data["course_number"],
        course_name=course_data["course_name"],
        year=course_data["year"],
        term=course_data["term"],
        active=course_data["active"],
        admin_id=course_data["admin_id"],
        use_tas=course_data["use_tas"],
        use_fixed_teams=course_data["use_fixed_teams"]
    )
    db.session.add(course_data)
    db.session.commit()
    return course_data


def load_demo_course():
    listOfCourseNames = [
        # course_id: 1
        {
            "course_number": "CS3523",
            "course_name": "Operating Systems",
            "term": "Spring",
            "use_tas": True,
            "use_fixed_teams": True
        },
        # course_id: 2
        {
            "course_number": "IT2233",
            "course_name": "User Interface Design",
            "term": "Fall",
            "use_tas": False,
            "use_fixed_teams": False
        },
        # course_id: 3
        {
            "course_number": "MA1314",
            "course_name": "Calculus",
            "term": "Summer",
            "use_tas": True,
            "use_fixed_teams": False
        },
        # course_id: 4
        {
            "course_number": "PH2414",
            "course_name": "Physics 1",
            "term": "Spring",
            "use_tas": False,
            "use_fixed_teams": True
        },
    ]
    for course in listOfCourseNames:
        create_course({
            "course_number": course["course_number"],
            "course_name": course["course_name"],
            "year": 2023,
            "term": course["term"],
            "active": True,
            "admin_id": 2,
            "use_tas": course["use_tas"],
            "use_fixed_teams": course["use_fixed_teams"]
        })

@error_log
def replace_course(course_data, course_id):
    one_course = Course.query.filter_by(course_id=course_id).first()
    if one_course is None:
        return InvalidCourseID.error
    one_course.course_number = course_data["course_number"]
    one_course.course_name = course_data["course_name"]
    one_course.year = course_data["year"]
    one_course.term = course_data["term"]
    one_course.active = course_data["active"]
    one_course.admin_id = course_data["admin_id"]
    one_course.use_tas = course_data["use_tas"]
    one_course.use_fixed_teams = course_data["use_fixed_teams"]
    db.session.commit()
    return one_course


@error_log
def delete_course(course_id):
    deleted_course = Course.query.filter_by(course_id=course_id).first()
    if deleted_course is None:
        raise InvalidCourseID(course_id)
    Course.query.filter_by(course_id=course_id).delete()
    db.session.commit()
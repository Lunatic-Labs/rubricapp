from core import db
from models.schemas import AssessmentTask, Team
from datetime import datetime
from models.utility import error_log
from models.checkin import delete_checkins_over_team_count, delete_latest_checkins_over_team_size

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class InvalidAssessmentTaskID(Exception):
    def __init__(self, id):
        self.message = f"Invalid Assessment Task ID: {id}."

    def __str__(self):
        return self.message

class InvalidNumberOfTeams(Exception):
    def __init__(self):
        self.message = "Number of teams must be a greater than 0."

    def __str__(self):
        return self.message

class InvalidMaxTeamSize(Exception):
    def __init__(self):
        self.message = "Number of people on a team must be greater than 0."

    def __str__(self):
        return self.message

def validate_number_of_teams(number_of_teams):
    if number_of_teams is not None:
        try:
            number = int(number_of_teams)
            if number <= 0:
                raise InvalidNumberOfTeams()
        except ValueError:
                raise InvalidNumberOfTeams()

def validate_max_team_size(max_team_size):
    if max_team_size is not None:
        try:
            number = int(max_team_size)
            if number <= 0:
                raise InvalidMaxTeamSize()
        except ValueError:
            raise InvalidMaxTeamSize()

@error_log
def get_assessment_tasks():
    return AssessmentTask.query.all()

@error_log
def get_assessment_tasks_by_course_id(course_id):
    return AssessmentTask.query.filter_by(course_id=course_id).all() # query completed assesment tasks

@error_log
def get_assessment_tasks_by_role_id(role_id):
    return AssessmentTask.query.filter_by(role_id=role_id).all()

@error_log
def get_assessment_tasks_by_team_id(team_id):
    db.session.query(AssessmentTask).join(Team, AssessmentTask.course_id == Team.course_id).filter(
            Team.team_id == team_id
            and
            (
                (AssessmentTask.due_date >= Team.date_created and Team.active_until is None)
                or
                (AssessmentTask.due_date >= Team.date_created and AssessmentTask.due_date <= Team.active_until)
            )
        ).all()
@error_log
def get_assessment_task(assessment_task_id):
    one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()

    if one_assessment_task is None:
        raise InvalidAssessmentTaskID(assessment_task_id)

    return one_assessment_task

@error_log
def create_assessment_task(assessment_task):
    if "." not in assessment_task["due_date"]:
        assessment_task["due_date"] = assessment_task["due_date"] + ".000"

    if "Z" not in assessment_task["due_date"]:
        assessment_task["due_date"] = assessment_task["due_date"] + "Z"

    validate_number_of_teams(assessment_task["number_of_teams"])
    validate_max_team_size(assessment_task["max_team_size"])

    new_assessment_task = AssessmentTask(
        assessment_task_name=assessment_task["assessment_task_name"],
        course_id=assessment_task["course_id"],
        rubric_id=assessment_task["rubric_id"],
        role_id=assessment_task["role_id"],
        due_date=datetime.strptime(assessment_task["due_date"], '%Y-%m-%dT%H:%M:%S.%fZ'),
        time_zone=assessment_task["time_zone"],
        show_suggestions=assessment_task["show_suggestions"],
        locked=False,
        published=True,
        show_ratings=assessment_task["show_ratings"],
        unit_of_assessment=assessment_task["unit_of_assessment"],
        create_team_password=assessment_task["create_team_password"],
        comment=assessment_task["comment"],
        number_of_teams=assessment_task["number_of_teams"],
        max_team_size=assessment_task["max_team_size"],
        notification_sent=None,
    )

    db.session.add(new_assessment_task)
    db.session.commit()

    return new_assessment_task

def load_demo_admin_assessment_task():
    list_of_assessment_tasks = [
        {    # Assessment Task 1
            "assessment_task_name": "Critical Thinking Assessment",
            "comment": "An example comment",
            "create_team_password": "at_cta",
            "due_date": "2027-04-24T08:30:00",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 1,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "EST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {    # Assessment Task 2
            "assessment_task_name": "Formal Communication Assessment",
            "comment": None,
            "create_team_password": "at_fca",
            "due_date": "2023-03-03T13:00:00",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 2,
            "show_ratings": True,
            "show_suggestions": False,
            "time_zone": "EST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {      # Assessment Task 3
            "assessment_task_name": "Information Processing Assessment",
            "comment": None,
            "create_team_password": "at_ipa",
            "due_date": "2027-02-14T08:00:00",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 5,
            "rubric_id": 3,
            "show_ratings": False,
            "show_suggestions": True,
            "time_zone": "EST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 4
            "assessment_task_name": "Interpersonal Communication",
            "comment": None,
            "create_team_password": "at_ic",
            "due_date": "2025-03-05T09:30:00",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 5,
            "rubric_id": 4,
            "show_ratings": False,
            "show_suggestions": False,
            "time_zone": "EST",
            "unit_of_assessment": False,
            "locked": True,
            "published": True,
        },
        {   # Assessment Task 5
            "assessment_task_name": "Management Assessment",
            "comment": None,
            "create_team_password": "at_ma",
            "due_date": "2023-05-29T13:20:00",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 5,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "EST",
            "unit_of_assessment": True,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 6
            "assessment_task_name": "Problem Solving Assessment",
            "comment": None,
            "create_team_password": "at_psa",
            "due_date": "2023-02-13T10:00:00",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 5,
            "rubric_id": 6,
            "show_ratings": False,
            "show_suggestions": False,
            "time_zone": "EST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 7
            "assessment_task_name": "Teamwork Assessment",
            "comment": None,
            "create_team_password": "at_ta",
            "due_date": "2023-01-09T09:30:00",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 5,
            "rubric_id": 1,
            "show_ratings": False,
            "show_suggestions": True,
            "time_zone": "EST",
            "unit_of_assessment": True,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 8
            "assessment_task_name": "Critical Thinking Assessment 2",
            "comment": "sadfasdfasdfasdfasdfasdfasdfasdfasdf",
            "create_team_password": "",
            "due_date": "2024-01-30T21:00:24",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 1,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "CST",
            "unit_of_assessment": True,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 9
            "assessment_task_name": "AAAAAAAAAAAA",
            "comment": "t",
            "create_team_password": "",
            "due_date": "2024-01-28T21:25:20.216000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 2,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "EST",
            "unit_of_assessment": True,
            "locked": False,
            "published": True,
        },
        {  # Assessment Task 10
            "assessment_task_name": "CCCCCCCCCCCCC",
            "comment": "asdasdassdasdasd",
            "create_team_password": "",
            "due_date": "2024-01-30T15:10:18.708000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 2,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "PST",
            "unit_of_assessment": True,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 11
            "assessment_task_name": "DDDDDDDDDDDDDD",
            "comment": "s",
            "create_team_password": "",
            "due_date": "2024-01-30T15:12:16.247000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 7,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "PST",
            "unit_of_assessment": True,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 12
            "assessment_task_name": "Student 1",
            "comment": "Henry",
            "create_team_password": "",
            "due_date": "2024-02-05T17:01:10.164000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 5,
            "rubric_id": 6,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "EST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 13
            "assessment_task_name": "Student 2 Individ",
            "comment": "asdfasdfasdf",
            "create_team_password": "",
            "due_date": "2024-02-05T17:06:49.746000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 5,
            "rubric_id": 6,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "PST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 14
            "assessment_task_name": "UI 1",
            "comment": "sdfgsdfgsdfg",
            "create_team_password": "",
            "due_date": "2024-02-05T17:09:44.900000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 3,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "PST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 15
            "assessment_task_name": "UI 2",
            "comment": "wertwertwertwertwert",
            "create_team_password": "asdf",
            "due_date": "2024-02-05T17:10:06.960000",
            "number_of_teams": 7,
            "max_team_size": 4,
            "role_id": 4,
            "rubric_id": 4,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "PST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 16
            "assessment_task_name": "Calc 1",
            "comment": "xcvbxcvbxcvbxcvbxcvb",
            "create_team_password": "",
            "due_date": "2024-02-05T17:10:48.660000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 1,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "PST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 17
            "assessment_task_name": "Calc 2",
            "comment": "vbmvbmvbnm",
            "create_team_password": "",
            "due_date": "2024-02-05T17:11:05.896000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 2,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "PST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 18
            "assessment_task_name": "Phys 1",
            "comment": "tyiutyuityiu",
            "create_team_password": "",
            "due_date": "2024-02-05T17:11:26.842000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 5,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "MST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
        {   # Assessment Task 19
            "assessment_task_name": "Phys 2",
            "comment": "zxcvzxcvzxcv",
            "create_team_password": "",
            "due_date": "2024-02-05T17:11:44.486000",
            "number_of_teams": None,
            "max_team_size": None,
            "role_id": 4,
            "rubric_id": 3,
            "show_ratings": True,
            "show_suggestions": True,
            "time_zone": "MST",
            "unit_of_assessment": False,
            "locked": False,
            "published": True,
        },
    ]

    for assessment in list_of_assessment_tasks:
        create_assessment_task({
            "assessment_task_name": assessment["assessment_task_name"],
            "course_id": 1,
            "due_date": assessment["due_date"],
            "time_zone": assessment["time_zone"],
            "rubric_id": assessment["rubric_id"],
            "role_id": assessment["role_id"],
            "show_suggestions": assessment["show_suggestions"],
            "locked": assessment["locked"],
            "published": assessment["published"],
            "show_ratings": assessment["show_ratings"],
            "unit_of_assessment": assessment["unit_of_assessment"],
            "create_team_password": assessment["create_team_password"],
            "comment": assessment["comment"],
            "number_of_teams": assessment["number_of_teams"],
            "max_team_size": assessment["max_team_size"],
        })

@error_log
def replace_assessment_task(assessment_task, assessment_task_id):
    if "." not in assessment_task["due_date"]:
        assessment_task["due_date"] = assessment_task["due_date"] + ".000"

    if "Z" not in assessment_task["due_date"]:
        assessment_task["due_date"] = assessment_task["due_date"] + "Z"

    validate_number_of_teams(assessment_task["number_of_teams"])
    validate_max_team_size(assessment_task["max_team_size"])

    one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()

    if one_assessment_task is None:
        raise InvalidAssessmentTaskID(assessment_task_id)

    # Kick all members from ad hoc teams beyond new team count if there are now fewer teams
    if assessment_task["number_of_teams"] is not None and one_assessment_task.number_of_teams > int(assessment_task["number_of_teams"]):
        delete_checkins_over_team_count(assessment_task_id, int(assessment_task["number_of_teams"]))
    
    # Kick all members from ad hoc teams with too many members if there is now a smaller capacity
    if assessment_task["max_team_size"] is not None and one_assessment_task.max_team_size > int(assessment_task["max_team_size"]):
        delete_latest_checkins_over_team_size(assessment_task_id, int(assessment_task["max_team_size"]))

    one_assessment_task.assessment_task_name = assessment_task["assessment_task_name"]
    one_assessment_task.course_id = assessment_task["course_id"]
    one_assessment_task.due_date=datetime.strptime(assessment_task["due_date"], '%Y-%m-%dT%H:%M:%S.%fZ')
    one_assessment_task.time_zone = assessment_task["time_zone"]
    one_assessment_task.rubric_id = assessment_task["rubric_id"]
    one_assessment_task.role_id = assessment_task["role_id"]
    one_assessment_task.show_suggestions = assessment_task["show_suggestions"]
    one_assessment_task.show_ratings = assessment_task["show_ratings"]
    one_assessment_task.unit_of_assessment = assessment_task["unit_of_assessment"]
    one_assessment_task.create_team_password = assessment_task["create_team_password"]
    one_assessment_task.comment = assessment_task["comment"]
    one_assessment_task.number_of_teams = assessment_task["number_of_teams"]
    one_assessment_task.max_team_size = assessment_task["max_team_size"]
    
    db.session.commit()

    return one_assessment_task

@error_log
def toggle_notification_sent_to_true(assessment_task_id, date):
    one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()

    one_assessment_task.notification_sent = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ')

    db.session.commit()

    return one_assessment_task

@error_log
def toggle_lock_status(assessment_task_id):
    one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()
    one_assessment_task.locked = not one_assessment_task.locked
    db.session.commit()
    return one_assessment_task

@error_log
def toggle_published_status(assessment_task_id):
    one_assessment_task = AssessmentTask.query.filter_by(assessment_task_id=assessment_task_id).first()
    one_assessment_task.published = not one_assessment_task.published
    db.session.commit()
    return one_assessment_task

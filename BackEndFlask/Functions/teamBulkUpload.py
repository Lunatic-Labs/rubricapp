#!/bin/python3
# from models.schemas import User, Team, UserCourse
from enum import Enum
import csv

filepath = "./input.csv"

# class Team(db.Model):
#     __tablename__ = "Team"
#     __table_args__ = {'sqlite_autoincrement': True}
#     team_id = db.Column(db.Integer, primary_key=True)
#     team_name = db.Column(db.String(25), nullable=False)
#     course_id = db.Column(db.Integer, ForeignKey(Course.course_id), nullable=False)
#     observer_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
#     date_created = db.Column(db.Date, nullable=False)
#     active_until = db.Column(db.Date, nullable=True)

# class User(db.Model):
#     __tablename__ = "User"
#     __table_args__ = {'sqlite_autoincrement': True}
#     user_id = db.Column(db.Integer, primary_key=True)
#     first_name = db.Column(db.String(30), nullable=False)
#     last_name = db.Column(db.String(30), nullable=False)
#     email = db.Column(db.String(255), unique=True, nullable=False)
#     password = db.Column(db.String(80), nullable=False)
#     role_id = db.Column(db.Integer, ForeignKey(Role.role_id),nullable=False)
#     lms_id = db.Column(db.Integer, nullable=True)
#     consent = db.Column(db.Boolean, nullable=True)
#     owner_id = db.Column(db.Integer, ForeignKey(user_id), nullable=True)

# class UserCourse(db.Model):
#     __tablename__ = "UserCourse"
#     __table_arges__ = {'sqlite_autoincrement': True}
#     user_course_id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
#     course_id = db.Column(db.Integer, ForeignKey(Course.course_id), nullable=False)
#     role_id = db.Column(db.Integer, ForeignKey(Role.role_id), nullable=False)

# ta_email@gmail.com
# "team name 1"
# "lname1, fname1", teststudent1@gmail.com,
# "lname2, fname2", teststudent2@gmail.com, 10002
# "lname3, fname3", teststudent3@gmail.com,
#
# other_ta_email@gmail.com
# "team name 2"
# "lname1, fname1", teststudent1@gmail.com, 10001
# "lname2, fname2", teststudent2@gmail.com,
# "lname3, fname3", teststudent3@gmail.com, 10003
# "team name 3"
# "lname1, fname1", teststudent1@gmail.com, 10001
# "lname2, fname2", teststudent2@gmail.com, 10002
# "lname3, fname3", teststudent3@gmail.com,


class Student:
    def __init__(self, fname: str, lname: str, email: str, lms_id: None|str = None) -> None:
        self.fname = fname
        self.lname = lname
        self.email = email
        self.lms_id = lms_id


class TA:
    def __init__(self, email: str) -> None:
        self.email = email
        self.students = []


    def add_student(self, student: Student) -> None:
        self.students.append(student)


class Team:
    def __init__(self, name: str, ta: TA) -> None:
        self.name = name
        self.ta = ta


filepath = "/home/zdh/dev/rubricapp/BackEndFlask/Functions/sample_files/addStudentsAndAssignTeams-files/s-add-multiple-teams.csv"


class LineType(Enum):
    Err = 0,
    TaEmail = 1,
    TeamName = 2,
    Student = 3,
    StudentLMS = 4,


STUDENTS: list[Student] = []
TEAMS: list[Team] = []
TAS: list[TA] = []
TEAMS: list[Team] = []


def __bulk_upload_teams(linetype: LineType, data: list[str], owner_id: int, course_id: int):
    global STUDENTS, TEAMS, TAS, TEAMS

    match linetype:
        case LineType.TaEmail:
            ta = TA(data[0])
            TAS.append(ta)
        case LineType.TeamName:
            current_ta = TAS[-1]
            name = data[0]
            TEAMS.append(Team(name, current_ta))
        case LineType.Student:
            lname, fname = data[0].split(',').strip()
            email = data[1]
            student = Student(fname, lname, email)
            STUDENTS.append(student)
            current_ta = TAS[-1]
            current_ta.add_student(student)
        case LineType.StudentLMS:
            lname, fname = data[0].split(',').strip()
            email = data[1]
            lms_id = data[2]
            student = Student(fname, lname, email, lms_id)
            STUDENTS.append(student)
            current_ta = TAS[-1]
            current_ta.add_student(student)
        case _:
            assert False, "UNREACHABLE"


def bulk_upload_teams(filepath: str, owner_id: int, course_id: int) -> None|str:
    global STUDENTS, TEAMS
    STUDENTS = []
    TEAMS = []
    TAS = []
    TEAMS = []

    try:
        if not filepath.endswith('.csv') and not filepath.endswith('.xlsx'):
            return WrongExtension.error

        with open(filepath, 'r') as file:
            csvr = csv.reader(file)
            next_ta: bool = True
            for row in csvr:
                row: list[str] = [x.strip() for x in row]
                print(row)
                if next_ta:
                    __bulk_upload_teams(LineType.TaEmail, owner_id, course_id)
                    next_ta = False
                    continue
                match len(row):
                    case 0:
                        next_ta = True
                    case 1:
                        __bulk_upload_teams(LineType.TeamName, owner_id, course_id)
                    case 2:
                        __bulk_upload_teams(LineType.Student, owner_id, course_id)
                    case 3:
                        __bulk_upload_teams(LineType.StudentLMS, owner_id, course_id)
                    case _:
                        assert False, "INVALID"

    except Exception as e:
        raise e


bulk_upload_teams(filepath, 1, 1)



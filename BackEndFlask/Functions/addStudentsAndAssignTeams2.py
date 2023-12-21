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
# "lname1, fname1", teststudent1@gmail.com, 10001
# "lname2, fname2", teststudent2@gmail.com, 10002
# "lname3, fname3", teststudent3@gmail.com, 10003
#
# other_ta_email@gmail.com
# "team name 2"
# "lname1, fname1", teststudent1@gmail.com, 10001
# "lname2, fname2", teststudent2@gmail.com, 10002
# "lname3, fname3", teststudent3@gmail.com, 10003
# "team name 3"
# "lname1, fname1", teststudent1@gmail.com, 10001
# "lname2, fname2", teststudent2@gmail.com, 10002
# "lname3, fname3", teststudent3@gmail.com, 10003

filepath = "/home/zdh/dev/rubricapp/BackEndFlask/Functions/sample_files/addStudentsAndAssignTeams-files/s-add-multiple-teams.csv"


class LineType(Enum):
    Err = 0,
    TaEmail = 1,
    TeamName = 2,
    Student = 3,
    StudentLMS = 4,


def __bulk_upload_teams(linetype: LineType):
    pass


def bulk_upload_teams(filepath: str, owner_id: int, course_id: int) -> None|str:
    if not filepath.endswith('.csv') and not filepath.endswith('.xlsx'):
        return WrongExtension.error

    users: list[User] = []
    user_courses: list[UserCourse] = []
    teams: list[Team] = []

    # String of the current ta assigned
    # to the 
    ta: str = ""

    with open(filepath, 'r') as file:
        csvr = csv.reader(file)
        for row in csvr:
            row: list[str] = [x.strip() for x in row]

            if len(row) == 0:
                __bulk_upload_teams(LineType.TaEmail)
            elif len(row) == 1:
                __bulk_upload_teams(LineType.TeamName)
            print(row[0])


bulk_upload_teams(filepath, 1, 1)



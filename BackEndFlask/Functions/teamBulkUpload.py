#!/bin/python3
from Functions.helper import helper_verify_email_syntax, helper_create_user
from Functions.customExceptions import *
from models.user import *
from models.team import *
from models.team_user import *
from models.user_course import *
from models.course import *

from datetime import date
import csv


class TBUStudent:
    def __init__(self, fname: str, lname: str, email: str, lms_id: None|str = None) -> None:
        self.fname = fname
        self.lname = lname
        self.email = email
        self.lms_id = lms_id


class TBUTeam:
    def __init__(self, name: str, ta_email: str, students: list[TBUStudent]) -> None:
        self.name = name
        self.ta_email = ta_email
        self.students = students


def __expect(lst: list[list[str]], cols: int | None = None) -> list[str]:
    hd: list[str] = lst.pop(0)
    if cols is not None and len(hd) != cols:
        assert False, f'len(list[list[str]])[0] does not match cols expected. Namely: {len(hd)} =/= {cols}'
    return hd


def __parse(lst: list[list[str]]) -> list[TBUTeam]:
    teams: list[TBUTeam] = []
    students: list[TBUStudent] = []
    ta: str = ""
    team_name: str = ""
    newline: bool = True

    while True:
        if len(lst) == 0:
            break

        hd = __expect(lst)

        # Decide on what to do base on the num of columns.
        match len(hd):
            # Newline, add current info to a team.
            case 0:
                teams.append(TBUTeam(team_name, ta, students))
                students = []
                newline = True

            # Either TA email or a team name.
            case 1:
                # TA email (because of newline)
                if newline:
                    newline = False
                    ta = hd[0]
                    hd = __expect(lst, 1)  # Expect a team name.
                    team_name = hd[0]

                # Team name, use the previous TA email for the next team.
                else:
                    teams.append(TBUTeam(team_name, ta, students))
                    students = []
                    team_name = hd[0]

            # Student with either an LMS ID or not.
            case 2 | 3:
                lname, fname = hd[0].split(',')
                lname.strip()
                fname.strip()
                email = hd[1]
                lms_id = None if len(hd) == 2 else hd[2]
                students.append(TBUStudent(fname, lname, email, lms_id))

            # Too many columns expected.
            case _:
                raise TooManyColumns

    # If there is no newline at EOF...
    if len(students) > 0:
        teams.append(TBUTeam(team_name, ta, students))

    return teams


def __create_team(team: TBUTeam, owner_id: int, course_id: int) -> None:
    team_name: str = team.name
    ta_email: str = team.ta_email
    students: list[TBUStudent] = team.students

    def __handle_ta():
        course_uses_tas: bool = get_course_use_tas(course_id)
        missing_ta = False
        ta_id = None

        if course_uses_tas:
            ta = get_user_by_email(ta_email)
            if ta is None:
                raise UserDoesNotExist

            # missing_ta: bool = ta.role_id == 5
            missing_ta = False
            ta_id = get_user_user_id_by_email(ta_email)
            ta_course = get_user_course_by_user_id_and_course_id(ta_id, course_id)

        else:
            user = get_user(owner_id)
            if user is None:
                raise UserDoesNotExist

            course = get_course(course_id)
            courses = get_courses_by_admin_id(owner_id)

            course_found: bool = False
            for admin_course in courses:
                if course is admin_course:
                    course_found = True
                    break

            if not course_found:
                raise OwnerIDDidNotCreateTheCourse

        return (ta_id, missing_ta, course_uses_tas)


    def __handle_student(student: TBUStudent, team_name: str, tainfo):
        team = get_team_by_team_name_and_course_id(team_name, course_id)
        team_id = None

        ta_id = tainfo[0]
        missing_ta = tainfo[1]
        course_uses_tas = tainfo[2]

        if team is None:
            team = create_team({
                "team_name": team_name,
                "observer_id": (lambda: owner_id, lambda: (lambda: ta_id, lambda: owner_id)[missing_ta]())[course_uses_tas](),
                "date_created": str(date.today().strftime("%m/%d/%Y")),
                "course_id": course_id
            })

        team_id = team.team_id
        user = get_user_by_email(student.email)

        if user is None:
            lms_id = None if student.lms_id is None else int(student.lms_id)
            helper_create_user(student.fname, student.lname, student.email, 5, lms_id, owner_id)

        user_id = get_user_user_id_by_email(student.email)
        user_course = get_user_course_by_user_id_and_course_id(user_id, course_id)

        if user_course is None:
            # user_id = get_user_user_id_by_email(student.email)
            create_user_course({
                "user_id": user_id,
                "course_id": course_id,
                "role_id": 5,
            })

        create_team_user({
            "team_id": team_id,
            "user_id": user_id
        })


    tainfo = __handle_ta()
    for student in students:
        __handle_student(student, team_name, tainfo)


def __verify_emails(teams: list[TBUTeam]):
    for team in teams:
        if not helper_verify_email_syntax(team.ta_email):
            raise SuspectedMisformatting
        for student in team.students:
            if not helper_verify_email_syntax(student.email):
                raise SuspectedMisformatting


def __debug_dump(teams: list[TBUTeam]):
    for team in teams:
        print(f'TA: {team.ta_email}')
        print(f'Name: {team.name}')
        for student in team.students:
            print(f'    {student.fname} {student.lname} {student.email} {student.lms_id}')


def team_bulk_upload(filepath: str, owner_id: int, course_id: int):
    try:
        xlsx: bool = filepath.endswith('.xlsx')
        if not filepath.endswith('.csv') and not xlsx:
            raise WrongExtension

        if xlsx:
            filepath = xlsx_to_csv(filepath)

        with open(filepath, 'r') as file:
            csvr = csv.reader(file)
            # Gather rows and strip each entry in each row.
            rows: list[list[str]] = [list(map(str.strip, row)) for row in csvr]

        # Gather teams and verify the correctness of all emails.
        teams = __parse(rows)
        __verify_emails(teams)

        # Actually add people to the DB.
        for team in teams:
            __create_team(team, owner_id, course_id)

    except Exception as e:
        raise e

# TODO CHECKS:
#   - ',' in names.
# fp = "./sample_files/addStudentsAndAssignTeams-files/s-add-multiple-teams.csv"
# team_bulk_upload(fp, 1, 1)

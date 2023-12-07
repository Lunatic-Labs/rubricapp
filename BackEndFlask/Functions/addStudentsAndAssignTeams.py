from typing import List

from Functions.helper import helper_ok, helper_verify_email_syntax, helper_cleanup, helper_create_user
from Functions.customExceptions import *
from Functions.test_files.population_functions import xlsx_to_csv
from models.user import *
from models.team import *
from models.team_user import *
from models.user_course import *
from models.course import *
from sqlalchemy import *
from core import db
from datetime import date
import csv

def __uncommit_changes(new_user_ids=None, new_user_course_ids=None, new_team_id=None):
    # Delete users and teams if needed
    if new_student_ids is not None:
        for user in new_student_ids:
            delete_user(user)
    if new_team_id is not None:
        delete_team(new_team_id)

    # Delete course_user if needed
    if new_user_course_ids is not None:
        for user_course in new_user_course_ids:
            delete_user_course(user_course)

    if new_team_id is not None:
        delete_team(new_team_id)


def student_and_team_to_db(roster_file: str, owner_id: int, course_id: int):
    """ 
    Description:
        Takes a roster file of students that are either pesent or not in the DB.
        and creates a team based on the roster file.
        If the user is not present, then they are created and added to the DB.
    Parameters:
        roster_file (str): The file path to the roster file.
        owner_id (int): The user_id of the user that is adding the students.
        course_id (int): The course_id of the course that the students are being added to.
    Returns:
        None: If the roster file was successfully added to the DB.
        str: If an error from SQLalchemy was raised. It contains the error msg.
    """
    if not roster_file.endswith('.csv') and not roster_file.endswith('.xlsx'):
        return WrongExtension.error

    # Determine if file is .xlsx.
    is_xlsx = roster_file.endswith('.xlsx')
    if is_xlsx:
        roster_file = xlsx_to_csv(roster_file)

    cleanup_arr = [roster_file, is_xlsx, None]

    try:
        student_and_team_csv = open(roster_file, mode='r', encoding='utf-8-sig')
    except FileNotFoundError:
        return helper_cleanup(cleanup_arr, FileNotFound.error)

    csv_reader = csv.reader(student_and_team_csv)
    roster = []
    cleanup_arr[2] = student_and_team_csv

    new_student_ids: List[int] = []
    new_user_course_ids: List[int] = []
    new_team_id: int = None

    # Build up the roster with the format of:
    # [[team_name, ta_email], ["lname1, fname1", email1, lms_id1], ["lname2, fname2", email2, lms_id2], ...]
    header_row = next(csv_reader)
    if len(header_row) < 2:
        return helper_cleanup(cleanup_arr, NotEnoughColumns.error, new_student_ids=new_student_ids, new_team_id=new_team_id)
    if len(header_row) > 2:
        return helper_cleanup(cleanup_arr, TooManyColumns.error, new_student_ids=new_student_ids, new_team_id=new_team_id)

    team_name, ta = header_row[:2]
    roster.append([team_name, ta])

    print(f"TEAM NAME: {team_name}")
    print(f"TA: {ta}")

    for row in csv_reader:
        # Remove leading/trailing whitespaces
        person_attribs = [p.strip() for p in row]
        roster.append(person_attribs)

    ta_info = roster[0]
    team_name = ta_info[0]
    ta_email = ta_info[1]
    missing_ta = False

    teams = get_team_by_team_name_and_course_id(team_name, course_id)
    if not helper_ok(teams):
        return helper_cleanup(cleanup_arr, teams, new_student_ids=new_student_ids, new_team_id=new_team_id)
    if teams is not None:
        assert False and "team is already present in the db"

    # NOTE: this will appereantly be deprecated.
    if teams is not None:
        for team in teams:
            deactivated_team = deactivate_team(team.team_id)
            if not helper_ok(deactivated_team):
                return helper_cleanup(cleanup_arr, deactivated_team, new_student_ids=new_student_ids, new_team_id=new_team_id)

    course_uses_tas = get_course_use_tas(course_id)
    if not helper_ok(course_uses_tas):
        return helper_cleanup(cleanup_arr, course_uses_tas, new_student_ids=new_student_ids, new_team_id=new_team_id)
    
    if not helper_verify_email_syntax(ta_email):
        return helper_cleanup(cleanup_arr, SuspectedMisformatting.error, new_student_ids=new_student_ids, new_team_id=new_team_id)
    print(f"Verified email syntax: {ta_email}")

    if course_uses_tas:
        ta_user = get_user_by_email(ta_email)
        if not helper_ok(ta_user):
            return helper_cleanup(cleanup_arr, ta_user, new_student_ids=new_student_ids, new_team_id=new_team_id)

        if ta_user is None:  # The TA is not present.
            return helper_cleanup(cleanup_arr, UserDoesNotExist.error, new_student_ids=new_student_ids, new_team_id=new_team_id)

        missing_ta = ta_user.role_id == 5
        ta_user_id = get_user_user_id_by_email(ta_email)
        if not helper_ok(ta_user_id):
            return helper_cleanup(cleanup_arr, ta_user_id, new_student_ids=new_student_ids, new_team_id=new_team_id)

        ta_course = get_user_course_by_user_id_and_course_id(ta_user_id, course_id)
        if not helper_ok(ta_course):
            return helper_cleanup(cleanup_arr, ta_course, new_student_ids=new_student_ids, new_team_id=new_team_id)

        # if ta_course is None:
        #     return helper_cleanup(cleanup_arr, TANotYetAddedToCourse.error, new_student_ids=new_student_ids, new_team_id=new_team_id)
    else:
        user = get_user(owner_id)
        if not helper_ok(user):
            return helper_cleanup(cleanup_arr, user, new_student_ids=new_student_ids, new_team_id=new_team_id)

        if user is None:
            return helper_cleanup(cleanup_arr, UserDoesNotExist.error, new_student_ids=new_student_ids, new_team_id=new_team_id)

        course = get_course(course_id)
        if not helper_ok(course):
            return helper_cleanup(cleanup_arr, course, new_student_ids=new_student_ids, new_team_id=new_team_id)

        courses = get_courses_by_admin_id(owner_id)
        if not helper_ok(courses):
            return helper_cleanup(cleanup_arr, courses, new_student_ids=new_student_ids, new_team_id=new_team_id)

        course_found = False
        for admin_course in courses:
            if course is admin_course:
                course_found = True
                break
        if not course_found:
            return helper_cleanup(cleanup_arr, OwnerIDDidNotCreateTheCourse.error, new_student_ids=new_student_ids, new_team_id=new_team_id)

    # Begin handling students.
    print("Handling students")

    for student_info in roster[1:]:
        # [[team_name, ta_email], ["lname1, fname1", email1, lms_id1], ["lname2, fname2", email2, lms_id2], ...]
        if len(student_info) == 1:
            # not enough columns
            return helper_cleanup(cleanup_arr, NotEnoughColumns.error, new_student_ids=new_student_ids, new_team_id=new_team_id)
        elif len(student_info) > 3:
            # too many columns
            return helper_cleanup(cleanup_arr, TooManyColumns.error, new_student_ids=new_student_ids, new_team_id=new_team_id)

        name = student_info[0].strip()  # FN,LN
        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()
        email = student_info[1].strip()
        lms_id = student_info[2]

        print(f"  NAME: {name}")
        print(f"  LAST NAME: {last_name}")
        print(f"  FIRST NAME: {first_name}")
        print(f"  EMAIL: {email}")
        print(f"  LMS ID: {lms_id}")

        team = get_team_by_team_name_and_course_id(team_name, course_id)
        if not helper_ok(team):
            return helper_cleanup(cleanup_arr, team, new_student_ids=new_student_ids, new_team_id=new_)
        
        print(f"  TEAM: {team}")

        if team is None:
            print("  Creating team")
            # Create the team
            new_team = create_team({
                "team_name": team_name,
                "observer_id": (lambda: owner_id, lambda: (lambda: ta_user_id, lambda: owner_id)[missing_ta]())[course_uses_tas](),
                "date_created": str(date.today().strftime("%m/%d/%Y")),
                "course_id" : course_id
            })

        if not helper_ok(new_team):
            return helper_cleanup(cleanup_arr, new_team, new_student_ids=new_student_ids, new_team_id=new_team_id)
        new_team_id = new_team.team_id

        print(f"  NEW TEAM: {new_team}")
        print(f"  NEW TEAM ID: {new_team_id}")

        # Create/add existing students to new team
        if not helper_verify_email_syntax(email):
            return helper_cleanup(cleanup_arr, SuspectedMisformatting.error, new_student_ids=new_student_ids, new_team_id=new_team_id)

        print(f"  Verified email syntax: {email}")

        user = get_user_by_email(email)
        if not helper_ok(user):
            return helper_cleanup(cleanup_arr, user, new_student_ids=new_student_ids, new_team_id=new_team_id)
        
        print(f"  USER: {user}")

        if user is None:
            user = helper_create_user(first_name, last_name, email, 4, lms_id, owner_id)
            if not helper_ok(user):
                return helper_cleanup(cleanup_arr, user, new_student_ids=new_student_ids, new_team_id=new_team_id)
        new_student_ids.append(user.user_id)
        print(f"  NEW STUDENT ID: {user.user_id}")

        user_id = get_user_user_id_by_email(email)
        if not helper_ok(user_id):
            return helper_cleanup(cleanup_arr, user_id, new_student_ids=new_student_ids, new_team_id=new_team_id)
        print(f"  USER ID: {user_id}")

        user_course = get_user_course_by_user_id_and_course_id(user_id, course_id)
        if not helper_ok(user_course):
            return helper_cleanup(cleanup_arr, user_course, new_student_ids=new_student_ids, new_team_id=new_team_id)

        # TODO: Create the user_course.
        if user_course is None:
            print("  Creating user_course")
            return helper_cleanup(cleanup_arr, user_course, new_student_ids=new_student_ids, new_team_id=new_team_id)
            # user_id = get_user_user_id_by_email(email)
            # user_course = create_user_course({
            #     "user_id": user_id,
            #     "course_id": course_id,
            #     "role_id": 5,
            # })
            # if not helper_ok(user_course):
            #     return helper_cleanup(cleanup_arr, user_course, new_student_ids=new_student_ids, new_team_id=new_team_id)
        # new_user_course_ids.append(user_course.user_course_id)

        print(f"  USER COURSE: {user_course}")

        # Add TA to team
        # TODO: Remove team user on failure.
        if course_uses_tas:
            print(f"Course uses TAs. Adding TA to team.")
            ta_team_user = create_team_user({
                "team_id": team.team_id,
                "user_id": ta_user_id
            })
            if not helper_ok(ta_team_user):
                return helper_cleanup(cleanup_arr, ta_team_user, new_student_ids=new_student_ids, new_team_id=new_team_id)
            print(f"TA TEAM USER RESULT: {ta_team_user}")

        # Add the new/existing student to team
        # TODO: Remove team user on failure.
        team_user = create_team_user({
            "team_id": team.team_id,
            "user_id": user_id
        })
        if not helper_ok(team_user):
            return helper_cleanup(cleanup_arr, team_user, new_student_ids=new_student_ids, new_team_id=new_team_id)
        print(f"TEAM USER RESULT: {team_user}")

    print("Finished adding students and teams to DB")
    return helper_cleanup(cleanup_arr, None)

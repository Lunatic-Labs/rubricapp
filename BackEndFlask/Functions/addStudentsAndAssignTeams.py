from Functions.helper import helper_verify_email_syntax, helper_cleanup, helper_create_user
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

def __uncommit_changes(
        new_user_ids: list[int],
        new_user_courses: list[int],
        new_team_id: int,
        course_id: int) -> None:

    """
    Description:
    Gets called when an error occurs when reading the roster file or something
    went wrong with the database transaction. When called, it will delete all
    the new users, user_courses, and team_users that were created.

    Parameters:
    new_user_ids:    list[int]: A list of user_ids that were created.
    new_user_course: list[int]: A list of *user_ids* that were created.
    new_team_id:     int:       The team_id that was created.

    Returns:
    None
    """

    for user in new_user_ids:
        if user is not None:
            print(f"Deleting user: {user}")
            result = delete_user(user)
            if result is str:
                assert False, "delete_user() failed"
            print(f"Deleting team_use: {user}")
            result = delete_team_user_by_user_id_and_team_id(user, new_team_id)
            if result is str:
                assert False, "delete_team_user_by_user_id_and_team_id() failed"

    for user_course in new_user_courses:
        if user_course is not None:
            print(f"Deleting user_course: {user_course}")
            result = delete_user_course_by_user_id_course_id(user_course, course_id)
            if result is str:
                assert False, "delete_user_course_by_use_id_course_id() failed"

    if new_team_id is not None:
        print(f"Deleting team: {new_team_id}")
        result = delete_team(new_team_id)
        if result is str:
            assert False, "delete_team() failed"
    db.session.commit()


def student_and_team_to_db(roster_file: str, owner_id: int, course_id: int) -> None|str:

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
    is_xlsx: bool = roster_file.endswith('.xlsx')
    if is_xlsx:
        roster_file = xlsx_to_csv(roster_file)

    cleanup_arr: list[any] = [roster_file, is_xlsx, None]

    try:
        student_and_team_csv: TextIO = open(roster_file, mode='r', encoding='utf-8-sig')
    except FileNotFoundError:
        return helper_cleanup(cleanup_arr, FileNotFound.error)

    csv_reader: csv.reader = csv.reader(student_and_team_csv)
    roster: list[tuple[str, str]] = []
    cleanup_arr[2] = student_and_team_csv

    new_team_user_ids: list[int] = []
    new_team_id: int = None
    new_user_course_ids: list[int] = []
    new_student_ids: list[int] = []

    # Build up the roster with the format of:
    # [[team_name, ta_email], ["lname1, fname1", email1, lms_id1], ["lname2, fname2", email2, lms_id2], ...]
    header_row: list[str] = next(csv_reader)
    if len(header_row) < 2:
        __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
        return helper_cleanup(cleanup_arr, NotEnoughColumns.error)
    if len(header_row) > 2:
        __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
        return helper_cleanup(cleanup_arr, TooManyColumns.error)

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

    course_uses_tas = get_course_use_tas(course_id)
    if isinstance(course_uses_tas, str):
        __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
        return helper_cleanup(cleanup_arr, course_uses_tas)

    if not helper_verify_email_syntax(ta_email):
        __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
        return helper_cleanup(cleanup_arr, SuspectedMisformatting.error)
    print(f"Verified email syntax: {ta_email}")

    if course_uses_tas:
        ta_user = get_user_by_email(ta_email)
        if isinstance(ta_user, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, ta_user)

        if ta_user is None:  # The TA is not present.
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, UserDoesNotExist.error)

        missing_ta = ta_user.role_id == 5
        ta_user_id = get_user_user_id_by_email(ta_email)
        if isinstance(ta_user_id, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, ta_user_id)

        ta_course = get_user_course_by_user_id_and_course_id(ta_user_id, course_id)
        if isinstance(ta_course, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, ta_course)

        # if ta_course is None:
        #     return helper_cleanup(cleanup_arr, TANotYetAddedToCourse.error, new_student_ids=new_student_ids, new_team_id=new_team_id, new_team_user_ids=new_team_user_ids, new_user_course_ids=new_user_course_ids)
    else:
        user = get_user(owner_id)
        if isinstance(user, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, user)

        if user is None:
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, UserDoesNotExist.error)

        course = get_course(course_id)
        if isinstance(course, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, course)

        courses = get_courses_by_admin_id(owner_id)
        if isinstance(courses, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, courses)

        course_found = False
        for admin_course in courses:
            if course is admin_course:
                course_found = True
                break
        if not course_found:
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, OwnerIDDidNotCreateTheCourse.error)

    # Begin handling students.
    print("Handling students")

    for student_info in roster[1:]:
        print("NOW... next student")
        # [[team_name, ta_email], ["lname1, fname1", email1, lms_id1], ["lname2, fname2", email2, lms_id2], ...]
        if len(student_info) == 1:
            # not enough columns
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, NotEnoughColumns.error)
        elif len(student_info) > 3:
            # too many columns
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, TooManyColumns.error)

        name = student_info[0].strip()  # FN,LN
        if "," not in name:
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, SuspectedMisformatting.error)

        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()
        email = student_info[1].strip()
        lms_id = None if len(student_info) != 3 else student_info[2].strip()

        print(f"  NAME: {name}")
        print(f"  LAST NAME: {last_name}")
        print(f"  FIRST NAME: {first_name}")
        print(f"  EMAIL: {email}")
        print(f"  LMS ID: {lms_id}")

        team = get_team_by_team_name_and_course_id(team_name, course_id)
        if isinstance(team, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, team)
        team_id = None

        if team is None:
            print("  Creating team")
            team = create_team({
                "team_name": team_name,
                "observer_id": (lambda: owner_id, lambda: (lambda: ta_user_id, lambda: owner_id)[missing_ta]())[course_uses_tas](),
                "date_created": str(date.today().strftime("%m/%d/%Y")),
                "course_id" : course_id
            })
            if isinstance(team, str):
                __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
                return helper_cleanup(cleanup_arr, team)
            team_id = team.team_id
            new_team_id = team_id
        else:
            print(f"  Team {team} already exists")
            team_id = team.team_id

        # Create/add existing students to new team
        if not helper_verify_email_syntax(email):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, SuspectedMisformatting.error)

        print(f"  Verified email syntax: {email}")

        user = get_user_by_email(email)
        if isinstance(user, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, user)

        if user is None:
            print("  Creating user")
            user = helper_create_user(first_name, last_name, email, 4, lms_id, owner_id)
            if isinstance(user, str):
                __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
                return helper_cleanup(cleanup_arr, user)
            new_student_ids.append(user.user_id)
        print(f"  USER: {user}")

        user_id = get_user_user_id_by_email(email)
        if isinstance(user_id, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, user_id)

        user_course = get_user_course_by_user_id_and_course_id(user_id, course_id)
        if isinstance(user_course, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, user_course)

        # TODO: Create the user_course.
        if user_course is None:
            print("  Creating user_course")
            user_id = get_user_user_id_by_email(email)
            user_course = create_user_course({
                "user_id": user_id,
                "course_id": course_id,
                "role_id": 5,
            })
            if isinstance(user_course, str):
                __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
                return helper_cleanup(cleanup_arr, user_course)
            new_user_course_ids.append(user_id)

        print(f"  USER COURSE: {user_course}")

        team_user = create_team_user({
            "team_id": team_id,
            "user_id": user_id
        })
        if isinstance(team_user, str):
            __uncommit_changes(new_student_ids, new_user_course_ids, new_team_id, course_id)
            return helper_cleanup(cleanup_arr, team_user)
        print(f"TEAM USER RESULT: {team_user}")
        new_team_user_ids.append(team_user)

    print("Finished adding students and teams to DB")
    return helper_cleanup(cleanup_arr, None)
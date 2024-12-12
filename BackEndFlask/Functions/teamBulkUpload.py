from Functions.helper import helper_verify_email_syntax, helper_create_user
from Functions.customExceptions import *
from models.user import *
from models.team import *
from models.team_user import *
from models.user_course import *
from models.course import *
from models.queries import does_team_user_exist
from Functions.test_files.PopulationFunctions import xlsx_to_csv

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
    """
    Description:
    Determines if the columns in the head of the list
    matches the expected `cols`. It will then pop off
    that head element and return it back. This, in turn,
    will modify the original list passed.
    """
    hd: list[str] = lst.pop(0)
 
    # Clean the row - specifically handle 'Unnamed:' columns and empty strings
    cleaned = []
    for x in hd:
        stripped = x.strip()
        if stripped and not stripped.startswith('Unnamed:'):
            cleaned.append(stripped)

    if cols is not None and len(cleaned) != cols:
        raise TooManyColumns(1, cols, len(cleaned))
    return cleaned

def __parse(lst: list[list[str]]) -> list[TBUTeam]:
    teams: list[TBUTeam] = []
    students: list[TBUStudent] = []
    ta: str = ""
    team_name: str = ""
    current_row = 0
    
    # State to track what type of row we expect next
    EXPECT_TA = 0
    EXPECT_TEAM = 1
    EXPECT_STUDENT = 2
    current_state = EXPECT_TA
    
    while len(lst) > 0:
        hd = __expect(lst)
        current_row += 1
        
        # Skip empty rows, they signal end of current team
        if not hd:
            if len(students) > 0:
                if ta == "" or team_name == "":
                    raise EmptyTeamName if team_name == "" else EmptyTAEmail
                teams.append(TBUTeam(team_name, ta, students))
                students = []

                multiple_observers = True
                if len(lst) > 2:
                    hd = __expect(lst)
                    lookAhead = __expect(lst)
                    lst.insert(0, lookAhead)
                    lst.insert(0, hd)   
                    multiple_observers = len(hd) == len(lookAhead) == 1

                current_state = EXPECT_TA if multiple_observers else EXPECT_TEAM 
            continue

        # Process based on what type of row we're expecting
        if current_state == EXPECT_TA:
            if len(hd) != 1:
                raise TooManyColumns(current_row, 1, len(hd))
            ta = hd[0]
            current_state = EXPECT_TEAM
            
        elif current_state == EXPECT_TEAM:
            if len(hd) != 1:
                raise TooManyColumns(current_row, 1, len(hd))
            team_name = hd[0]
            current_state = EXPECT_STUDENT
            
        elif current_state == EXPECT_STUDENT:
            # Student row should have 2 or 3 columns
            if len(hd) > 3:
                raise TooManyColumns(current_row, 3, len(hd))
            elif len(hd) < 2:
                raise NotEnoughColumns(current_row, 2, len(hd))
            
            try:
                lname, fname = hd[0].split(',')
                fname = fname.strip()
                lname = lname.strip()
                email = hd[1]
                lms_id = None if len(hd) == 2 else hd[2]
                students.append(TBUStudent(fname, lname, email, lms_id))
            except ValueError:
                raise InvalidNameFormat(current_row, hd[0])

    # Handle the last team if there are students
    if len(students) > 0:
        if ta == "" or team_name == "":
            raise EmptyTeamName if team_name == "" else EmptyTAEmail
        teams.append(TBUTeam(team_name, ta, students))

    if len(teams) == 0:
        raise EmptyTeamMembers

    return teams


def __update_existing_student_info(stored_student, new_student):
    nfname = new_student.fname
    nlname = new_student.lname
    nlms_id = new_student.lms_id

    sfname = stored_student.first_name
    slname = stored_student.last_name
    slms_id = stored_student.lms_id

    if sfname != nfname:
        sfname = nfname
    if slname != nlname:
        slname = nlname
    if slms_id != nlms_id:
        slms_id = nlms_id

    user_data = {
        "first_name": sfname,
        "last_name": slname,
        "lms_id": slms_id,
        "email": stored_student.email,
        "password": stored_student.password,
        "consent": stored_student.consent,
        "owner_id": stored_student.owner_id,
    }

    replace_user(user_data, stored_student.user_id)


def __create_team(team: TBUTeam, owner_id: int, course_id: int):
    """
    Description:
    Creates a team and adds the TA and students to the team.

    Parameters:
    team: TBUTeam: The team to create.
    owner_id: int: The owner_id of the user creating the team.
    course_id: int: The course_id of the course the team is in.

    Returns:
    None
    """
    team_name: str = team.name
    ta_email: str = team.ta_email
    students: list[TBUStudent] = team.students

    def __handle_ta():
        """
        Description:
        Handles the creation of a TA.

        Parameters:
        None

        Returns:
        (int, bool, bool): The ta_id, missing_ta, and course_uses_tas.
        """
        course_uses_tas: bool = get_course_use_tas(course_id)
        missing_ta = False
        ta_id = None

        if course_uses_tas:
            ta = get_user_by_email(ta_email)
            if ta is None:
                raise UserDoesNotExist(ta_email)

            missing_ta = False
            ta_id = get_user_user_id_by_email(ta_email)
            # Raise an error if the ta is not enrolled.
            get_user_course_by_user_id_and_course_id(ta_id, course_id)

        else:
            user = get_user(owner_id)
            if user is None:
                raise UserDoesNotExist(owner_id)  

            course = get_course(course_id)
            courses = get_courses_by_admin_id(owner_id)

            course_found: bool = False
            for admin_course in courses:
                if course is admin_course:
                    course_found = True
                    break

            if not course_found:
                raise OwnerIDDidNotCreateTheCourse(owner_id, course_id)

        return (ta_id, missing_ta, course_uses_tas)


    def __handle_student(student: TBUStudent, team_name: str, tainfo):
        """
        Description:
        Handles the creation of a student. If the student does not exist,
        then it will create a new user. If the student does not have a
        user_course, then it will create a new user_course. Finally, it
        will create a new team_user.

        Parameters:
        student: TBUStudent: The student to create.
        team_name: str: The team name to create.

        Returns:
        None
        """
        team = get_team_by_team_name_and_course_id(team_name, course_id)
        team_id = None

        ta_id = tainfo[0]
        missing_ta = tainfo[1]
        course_uses_tas = tainfo[2]

        if team is None:
            if course_uses_tas:
                observer_id = ta_id if not missing_ta else owner_id
            else:
                observer_id = owner_id

            team = create_team({
                "team_name": team_name,
                "observer_id": observer_id,
                "date_created": str(date.today().strftime("%m/%d/%Y")),
                "course_id": course_id
            })

        team_id = team.team_id
        user = get_user_by_email(student.email)

        if user is None:
            lms_id = None if student.lms_id is None else student.lms_id
            helper_create_user(student.fname, student.lname, student.email, 5, lms_id, owner_id)
        else:
            __update_existing_student_info(user, student)

        user_id = get_user_user_id_by_email(student.email)
        user_course = get_user_course_by_user_id_and_course_id(user_id, course_id)

        if user_course is None:
            create_user_course({
                "user_id": user_id,
                "course_id": course_id,
                "role_id": 5,
            })
        else:
            set_inactive_status_of_user_to_active(user_course.user_course_id)

        if not does_team_user_exist(user_id, team_id):
            create_team_user({
                "team_id": team_id,
                "user_id": user_id
            })

    tainfo = __handle_ta()

    for student in students:
        __handle_student(student, team_name, tainfo)


# def __verify_emails(teams: list[TBUTeam]):
#     for team in teams:
#         if not helper_verify_email_syntax(team.ta_email):
#             raise SuspectedMisformatting
#         for student in team.students:
#             if not helper_verify_email_syntax(student.email):
#                 raise SuspectedMisformatting


def __verify_information(teams: list[TBUTeam]):
    for team in teams:
        if team.ta_email == "":
            raise EmptyTAEmail
        if team.name == "":
            raise EmptyTeamName
        if len(team.students) == 0:
            raise EmptyTeamMembers
        if not helper_verify_email_syntax(team.ta_email):
            raise SuspectedMisformatting

        for student in team.students:
            if student.fname == "":
                raise EmptyStudentFName
            if student.lname == "":
                raise EmptyStudentLName
            if student.email == "":
                raise EmptyStudentEmail
            if not helper_verify_email_syntax(student.email):
                raise SuspectedMisformatting


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

        if len(teams) == 0:
            raise EmptyTeamMembers

        # __verify_emails(teams)
        __verify_information(teams)

        # Actually add people to the DB.
        for team in teams:
            __create_team(team, owner_id, course_id)

        return "Success"
    except Exception as e:
        raise e
from customExceptions import *
from models.user import *
from models.course import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_course import *
from models.team_user import *
from datetime import date
import pandas as pd
import csv
import os
import re

"""
teamcsvToDB() takes in three parameters:
    - the path to the file containing the bulkuploaded teams (teamcsvfile) 
    - the id of the user logged in (owner_id)
    - the id of the course (course_id)
teamcsvToDB()
    - reads in the csv file (teamcsvfile)
    - creates teams
    - assigns newly created teams to the course (course_id)
    - assigns students to the newly created teams
teamcsvToDB()
    - NO HEADERS!
    - expects the following values for courses that do not use TAs
        - TeamName
        - StudentEmails
    - expects the following values for courses that do use TAs
        - TeamName
        - StudentEmails
        - TAEmail
"""

# ------------------------------------- Helper Functions ------------------------------------------

def xlsx_to_csv(csvFile):
    read_file = pd.read_excel(csvFile)
    sample_files = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
    temp_file = "/temp.csv"
    read_file.to_csv(sample_files+temp_file, index=None, header=True)
    return sample_files + os.path.join(os.path.sep, temp_file)

def isValidEmail(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if(re.fullmatch(regex, email)):
        return True
    return False
        
# ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------

def teamfileToDB(teamfile, owner_id, course_id):
    isXlsx = False
    try:
        allUsersExist = True
        allTAsAssigned = True
        allUsersInCourse = True
        misformattedRow = None
        courseUsesTAs = get_course_use_tas(course_id)
        # Verify appropriate extension of .csv or .xlsx
        if not (teamfile.endswith('.csv') or teamfile.endswith('.xlsx')):
            return WrongExtension.error
        if teamfile.endswith('.xlsx'):
            isXlsx = True
            teamfile = xlsx_to_csv(teamfile)
        with open(teamfile, mode='r', encoding='utf-8-sig') as teamcsv:
            reader = csv.reader(teamcsv)
            unregisteredEmails = []
            unassignedTAs = []
            unassignedStudents = []
            teams=[]
            if get_user(owner_id) is None:
                return UserDoesNotExist.error
            course = get_course(course_id)
            if course is None:
                return CourseDoesNotExist.error
            if course not in get_courses_by_admin_id(owner_id):
                return OwnerIDDidNotCreateTheCourse.error
            for row in reader:
                ta_email = row[1].strip()
                if isValidEmail(ta_email) == False:
                    misformattedRow = row
                    raise SuspectedMisformatting
                if courseUsesTAs:
                    if get_user_by_email(ta_email) is None:
                        allUsersExist = False
                        unregisteredEmails.append(ta_email)
                    ta_id = get_user_user_id_by_email(ta_email)
                    if get_instructor_ta_course_by_owner_id_ta_id_course_id(owner_id, ta_id, course_id) is None:
                        allTAsAssigned = False
                        unassignedTAs.append(ta_email)
                # else:
                students = []
                for index in range((lambda: 1, lambda: 2)[courseUsesTAs](), len(list(row))):
                    student_email = row[index].strip()
                    if (isValidEmail(student_email) == False): 
                        misformattedRow = row
                        raise SuspectedMisformatting
                    if (get_user_by_email(student_email) is None):
                        allUsersExist = False
                        unregisteredEmails.append(student_email)
                    if get_user_course_by_user_id_and_course_id(get_user_user_id_by_email(student_email), course_id) is None:
                        allUsersInCourse = False
                        unassignedStudents.append(student_email)
                    students.append(get_user_user_id_by_email(student_email))
                teams.append({
                    "team_name": row[0].strip(),
                    "observer_id": (lambda: owner_id, lambda: get_user_user_id_by_email(ta_email))[courseUsesTAs](),
                    "date_created": str(date.today().strftime("%m/%d/%Y")),
                    "students":students
                })
        if not allUsersExist:
            raise UsersDoNotExist
        if not allTAsAssigned:
            raise TANotYetAddedToCourse
        if not allUsersInCourse:
            raise StudentNotEnrolledInThisCourse
        for team in teams:
            created_team = create_team(team)
            create_team_course({
                "team_id": created_team.team_id,
                "course_id":course_id
            })
            for studentID in team["students"]:
                create_team_user({
                    "team_id": created_team.team_id,
                    "user_id": studentID
                })
        return "Upload successful!"
    except FileNotFoundError:
        return "File not found or does not exist!"
    except SuspectedMisformatting:
        return "The following row does not contain a valid email where email is expected:\n" + str(list(misformattedRow))
    except UsersDoNotExist:
        error = "Upload unsuccessful! No account(s) found for the following email(s):"
        for email in unregisteredEmails:
            error += "\n"+str(email)
        error += "\n\nEnsure that all accounts are made and try again."
        return error
    except TANotYetAddedToCourse:
        error = "Upload unsuccessful! The following accounts associated with the following TA emails have not been assigned to this course:"
        for ta_email in unassignedTAs:
            error += "\n"+str(ta_email)
        error += "\n\nEnsure that you have added all of your TAs for this course and try again."
        return error
    except StudentNotEnrolledInThisCourse:
        error = "Upload unsuccessful! The following accounts associated with the following student emails have not been assigned to this course:"
        for student_email in unassignedStudents:
            error += "\n"+str(student_email)
        error += "\n\nEnsure that all of your students are enrolled in this course and try again."
        return error
    finally:
        if isXlsx:
            os.remove(teamfile)
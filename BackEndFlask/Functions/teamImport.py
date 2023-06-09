import customExceptions
from models.user import *
from models.course import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_course import *
from models.team_user import *
from datetime import date
import itertools
import csv

"""
    ------------------------------------- Helper Functions ------------------------------------------
"""
"""
verifyFormatting() takes two parameters:
    - the email to be verified (email)
    - whether or not the row is not a header (RowIsNotHeader)
    By default:
        - RowIsNotHeader is set to True

verifyFormatting()
    - checks to see if the row is not a header and there is no @ symbol in the email
    - if the condition is met, then return supsected misformatting error

    NO HEADERS!
    For a course without TAs
    A valid csv file contains information in the format of:
        TeamName, StudentEmails

    NO HEADERS!
    For a course using TAs
    A valid csv file contains information in the format of:
        TeamName, StudentEmails, TAEmail
"""
def verifyFormatting(email, RowIsNotHeader=True):
    if RowIsNotHeader and '@' not in email:
        return customExceptions.SuspectedMisformatting.error

# Column quantity might not have to be verified as debating whether or not
# to include headers. Not deleting yet but commented out
"""
verifyUserExists() takes four parameters:
    - the user being verified (user)
    - the email of the user (email)
    - an array of emails that are not registered (unregisteredEmails)
    - a boolean that holds whether or not all users exist (allUsersExist)
verifyUserExists()
    - checks if the user passed in is None
    - if the condition is met, set allUsersExist to False and append the email
        of the user to the unregisteredEmails array
"""
def verifyUserExists(user, email, unregisteredEmails, allUsersExist):
    if user is None:
        allUsersExist[0] = False
        unregisteredEmails.append(email)
        return False
    return True

"""
verifyStudentInCourse() takes five parameters:
    - the id of the existing student (student_id)
    - the id of the course (course_id)
    - the email of the existing student (student_email)
    - an array of students who are not assigned to the course (unassignedStudents)
    - a boolean that holds whether or not all students are assigned to the course (allStudentsAssigned)
verifyStudentInCourse()
    - checks if the passed in student is assigned to the course is None
    - if the condition is met, set allStudentsAssigned to False and append the email
        of the student to the unassignedStudents array
"""
    
def verifyStudentInCourse(student_id, course_id, student_email, unassignedStudents, allUsersInCourse):
    if UserCourse.query.filter_by(user_id=student_id, course_id=course_id).first() is None:
        allUsersInCourse[0] = False
        unassignedStudents.append(student_email)
        return False
    return True

"""
verifyTAassignedToCourse() takes six parameters:
    - the id of the TA (ta_id)
    - the id of the user logged in creating the users (owner_id)
    - the id of the course (course_id)
    - the email of the TA (ta_email)
    - an array of TAs who are not assigned to the course (unassignedTAs)
    - a boolean that holds whether or not all TAs are assigned to the course (allTAsAssigned)
verifyTAassignedToCourse()
    - checks if the passed in owner_id, ta_id, and course_id exists in the InstructorTACourse table is None
    - if the condition is met, set allTAsAssigned to False and append the email
        of the ta to the unassignedTAs array
"""
def verifyTAassignedToCourse(ta_id, owner_id, course_id, ta_email, unassignedTAs, allTAsAssigned):
    if get_instructor_ta_course_by_owner_id_ta_id_course_id(owner_id, ta_id, course_id) is None:
        allTAsAssigned[0] = False
        unassignedTAs.append(ta_email)
        return False
    return True

"""
    ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------
"""

"""
teamcsvToDB() takes in three parameters:
    - the path to the file containing the bulkuploaded teams (teamcsvfile) 
    - the id of the user logged in (owner_id)
    - the id of the course (course_id)
teamcsvToDB()
    - reads in the csv file (teamcsvfile)
    - create teams
    - assigns newly created teams to the course (course_id)
    - assigns students to the newly created teams
teamcsvToDB()
    - expects the following values for courses that do not use TAs
        - TeamName
        - StudentEmails
    - expects the following values for courses that do use TAs
        - TeamName
        - StudentEmails
        - TAEmail
"""
def teamcsvToDB(teamcsvfile, owner_id, course_id):
    allUsersExist = True
    allTAsAssigned = True
    allUsersInCourse = True
    courseUsesTAs = get_course_use_tas(course_id)
    if not teamcsvfile.endswith('.csv'):
        return customExceptions.WrongExtension.error
    try:
        with open(teamcsvfile, mode='r', encoding='utf-8-sig') as teamcsv:
            reader = itertools.tee(csv.reader(teamcsv))
            unregisteredEmails = []
            unassignedTAs = []
            unassignedStudents = []
            teams = []
            for row in reader:
                rowLen = len(row)
                if "@" in row[1]:
                    observer_id = owner_id
                    studentEmailsIterator = 1
                    if courseUsesTAs:
                        studentEmailsIterator = 2
                        ta_email = row[1].strip()
                        verifyFormatting(ta_email)
                        ta = get_user_by_email(ta_email)
                        verifyUserExists(
                            ta,
                            ta_email,
                            unregisteredEmails,
                            allUsersExist
                        )
                        observer_id = ta.user_id
                        verifyTAassignedToCourse(
                            observer_id,
                            owner_id,
                            course_id,
                            ta_email,
                            unassignedTAs,
                            allTAsAssigned
                        )
                    team = ({
                        "team_name": row[0].strip(),
                        "observer_id": observer_id,
                        "date_created": str(date.today().strftime("%m/%d/%Y")),
                        "students": []
                    })   
                    while studentEmailsIterator is not rowLen:
                        student_email = row[studentEmailsIterator].strip()
                        verifyFormatting(student_email)
                        student = get_user_by_email(student_email)
                        verifyUserExists(
                            student,
                            student_email,
                            unregisteredEmails,
                            allUsersExist
                        )
                        verifyStudentInCourse(
                            student.user_id,
                            course_id,
                            student_email,
                            unassignedStudents,
                            allUsersInCourse
                        )
                        team['students'].append(student.user_id)
                        studentEmailsIterator += 1
                    teams.append(team)
                else:
                    return customExceptions.SuspectedMisformatting.error
            if not allUsersExist:
                return customExceptions.UsersDoNotExist.error
            if not allTAsAssigned:
                return customExceptions.TANotYetAddedToCourse.error
            if not allUsersInCourse:
                return customExceptions.StudentNotEnrolledInThisCourse.error
            for team in teams:
                create_team(team)
                create_team_course({
                    "team_id": get_last_created_team_team_id(),
                    "course_id": course_id
                })
                for student in team["students"]:
                    create_team_user({
                        "team_id": get_last_created_team_team_id(),
                        "user_id": student
                    })
            return "Upload successful!"
    except FileNotFoundError:
        return customExceptions.FileNotFoundError.error
from models.schemas import Course, Users, InstructorTaCourse, Team, UserCourse
from models.team import create_team
from models.team_course import create_team_course
from models.team_user import create_team_user
from customExceptions import WrongExtension, SuspectedMisformatting, UsersDoNotExist, TANotYetAddedToCourse, StudentNotEnrolledInThisCourse
from datetime import date
import pandas as pd
import csv
import os
import re


"""
    The function teamcsvToDB() takes in three parameters:
        the path to the teamcsvfile,
        the owner_id,
        and the course_id.
    The function attempts to read the passed in csv file to: 
        insert teams to the Team table,
        assign teams to courses through the TeamCourse table, 
        and assign students to these teams through the TeamUser table.


    NO HEADERS!
    For a course without TAs
    A valid csv file contains information in the format of:
        TeamName, StudentEmails

    NO HEADERS!
    For a course using TAs
    A valid csv file contains information in the format of:
        TeamName, StudentEmails, TAEmail
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

def verifyFormatting(email, row_in_question, row, RowIsNotHeader=True):
    if RowIsNotHeader and (isValidEmail(email) is False):
        row_in_question[0] = row 
        raise SuspectedMisformatting

def verifyUserExists(user, email, unregisteredEmails, allUsersExist):
    if user is None:
        allUsersExist[0] = False
        unregisteredEmails.append(email)
        return False
    return True
    
def verifyStudentInCourse(student_id, course_id, student_email, unassignedStudents, allUsersInCourse):
    if UserCourse.query.filter_by(user_id=student_id, course_id=course_id).first() is None:
        allUsersInCourse[0] = False
        unassignedStudents.append(student_email)
        return False
    return True
    
def verifyTAassignedToCourse(ta_id, owner_id, course_id, ta_email, unassignedTAs, allTAsAssigned):
    if InstructorTaCourse.query.filter_by(owner_id=owner_id,ta_id=ta_id,course_id=course_id).first() is None:
        allTAsAssigned[0] = False
        unassignedTAs.append(ta_email)
        return False
    return True
        
    
# ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------

def teamcsvToDB(teamfile, owner_id, course_id):
    try:
        allUsersExist = [True]
        allTAsAssigned = [True]
        allUsersInCourse = [True]
        row_in_question = [None]
        courseUsesTAs = Course.query.filter_by(course_id=course_id).first().use_tas
        isXlsx = False
        # Verify appropriate extension of .csv
        if not (teamfile.endswith('.csv') or teamfile.endswith('.xlsx')):
            raise WrongExtension
        if teamfile.endswith('.xlsx'):
            isXlsx = True
            teamfile = xlsx_to_csv(teamfile)
        with open(teamfile, mode='r', encoding='utf-8-sig') as teamcsv:
            # reader, reader2 = itertools.tee(csv.reader(teamcsv))
            reader = csv.reader(teamcsv)
            unregisteredEmails = []
            unassignedTAs = []
            unassignedStudents = []
            teams=[]
            for row in reader:
                rowLen = len(list(row))
                if isValidEmail(row[1].strip()):
                    observer_id = owner_id
                    studentEmailsIterator = 1
                    if courseUsesTAs:
                        studentEmailsIterator = 2
                        ta_email = row[1].strip()
                        verifyFormatting(ta_email, row_in_question, row) # verifyFormatting(col, RowIsNotHeader)
                        ta=Users.query.filter_by(email=ta_email).first()
                        if verifyUserExists(ta, ta_email, unregisteredEmails, allUsersExist=allUsersExist):
                            observer_id = ta.user_id
                            verifyTAassignedToCourse(observer_id, owner_id, course_id, ta_email, unassignedTAs, allTAsAssigned)
                    team = ({"team_name": row[0].strip(), "observer_id": observer_id,"date_created": str(date.today().strftime("%m/%d/%Y")),"students":[]})   
                    while studentEmailsIterator!=rowLen:
                        student_email = row[studentEmailsIterator].strip()
                        verifyFormatting(student_email, row_in_question, row)
                        student = Users.query.filter_by(email=student_email).first()
                        if verifyUserExists(student, student_email, unregisteredEmails, allUsersExist=allUsersExist):
                            verifyStudentInCourse(student.user_id, course_id, student_email, unassignedStudents, allUsersInCourse )
                            team['students'].append(student.user_id)
                        studentEmailsIterator+=1
                    teams.append(team)
                else:
                    row_in_question[0] = row
                    raise SuspectedMisformatting
            if not allUsersExist[0]:
                raise UsersDoNotExist
            if not allTAsAssigned[0]:
                raise TANotYetAddedToCourse
            if not allUsersInCourse[0]:
                raise StudentNotEnrolledInThisCourse
            for team in teams:
                create_team(team)
                created_team = Team.query.order_by(Team.team_id.desc()).first()
                create_team_course({"team_id":created_team.team_id, "course_id": course_id})
                for student in team["students"]:
                    create_team_user({"team_id":created_team.team_id, "user_id":student})
            return "Upload successful!"
    except WrongExtension:
        error = "Wrong filetype submitted! Please submit a .csv file."
        return error
    except FileNotFoundError:
        error = "File not found or does not exist!"
        return error    
    except SuspectedMisformatting: 
        error = "The following row does not contain a valid email where email is expected:"
        error += "\n" + str(list(row_in_question[0]))
        return error
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
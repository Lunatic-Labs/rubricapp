from models.schemas import Course, Users, InstructorTaCourse, Team, TeamUser, UserCourse
from models.team import create_team
from models.team_course import create_team_course
from models.team_user import create_team_user
from customExceptions import WrongExtension, TooManyColumns, NotEnoughColumns, SuspectedMisformatting, UserDoesNotExist, TANotYetAddedToCourse, StudentNotEnrolledInThisCourse
from datetime import date
import itertools
import csv

def queryTeam(teamName, observer_id):
     return Team.query.filter_by(
                team_name=teamName,observer_id=observer_id,
                date=str(date.today().strftime("%m/%d/%Y"))).first()

def verifyFormatting(email, RowIsNotHeader):
    if RowIsNotHeader and '@' not in email:
        raise SuspectedMisformatting

def verifyColumnQuantity(courseUsesTAs, columns):
    if courseUsesTAs:
        if (columns > 3):
            raise TooManyColumns
        elif (columns < 3):
            raise NotEnoughColumns
    else: 
        if (columns > 2):
            raise TooManyColumns
        elif (columns < 2):
            raise NotEnoughColumns

def verifyUserExists(user):
    if user is None:
        raise UserDoesNotExist
    
def verifyStudentInCourse(student_id, course_id):
    if UserCourse.query.filter_by(user_id=student_id, course_id=course_id) is None:
        raise StudentNotEnrolledInThisCourse
    
def verifyTAassignedToCourse(ta_id, owner_id, course_id):
    if InstructorTaCourse.query.filter_by(
        owner_id=owner_id,ta_id=ta_id,
        course_id=course_id).first() is None:
        raise TANotYetAddedToCourse
    
# ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------
"TeamName, [Student_Emails], TA_Email"
def teamcsvToDB(teamcsvfile, owner_id, course_id):
    try:
        courseUsesTAs = Course.query.filter_by(course_id=course_id).first().use_tas
        # Verify appropriate extension of .csv
        if not teamcsvfile.endswith('.csv'):
            raise WrongExtension
        with open(teamcsvfile) as teamcsv:
            reader, reader2 = itertools.tee(csv.reader(teamcsv))
            columns = len(next(reader2))
            verifyColumnQuantity(courseUsesTAs, columns)
            del reader2
            RowIsNotHeader=False
            teams=[]
            teamCourses=[]
            teamUsers=[]
            for row in reader:
                if '@' not in row[1]:
                    # observer_id is the owner by default. 
                    observer_id = owner_id
                    studentEmails = row[1].strip("\"").split(",")
                    if courseUsesTAs:
                        if row[2].strip(): # If Course uses TAs and no TA is assigned to a team, Owner is assigned to team
                            verifyFormatting(row[2].strip(), RowIsNotHeader)
                            ta=Users.query.filter_by(email=row[2].strip()).first()
                            verifyUserExists(ta)
                            observer_id = ta.user_id
                            verifyTAassignedToCourse(observer_id, owner_id, course_id)
                    teams.append({"team_name": row[0].strip(), "observer_id": observer_id,"date_created": str(date.today().strftime("%m/%d/%Y"))})
                    team = queryTeam(row[0].strip(), observer_id)
                    teamCourses.append({"team_id":team.team_id, "course_id": course_id})
                    for studentEmail in studentEmails:
                        student = Users.query.filter_by(email=studentEmail.strip()).first()
                        verifyUserExists(student)
                        verifyStudentInCourse(student.user_id, course_id)
                        teamUsers.append({"team_id":team.team_id, "user_id":student.user_id})
                elif (RowIsNotHeader):
                    raise SuspectedMisformatting
                RowIsNotHeader = True
            # If no exceptions were raised, update database with teams, team_course relations, and team_user relations
            for team in teams:
                create_team(team)
            for teamCourse in teamCourses:
                create_team_course(teamCourse)
            for teamUser in teamUsers:
                create_team_user(teamUser)
        return teamUser
    except WrongExtension:
        error = "Wrong filetype submitted! Please submit a .csv file."
        return error
    except FileNotFoundError:
        error = "File not found or does not exist!"
        return error    
    except TooManyColumns:
        error=None
        if courseUsesTAs:
            error = "File contains more than the 3 expected columns: team_name, student_emails, ta_email"
        else:
            error = "File contains more than the 2 expected columns: team_name, student_emails"
        return error
    except NotEnoughColumns:
        error=None
        if courseUsesTAs:
            error = "File contains less than the 3 expected columns: team_name, student_emails, ta_email"
        else:
            error = error = "File contains less than the 2 expected columns: team_name, student_emails"
        return error
    except SuspectedMisformatting:
        error = "Row other than header does not contain an email where an email is expected. Misformatting Suspected."
        return error
    except UserDoesNotExist:
        error = "At least one email address in the csv file is not linked to a user. Make sure all students and TAs have accounts."
        return error
    except TANotYetAddedToCourse:
        error = "At least one of the TAs listed in the csv file is not assigned to this course."
        error += " Make sure all of your TAs have been added to this course."
        return error
    except StudentNotEnrolledInThisCourse:
        error = "At least one of the student emails in the csv file is not associated with a student enrolled in this course. "
        error += "Make sure all of your students have been added to this course."
        return error
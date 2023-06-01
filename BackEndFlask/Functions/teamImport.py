from models.schemas import *
from models.team import *
from models.team_user import *
from datetime import date
from customExceptions import *
import itertools
import csv

"""
    The function teamcsvToDB() takes in three parameters:
        the path to the teamcsvfile,
        the owner_id,
        and the course_id.
    The function attempts to read the passed in csv file to insert teams to the Team table,
    and assign students to these teams through the TeamUser table.

    For a course without TAs
    A valid csv file contains information in the format of:
        <"student_last_name, student_first_name">, <student_email>, <team_name>

    For a course using TAs
    A valid csv file contains information in the format of:
        <student_last_name, first_name">, <student_email>, <team_name>, <"ta_last_name, ta_first_name">, <ta_email>

    Students that are in the same team must be placed in direct succession of each other.
        

    Note:   The columns containing names of students and TAs are not necesary nor do they affect the code.
            They are simply to aid readability for user. To remove this requirement, update column variables.

"""

def queryTeam(teamName, observer_id):
     return Team.query.filter_by(
                team_name=teamName,observer_id=observer_id,
                date=str(date.today().strftime("%m/%d/%Y"))).first()

def verifyColumnQuantity(courseUsesTAs, columns):
    if courseUsesTAs:
        if (columns > 5):
            raise TooManyColumns
        elif (columns < 5):
            raise NotEnoughColumns
    else: 
        if (columns > 3):
            raise TooManyColumns
        elif (columns < 3):
            raise NotEnoughColumns
        
def verifyTAassignedToCourse(ta_id, owner_id, course_id):
    if InstructorTaCourse.query.filter_by(
        owner_id=owner_id,ta_id=ta_id,
        course_id=course_id).first() is None:
        raise TANotYetAddedToCourse

def verifyFormatting(row, counter):
    if '@' not in row and counter!= 0:
        raise SuspectedMisformatting 
    
def verifyUserExists(user):
    if user is None:
        raise UserDoesNotExist
    
def verifyStudentInCourse(student_id, course_id):
    if UserCourse.query.filter_by(user_id=student_id, course_id=course_id) is None:
        raise StudentNotEnrolledInThisCourse

def verifyConsistentObserverID(orig_observer_id, new_observer_id):
    if orig_observer_id != new_observer_id:
        raise InconsistentObserverID    

# ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------

def teamcsvToDB(teamcsvfile, owner_id, course_id):
    try:
        courseUsesTAs = Course.query.filter_by(course_id=course_id).first().use_tas
        # Verify appropriate extension of .csv
        if not teamcsvfile.endswith('.csv'):
            raise WrongExtension
        with open(teamcsvfile) as teamcsv:
            reader = itertools.tee(csv.reader(teamcsv))
            reader, reader2 = itertools.tee(csv.reader(teamcsv))
            columns = len(next(reader2))
            del reader2
            verifyColumnQuantity(courseUsesTAs, columns)
            teamNames=[]
            teams=[]
            teamUsers=[]
            team=None
            teamName=None
            observer_id=None
            counter = 0
            for row in reader:
                # Does the second column contain an email? 
                # If not, row should be column headers. Else, SuspectedMisformatting
                if '@' in row[1]:
                    studentEmail = row[1].strip()
                    prevTeamName = teamName
                    teamName = row[2].strip()
                    # If team name has not yet been recorded in this session, create a team. 
                    # Else, keep using last team_id to make a team_user relation
                    if teamName not in teamNames:
                        # observer_id is the owner by default. 
                        observer_id=owner_id
                        if courseUsesTAs:
                            verifyFormatting(row[4].strip(), counter)
                            ta=Users.query.filter_by(email=row[4].strip()).first()
                            verifyUserExists(ta)
                            observer_id = ta.user_id
                            verifyTAassignedToCourse(observer_id, owner_id, course_id)
                        teams.append({"team_name": teamName, "observer_id": observer_id,"date": str(date.today().strftime("%m/%d/%Y"))})
                        team = queryTeam(teamName, observer_id)
                    else:
                        if prevTeamName and teamName == prevTeamName:
                            verifyConsistentObserverID(observer_id, row[4].strip())
                        # if teamName has already appeared and is not in direct succession of the last time it has appeared
                        # query for that team in order to use its team_id to establish a team_user relationship
                        else:
                            team = queryTeam(teamName, row[4].strip())
                            if team is None:
                                raise InconsistentObserverID
                    student = Users.query.filter_by(email=studentEmail).first()
                    verifyUserExists(student)
                    verifyStudentInCourse(student.user_id, course_id)
                    teamUsers.append({"team_id":team.team_id, "user_id":student.user_id})
                elif(counter != 0):
                    raise SuspectedMisformatting
                counter+=1
            # If no exceptions were raised, update database with teams and team_user relationship
            for team in teams:
                create_team(team)
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
            error = "File contains more than the 5 expected columns: <\"student_last_name, student_first_name\">, <student_email>"
            error+= ", <team_name>, <\"ta_last_name, ta_first_name\">, <ta_email>"
        else:
            error = "File contains more than the 3 expected columns: <\"student_last_name, student_first_name\">, <student_email>, <team_name>"
        return error
    except NotEnoughColumns:
        error=None
        if courseUsesTAs:
            error = "File contains less than the 5 expected columns: <\"student_last_name, student_first_name\">, <student_email>"
            error+= ", <team_name>, <\"ta_last_name, ta_first_name\">, <ta_email>"
        else:
            error = "File contains less than the 3 expected columns: <\"student_last_name, student_first_name\">, <student_email>, <team_name>"
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
    except InconsistentObserverID:
        error = "Attempt made to assign more than one observer to a team. Please revise the uploaded file and ensure all teams have only one observer"
        return error
    

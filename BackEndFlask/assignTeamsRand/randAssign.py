from models.user import *
from models.team import *
from models.team_user import *
from models.schemas import *
from population_functions.functions import *
from sqlalchemy import *
from sqlalchemy.sql import func
from datetime import date
from core import app, db
from math import floor
import random

"""
This function takes a course_id and an owner_id(ID of the professor logged in currently)
and randomly assigns all students that are correlated with the course_id into groups of four
and divides these teams amongst TAs (if course uses TAs)
If course does not use TAs then teams are assigned to the professor making the teams.
"""

class NoTAsListed(Exception):
    "Raised when course is listed as using TAs, but there are no TAs associated with this course"
    pass

class NoStudentsInCourse(Exception):
    "Raise when no students associated with this course are found"
    pass

# ------------------------------------- Helper Functions ------------------------------------------

def groupNum(students):   # This function takes the number of students
    sizeOfTeams=4         # and the expected size of each team to calculate
    d = floor(students/sizeOfTeams)  # the number of teams that is apporpriate to create
    if students%sizeOfTeams:
        return d+1
    else:
        return d

def makeTeams(groupNum, observer_id, teamIDs): # This function takes each group and assigns an observer as well as making the list of teamIDs
    team_name = "Team " + str(groupNum)                   
    create_team({"team_name":team_name, "observer_id":observer_id, "date":str(date.today().strftime("%m/%d/%Y"))})
    created_team = Team.query.order_by(Team.team_id.desc()).first()
    teamIDs.append(created_team.team_id)

def assignUsersToTeams(students, teams): # This function takes a list of student_ids and team_ids
    records=[]                           # to assign students to teams in a randomized fashion
    i=0
    randomizeStudentList = random.sample(students, len(students))
    for student in randomizeStudentList:
        create_team_user({"team_id": teams[i%len(teams)], "user_id":student})
        records.append(TeamUser.query.order_by(TeamUser.tu_id.desc()).first())
        i+=1
    return records

# ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------

def RandomAssignTeams(owner_id,course_id): # This function randomly assigns all students
    try:                                   # in a given course to teams
        studentsList = UserCourse.query.filter(UserCourse.course_id==course_id).all() # This assumes that all users 
        if studentsList is None:                                                      # associated with courses are students
            raise NoStudentsInCourse
        studentIDs = []
        for student in studentsList:
            studentIDs.append(student.user_id)
        numofgroups = groupNum(len(studentsList))
        teamIDs=[]

        course_uses_tas = Course.query.filter(Course.course_id==course_id).first().use_tas
        if course_uses_tas is False: 
            for x in range(numofgroups):
                makeTeams(x, owner_id,teamIDs)

        else: # Course uses TAs
            tasList = InstructorTaCourse.query.filter(InstructorTaCourse.course_id==course_id).all()
            if tasList: # if TA(s) exists                                                                        
                taIDs = []
                for ta in tasList:
                    taIDs.append(ta.ta_id)
                for x in range(numofgroups):
                    makeTeams(x, taIDs[x%len(tasList)], teamIDs)
            else: # if no TA's found despite course expecting to use them, raise exception
                raise NoTAsListed
            
        team_user_assignments = assignUsersToTeams(studentIDs, teamIDs)
        return team_user_assignments
    
    except NoTAsListed:
        error = "Course uses TA's, but no TA's associated with this course found. Please assign your TA's or mark course as 'not using TAs'"
        return error

    except NoStudentsInCourse:
        error = "No students associated with this course."
        return error
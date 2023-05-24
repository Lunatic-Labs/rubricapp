from models.user import *
from models.team import *
from models.team_user import *
from models.schemas import *
from population_functions.functions import *
from sqlalchemy import *
from sqlalchemy.sql.expression import *
from core import app, db
from math import floor
import random

"""
This function takes a course_id and an owner_id(ID of the professor logged in currently)
and randomly assigns all students that are correlated with the course_id into groups of four
and divides these teams amongst TAs (if course uses TAs)
If course does not use TAs then teams are assigned to the professor making the teams.


"""

def groupNum(students):   # This function takes the number of students
    sizeOfTeams=4         # and the expected size of each team to calculate
    d = floor(students/sizeOfTeams)  # the number of teams that is apporpriate to create
    if students%sizeOfTeams:
        return d+1
    else:
        return d

def assignUsersToTeams(students, teams): # This function takes a list of student_ids and team_ids
    i=0                                  # to assign students to teams in a randomized fashion
    randomizeStudentList = random.sample(students, len(students))
    for student in randomizeStudentList:
        create_team_user({"team_id": teams[i%len(teams)], "user_id":student})
        i+=1





def RandomAssignTeams(owner_id,course_id): # This function randomly assigns all students
                                           # in a given course to teams
    studentCount = UserCourse.query.filter(UserCourse.course_id==course_id).count()
    studentsList = UserCourse.query.filter(UserCourse.course_id==course_id).all()
    studentIDs = []
    for student in studentsList:
        studentIDs.append(student.user_id)


    numofgroups = groupNum(studentCount)
    teamIDs=[]


    taCount = InstructorTaCourse.query.filter(InstructorTaCourse.owner_id==owner_id).count()
    # This if-else-statement checks to see if this course has TAs
    # If so, TAs will be assigned as observers to the generated teams
    # If not, Professor will be assigned as the observer to all generated teams
    if taCount:                                                                         
        tasList = InstructorTaCourse.query.filter(InstructorTaCourse.course_id==course_id).all()
        taIDs = []
        for ta in tasList:
            taIDs.append(ta.ta_id)
        i = 0
        for x in range(numofgroups):
            team_name = "Team" + str(x)
            obs_id = taIDs[i%taCount]
            create_team({"team_name":team_name, "observer_id":obs_id, "date":func.current_date()})
            created_team = Team.query.order_by(Team.team_id.desc()).first()
            teamIDs.append(created_team.team_id)
            i+=1
        
    else:
        for x in range(numofgroups):
            team_name = "Team" + str(x)
            create_team({"team_name":team_name, "observer_id":owner_id, "date":func.current_date()})
            created_team = Team.query.order_by(Team.team_id.desc()).first()
            teamIDs.append(created_team.team_id)
    
    assignUsersToTeams(studentIDs, teamIDs)
    
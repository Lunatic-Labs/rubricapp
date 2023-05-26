from models.user import *
from models.team import *
from models.team_user import *
from population_functions.functions import *
from datetime import date
from math import floor
import random

"""
    The function RandomAssignTeams() takes in two parameters:
        - course_id,
        - owner_id (ID of the professor currently logged in) 
    The function RandomAssignTeams() randomly assigns all students
        enrolled in the corresponding course into groups of four,
        dividing the autogenerated teams between enrolled TAs.
        (if course uses TAs)
        If course does not use TAs then teams are assigned to the
            professor making the teams.
"""

class NoTAsListed(Exception):
    "Raised when course is listed as using TAs, but there are no TAs associated with the course_id"
    pass

class NoStudentsInCourse(Exception):
    "Raise when no students associated with the course_id are found"
    pass

# ------------------------------------- Helper Functions ------------------------------------------

# This function takes the number of students
#   and the expected size of each team to calculate
#   the number of teams that is apporpriate to create.
def groupNum(students, team_size=4):
    d = floor(students/team_size)
    if students%team_size:
        return d+1
    else:
        return d

# This function takes each group and assigns an
#   observer as well as making the list of teamIDs.
def makeTeams(groupNum, teamIDs, observer_id):
    team_name = "Team " + str(groupNum)                   
    create_team({"team_name":team_name, "observer_id":observer_id, "date":str(date.today().strftime("%m/%d/%Y"))})
    created_team = Team.query.order_by(Team.team_id.desc()).first()
    teamIDs.append(created_team.team_id)

# This function takes a list of student_ids and team_ids
#   to assign students to teams in a randomized fashion.
def assignUsersToTeams(students, teams):
    records=[]
    i=0
    randomizeStudentList = random.sample(students, len(students))
    for student in randomizeStudentList:
        create_team_user({"team_id": teams[i%len(teams)], "user_id":student})
        records.append(TeamUser.query.order_by(TeamUser.tu_id.desc()).first())
        i+=1
    return records

# ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------

# This function randomly assigns all students in a given
#   course to teams. This assumes that all users associated
#   with courses are students.
def RandomAssignTeams(owner_id,course_id):
    try:
        studentsList = UserCourse.query.filter(UserCourse.course_id==course_id).all()
        if studentsList is None:
            raise NoStudentsInCourse
        studentIDs = []
        for student in studentsList:
            studentIDs.append(student.user_id)
        numofgroups = groupNum(len(studentsList),team_size)
        teamIDs=[]
        course_uses_tas = Course.query.filter(Course.course_id==course_id).first().use_tas
        if course_uses_tas is False: 
            for x in range(numofgroups):
                makeTeams(x, teamIDs, owner_id)
        else: 
            # Course uses TAs
            tasList = InstructorTaCourse.query.filter(InstructorTaCourse.course_id==course_id).all()
            # If TA(s) exists
            if tasList:
                taIDs = []
                for ta in tasList:
                    taIDs.append(ta.ta_id)
                for x in range(numofgroups):
                    makeTeams(x, teamIDs, taIDs[x%len(tasList)], )
            else:
                # If the course expected to use TAs but no TAs where found,
                #   raise exception
                raise NoTAsListed
        team_user_assignments = assignUsersToTeams(studentIDs, teamIDs)
        return team_user_assignments
    except NoTAsListed:
        error = "Course uses TAs, but no TAs associated with this course were found."
        error += "Please assign your TAs or mark course as 'not using TAs'"
        return error
    except NoStudentsInCourse:
        error = "No students are associated with this course."
        return error
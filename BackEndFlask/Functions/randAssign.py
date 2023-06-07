from models.schemas import InstructorTaCourse, Course, Team, TeamUser, UserCourse
from models.instructortacourse import get_instructor_ta_courses_by_course_id
from models.course import get_course
from models.user_course import get_user_courses_by_course_id
from models.team import create_team
from models.team_user import create_team_user
from customExceptions import NoTAsListed, NoStudentsInCourse
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
# ------------------------------------- Helper Functions ------------------------------------------

# groupNum() two parameters:
#   - the total number of students (students)
#   - the specified team size (team_size)takes the number of students
# groupNum() returns the total number of groups to make based on the total amount of students
#   and the specified team size
def groupNum(students, team_size):
    return (lambda: floor(students/team_size), lambda: floor(students/team_size)+1)[students%team_size != 0]()

# makeTeams() takes three parameters:
#   - the total number of groups (groupNum)
#   - an empty array to add generated team_ids (teamIDs)
#   - the user_id who is assigned to the team (observer_id)
# makeTeams()
#   - creates a team, team name, assigns the observer_id to the team, and the date created
#   - retrieves the team_id of the newly created team
#   - appends the newly created team_id to the array (teamIDs) 
def makeTeams(groupNum, teamIDs, observer_id):
    team_name = "Team " + str(groupNum)                   
    create_team({
        "team_name":team_name, 
        "observer_id":observer_id, 
        "date_created":str(date.today().strftime("%m/%d/%Y"))
    })
    created_team = Team.query.order_by(Team.team_id.desc()).first()
    teamIDs.append(created_team.team_id)

# assignUsersToTeams() takes two parameters:
#   - an array of student ids (students)
#   - an array of team ids (teams)
# assignUsersToTeams()
#   - stores a randomly generated order of the student ids
#   - iterates through the list of randomly generated order of student ids
#       and assigns each student id to a team id
#   - stores the record of recently assigned student id to a team id
#   - returns an array of all the records stored in the TeamUser table 
def assignUsersToTeams(students, teams):
    records=[]
    i=0
    randomizeStudentList = random.sample(students, len(students))
    for student in randomizeStudentList:
        create_team_user({
            "team_id": teams[i%len(teams)], 
            "user_id":student
        })
        records.append(TeamUser.query.order_by(TeamUser.team_user_id.desc()).first())
        i+=1
    return records

# ----------------------------- FUNCTION INTENDED TO BE USED IN ROUTES ------------------------------

# RandomAssignTeams() takes three parameters:
#   - the TA/Instructor or Admin that is creating the students (owner_id)
#   - the course that students are going to be assigned to (course_id)
#   - the specified size of how big teams can be (team_size)
#       By default:
#           - team_size is set to 4
# RandomAssignTeams()
#   - retrieves all of the students assigned to the course_id
#   - iterates through the list and appends each student user_id to the
#       list of students
#   - retrieves the total amount of groups to make
#   - retrieves whether or not the course uses TAs
#   - if the course does not use TAs, then create the teams with owner_id
#   - else retrieve all of the TAs assigned to the course and use them to create the teams
#   - assigns all the students to the newly created teams 
#   - returns the list of assigned students to teams
def RandomAssignTeams(owner_id, course_id, team_size=4):
    try:
        studentsList = get_user_courses_by_course_id(course_id)
        if type(studentsList) is type(""):
            return studentsList
        if len(studentsList)==0:
            raise NoStudentsInCourse
        studentIDs = []
        for student in studentsList:
            studentIDs.append(student.user_id)
        numofgroups = groupNum(len(studentsList), team_size)
        teamIDs=[]
        course_uses_tas = get_course(course_id).use_tas
        if course_uses_tas is False: 
            for x in range(numofgroups):
                makeTeams(x, teamIDs, owner_id)
        else:
            tasList = get_instructor_ta_courses_by_course_id(course_id)
            if tasList:
                taIDs = []
                for ta in tasList:
                    taIDs.append(ta.ta_id)
                for x in range(numofgroups):
                    makeTeams(x, teamIDs, taIDs[x%len(tasList)])
            else:
                # The course expected to use TAs but no TAs where found
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
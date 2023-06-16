from Functions.customExceptions import *
from Functions.test_files.population_functions import *
from models.team import *
from models.team_user import *
from models.team_course import *
from models.course import *
from models.user_course import *
from models.team import *
from models.team_user import *
from models.team_course import *
import customExceptions
from datetime import date
from math import floor
import random

# groupNum()
#   - takes two parameters:
#       - the total number of students (students)
#       - the specified team size (team_size)
#   - returns the total number of groups to make based on
#       the total amount of students and the specified team size
def groupNum(students, team_size):
    return(
        lambda: floor(students/team_size),
        lambda: floor(students/team_size)+1
    )[students%team_size != 0]()

# makeTeams()
#   - takes three parameters:
#       - the total number of groups (groupNum)
#       - an empty array to add generated team_ids (teamIDs)
#       - the user_id who is assigned to the team (observer_id)
#   - creates an team and enrolls that team to the specified course
#   - returns the newly created team
#       - unless an error occurs
#           - returns the error message
def makeTeams(groupNum, observer_id, course_id):
    team_name = "Team " + str(groupNum)
    new_team = create_team({
        "team_name": team_name, 
        "observer_id": observer_id, 
        "date_created": str(date.today().strftime("%m/%d/%Y")),
        "isActive": True
    })
    if type(new_team) is type(""):
        return new_team
    team_course = create_team_course({
        "team_id": new_team.team_id,
        "course_id": course_id
    })
    if type(team_course) is type(""):
        return team_course
    return new_team

# assignUsersToTeams()
#   - takes two parameters:
#       - an array of student ids (students)
#       - an array of team ids (teams)
#   - assigns the randomized array of student to a team
#   - returns an array of students assigned to teams
#       - unless an error occurs
#           - returns the error message
def assignUsersToTeams(students, teams):
    records = []
    i = 0
    randomizeStudentList = random.sample(consentingStudents, len(consentingStudents))
    randomizeStudentList += random.sample(nonconsentingStudents, len(nonconsentingStudents))
    for student in randomizeStudentList:
        team_user = create_team_user({
            "team_id": teams[i%len(teams)].team_id,
            "user_id": student.user_id
        })
        if type(team_user) is type(""):
            return team_user
        records.append(team_user)
        i += 1
    return records

# RandomAssignTeams()
#   - takes three parameters:
#       - the id of the Admin creating the students (owner_id)
#       - the course that students are going to be assigned to (course_id)
#       - the specified size of how big teams can be (team_size)
#           By default:
#               - team_size is set to 4
#   - assigns the TAs and students to teams if the course uses TAs
#   - returns a json object containing the TAs, students, teams, and team_users
#       - unless an error occurs
#           - returns the error message
def RandomAssignTeams(observer_id, course_id, team_size=4):
    useTAs = get_course_use_tas(course_id)
    if type(useTAs) is type(""):
        return useTAs
    user_courses = get_user_courses_by_course_id(course_id)
    if type(user_courses) is type(""):
        return user_courses
    tas = filter_users_by_role(user_courses, 4)
    if type(tas) is type(""):
        return tas
    if useTAs and tas.__len__() == 0:
        return NoTAsListed.error
    students = filter_users_by_role(user_courses, 5)
    if type(students) is type(""):
        return students
    if students.__len__() == 0:
        return NoStudentsInCourse.error
    numberOfTeams = groupNum(students.__len__(), team_size)
    teams = []
    for team in range(numberOfTeams):
        teams.append(makeTeams(team, (lambda: observer_id, lambda: tas[team%tas.__len__()].user_id)[useTAs](), course_id))
    team_users = assignUsersToTeams(students, teams)
    if type(team_users) is type(""):
        return team_users
    result = {
        "students": students,
        "tas": tas,
        "teams": teams,
        "team_users": team_users
    }
    return result
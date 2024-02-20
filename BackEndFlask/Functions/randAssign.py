from Functions.customExceptions import *
from Functions.test_files.PopulationFunctions import *
from models.course import *
from models.user_course import *
from models.team import *
from models.team_user import *
from datetime import date
from math import floor
import random

# group_num()
#   - takes two parameters:
#       - the total number of students (students)
#       - the specified team size (team_size)
#   - returns the total number of groups to make based on
#       the total amount of students and the specified team size
def group_num(students, team_size):
    return(
        lambda: floor(students/team_size),
        lambda: floor(students/team_size)+1
    )[students%team_size != 0]()

# make_teams()
#   - takes three parameters:
#       - the total number of groups (group_num)
#       - an empty array to add generated team_ids (team_i_ds)
#       - the user_id who is assigned to the team (observer_id)
#   - creates an team and enrolls that team to the specified course
#   - returns the newly created team
#       - unless an error occurs
#           - returns the error message
def make_teams(group_num, observer_id, course_id):
    team_name = "Team " + str(group_num)
    new_team = create_team({
        "team_name": team_name, 
        "observer_id": observer_id, 
        "date_created": str(date.today().strftime("%m/%d/%Y")),
        "active_until": None, 
        "course_id": course_id
    })
    return new_team

# assign_users_to_teams()
#   - takes two parameters:
#       - an array of student ids (students)
#       - an array of team ids (teams)
#   - assigns the randomized array of student to a team
#   - returns an array of students assigned to teams
#       - unless an error occurs
#           - returns the error message
def assign_users_to_teams(students, teams):
    records = []
    i = 0
    randomize_student_list = random.sample(students, len(students))
    for student in randomize_student_list:
        team_user = create_team_user({
            "team_id": teams[i%len(teams)].team_id,
            "user_id": student.user_id
        })
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
    use_tas = get_course_use_tas(course_id)
    user_courses = get_user_courses_by_course_id(course_id)
    tas = filter_users_by_role(user_courses, 4)
    
    if use_tas and tas.__len__() == 0:
        raise NoTAsListed
    
    students = filter_users_by_role(user_courses, 5)
    if students.__len__() == 0:
        raise NoStudentsInCourse
    
    number_of_teams = group_num(students.__len__(), team_size)
    teams = []
    for team in range(number_of_teams):
        teams.append(make_teams(team, (lambda: observer_id, lambda: tas[team%tas.__len__()].user_id)[use_tas](), course_id))
    team_users = assign_users_to_teams(students, teams)

    result = {
        "students": students,
        "tas": tas,
        "teams": teams,
        "team_users": team_users
    }
    return result
from models.user import *
from models.course import *
from models.user_course import *
from models.team import *
from models.team_user import *
import pandas as pd
import os
import re

# TODO: Need to write a test for both studentImport and teamImport to make sure
#   that isValidEmail works as should!
def isValidEmail(email):
    return re.fullmatch(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b',
        email
    )

# TODO: Need to write a test for both studentImport and teamImport to make sure
#   that xlsx file is converted to csv
def xlsx_to_csv(csvFile):
    read_file = pd.read_excel(csvFile)
    sample_files = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
    temp_file = "/temp.csv"
    read_file.to_csv(sample_files+temp_file, index=None, header=True)
    return sample_files + os.path.join(os.path.sep, temp_file)

# TODO: Need to write a test for both studentImport and teamImport to make sure
#   that the xlsx file is deleted when there is success and when there are errors!
def delete_xlsx(studentFile, isXlsx):
    if isXlsx:
        os.remove(studentFile)

# template_user
#   - is a json object that holds the keys and default values needed to create a new test user
template_user = {
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "Skillbuilder",
    "consent": None,
    "lms_id": None
}

# createOneAdminCourse()
#   - takes one parameter:
#       - whether the test course uses TAs or not
#   - creates a test teacher and a test course
#   - returns a json object containing the id of the test teacher and test course
def createOneAdminCourse(useTAs):
    teacher = template_user
    teacher["first_name"] = "Test Teacher"
    teacher["last_name"] = "1"
    teacher["email"] = f"testteacher{get_users().__len__()}@gmail.com"
    teacher["role_id"] = 3
    teacher["owner_id"] = 1
    new_teacher = create_user(teacher)
    if type(new_teacher) is type(""):
        return new_teacher
    new_course = create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": new_teacher.user_id,
        "use_tas": useTAs,
        "use_fixed_teams": False
    })
    if type(new_course) is type(""):
        return new_course
    result = {
        "user_id": new_teacher.user_id,
        "course_id": new_course.course_id
    }
    return result

# deleteOneAdminCourse()
#   - takes one parameter:
#       - the json object returned from createOneAdminCourse()
#   - deletes the test teacher and test course created by createOneAdminCourse()
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def deleteOneAdminCourse(result):
    user = delete_user(result["user_id"])
    if type(user) is type(""):
        return user
    course = delete_course(result["course_id"])
    if type(course) is type(""):
        return course
    user_course = delete_user_course_by_user_id_course_id(result["user_id"], result["course_id"])
    if type(user_course) is type(""):
        return user_course

# deleteAllUsersUserCourses()
#   - takes one parameter:
#       - the id of the test course
#   - deletes and unenrolles
#       - all test users enrolled in the test course
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def deleteAllUsersUserCourses(course_id):
    user_courses = get_user_courses_by_course_id(course_id)
    if type(user_courses) is type(""):
        return user_courses
    for user_course in user_courses:
        user = delete_user(user_course.user_id)
        if type(user) is type(""):
            return user
        deleted_user_course = delete_user_course_by_user_id_course_id(user_course.user_id, course_id)
        if type(deleted_user_course) is type(""):
            return deleted_user_course

# createOneAdminTAStudentCourse()
#   - takes three parameters:
#       - whether the test course uses TAs or not
#       - whether to unenroll the test ta
#       - whether to unenroll the test student
#   - creates a test teacher, test student, and a test course
#   - returns a json object containing the id of
#       - the test teacher
#       - the test student
#       - the test ta if the course uses tas, else the test teacher
#       - test course
#       - unless an error occurs
#           - returns the error message
def createOneAdminTAStudentCourse(useTAs=True, unenrollTA=False, unenrollStudent=False):
    teacher = template_user
    teacher["first_name"] = "Test Teacher"
    teacher["last_name"] = "1"
    teacher["email"] = f"testteacher@gmail.com"
    teacher["role_id"] = 3
    teacher["owner_id"] = 1
    new_teacher = create_user(teacher)
    if type(new_teacher) is type(""):
        return new_teacher
    new_course = create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": new_teacher.user_id,
        "use_tas": useTAs,
        "use_fixed_teams": False
    })
    if type(new_course) is type(""):
        return new_course
    if useTAs:
        ta = template_user
        ta["first_name"] = "Test TA"
        ta["last_name"] = "1"
        ta["email"] = f"testta@gmail.com"
        ta["role_id"] = 4
        ta["owner_id"] = new_teacher.user_id
        new_ta = create_user(ta)
        if type(new_ta) is type(""):
            return new_ta
        if not unenrollTA:
            new_user_course = create_user_course({
                "course_id": new_course.course_id,
                "user_id": new_ta.user_id,
                "role_id": 4
            })
            if type(new_user_course) is type(""):
                return new_user_course
    student = template_user
    student["first_name"] = "Test Student"
    student["last_name"] = "1"
    student["email"] = f"teststudent@gmail.com"
    student["role_id"] = 5
    student["owner_id"] = new_teacher.user_id
    new_student = create_user(student)
    if type(new_student) is type(""):
        return new_student
    if not unenrollStudent:
        new_user_course = create_user_course({
            "course_id": new_course.course_id,
            "user_id": new_student.user_id,
            "role_id": 5
        })
        if type(new_user_course) is type(""):
            return new_user_course
    result = {
        "course_id": new_course.course_id,
        "admin_id": new_teacher.user_id,
        "observer_id": (lambda: new_teacher.user_id, lambda: new_ta.user_id)[useTAs](),
        "user_id": new_student.user_id
    }
    return result

# deleteOneAdminTAStudentCourse()
#   - takes two parameters:
#       - the json object returned from createOneAdminTAStudentCourse()
#       - whether the test course uses tas or not
#   - deletes
#       - the test teacher
#       - the test ta
#       - the test student
#       - the test course
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def deleteOneAdminTAStudentCourse(result, useTAs=True):
    user = delete_user(result["user_id"])
    if type(user) is type(""):
        return user
    if useTAs:
        user = delete_user(result["observer_id"])
        if type(user) is type(""):
            return user
    user = delete_user(result["admin_id"])
    if type(user) is type(""):
        return user
    course = delete_course(result["course_id"])
    if type(course) is type(""):
        return course
    user_course = delete_user_course_by_user_id_course_id(result["user_id"], result["course_id"])
    if type(user_course) is type(""):
        return user_course
    if useTAs:
        user_course = delete_user_course_by_user_id_course_id(result["observer_id"], result["course_id"])
        if type(user_course) is type(""):
            return user_course

# createUsers()
#   - takes four parameters:
#       - the id of the test course
#       - the id of the test teacher
#       - the number of test users to create
#       - the role of the created test users
#           - currently only specifies creating test students and test tas
#   - creates the specified number of test users
#       - assigns the role to each test user
#   - enrolles the created test users into the test course
#   - returns an array of the created test users
#       - unless an error occurs
#           - returns the error message
def createUsers(course_id, teacher_id, number_of_users, role_id=5):
    users = []
    for index in range(1, number_of_users):
        user = template_user
        user["first_name"] = "Test " + (lambda: (lambda: "", lambda: "TA")[role_id==4](), lambda: "Student")[role_id==5]()
        user["last_name"] = f"{index}"
        user["email"] = f"test{(lambda: (lambda: '', lambda: 'TA')[role_id==4](), lambda: 'Student')[role_id==5]()}{index}@gmail.com"
        user["role_id"] = role_id
        user["owner_id"] = teacher_id
        new_user = create_user(user)
        if type(new_user) is type(""):
            return new_user
        new_user_course = create_user_course({
            "user_id": new_user.user_id,
            "course_id": course_id,
            "role_id": role_id
        })
        if type(new_user_course) is type(""):
            return new_user_course
        users.append(new_user)
    return users

# deleteUsers()
#   - takes one parameter:
#       - an array of test users
#   - deletes the specified test users
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def deleteUsers(users):
    for user in users:
        deleted_user = delete_user(user.user_id)
        if type(deleted_user) is type(""):
            return deleted_user

# deleteAllTeamsTeamMembers()
#   - takes one parameter:
#       - the id of the test course
#   - deletes and unenrolls
#       - the test teams enrolled in the test course
#       - the test users assigned to the test teams
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def deleteAllTeamsTeamMembers(course_id):
    teams = get_team_by_course_id(course_id)
    if type(teams) is type(""):
        return teams
    for team in teams:
        team_users = get_team_users_by_team_id(team.team_id)
        if type(team_users) is type(""):
            return team_users
        for team_user in team_users:
            deleted_team_user = delete_team_user(team_user.team_user_id)
            if type(deleted_team_user) is type(""):
                return deleted_team_user
        team = delete_team(team.team_id)
        if type(team) is type(""):
            return team

# filter_users_by_role()
#   - takes two parameter:
#       - an array of test users enrolled in the test course
#       - the id a role
#   - filters the array of test users to only contain test users with the specified role
#   - returns an array of the filtered test users
#       - unless an error occurs
#           - returns the error message
def filter_users_by_role(user_courses, role_id):
    users = []
    for user_course in user_courses:
        user = get_user(user_course.user_id)
        if type(user) is type(""):
            return user
        if user.role_id == role_id:
            users.append(user)
    return users

# taIsAssignedToTeam()
#   - takes two parameters:
#       - an array of test tas
#       - a test team
#   - returns true if one of the tas is assigned to the team, else false
def taIsAssignedToTeam(tas, team):
    isAssigned = False
    for ta in tas:
        if team.observer_id == ta.user_id:
            isAssigned = True
    return isAssigned

# userIsOnlyAssignedToTeams()
#   - takes two parameters:
#       - a test user
#       - an array of test teams
#   - returns true of the test user is assigned to all of the test teams, else false
def userIsOnlyAssignedToTeams(user, teams):
    isAssigned = True
    for team in teams:
        if user != team.observer_id:
            isAssigned = False
    return isAssigned
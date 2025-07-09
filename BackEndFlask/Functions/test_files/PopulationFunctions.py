from models.user import *
from models.course import *
from models.user_course import *
from models.team import *
from models.team_user import *

import pandas as pd
import os
import re
import uuid
import time
import random

# TODO: Need to write a test for both student_import and team_import to make sure
#   that is_valid_email works as should!
def is_valid_email(email):
    return re.fullmatch(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b',
        email
    ) and not ' ' in email and '@' in email

# TODO: Need to write a test for both student_import and team_import to make sure
#   that xlsx file is converted to csv
def xlsx_to_csv(csv_file):
    read_file = pd.read_excel(csv_file)
    sample_files = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
    temp_file = "/temp_"+ uuid.uuid4().hex +".csv"
    read_file.to_csv(sample_files+temp_file, index=None, header=True)
    return sample_files + os.path.join(os.path.sep, temp_file)

# TODO: Need to write a test for both student_import and team_import to make sure
#   that the xlsx file is deleted when there is success and when there are errors!
def delete_xlsx(student_file, is_xlsx):
    if is_xlsx:
        os.remove(student_file)

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

# create_one_admin_course()
#   - takes one parameter:
#       - whether the test course uses TAs or not
#   - creates a test teacher and a test course
#   - returns a json object containing the id of the test teacher and test course
def create_one_admin_course(use_tas):
    teacher = template_user
    teacher["first_name"] = "Test Teacher"
    teacher["last_name"] = "1"
    teacher["email"] = f"testteacher{get_users().__len__()}@gmail.com"
    teacher["owner_id"] = 1
    new_teacher = create_user(teacher)
    new_course = create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": new_teacher.user_id,
        "use_tas": use_tas,
        "use_fixed_teams": False
    })
    result = {
        "user_id": new_teacher.user_id,
        "course_id": new_course.course_id
    }
    return result

# delete_one_admin_course()
#   - takes one parameter:
#       - the json object returned from create_one_admin_course()
#   - deletes the test teacher and test course created by create_one_admin_course()
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def delete_one_admin_course(result):
    delete_user_course_by_user_id_course_id(result["user_id"], result["course_id"])
    delete_course(result["course_id"])
    delete_user(result["user_id"])

# delete_all_users_user_courses()
#   - takes one parameter:
#       - the id of the test course
#   - deletes and unenrolles
#       - all test users enrolled in the test course
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def delete_all_users_user_courses(course_id):
    user_courses = get_user_courses_by_course_id(course_id)
    
    for user_course in user_courses:
        delete_user_course_by_user_id_course_id(user_course.user_id, course_id)
        delete_user(user_course.user_id)

# create_one_admin_ta_student_course()
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
def create_one_admin_ta_student_course(use_tas=True, unenroll_ta=False, unenroll_student=False):
    teacher = template_user
    teacher["first_name"] = "Test Teacher"
    teacher["last_name"] = "1"
    teacher["email"] = f"testTeacher{random.randint(0,100000)}@gmail.com"
    teacher["owner_id"] = 1
    new_teacher = create_user(teacher)

    new_course = create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": new_teacher.user_id,
        "use_tas": use_tas,
        "use_fixed_teams": False
    })
    
    if use_tas:
        ta = template_user
        ta["first_name"] = "Test TA"
        ta["last_name"] = "1"
        ta["email"] = f"testta@gmail.com"
        ta["owner_id"] = new_teacher.user_id
        new_ta = create_user(ta)
        if not unenroll_ta:
            new_user_course = create_user_course({
                "course_id": new_course.course_id,
                "user_id": new_ta.user_id,
                # role_id of 4 is a "TA"
                "role_id": 4
            })

    student = template_user
    student["first_name"] = "Test Student"
    student["last_name"] = "1"
    student["email"] = f"teststudent{random.randint(0, 10000)}@gmail.com"
    student["owner_id"] = new_teacher.user_id
    new_student = create_user(student)
    
    if not unenroll_student:
        new_user_course = create_user_course({
            "course_id": new_course.course_id,
            "user_id": new_student.user_id,
            # role_id of 5 is a "Student"
            "role_id": 5
        })
    result = {
        "course_id": new_course.course_id,
        "admin_id": new_teacher.user_id,
        "observer_id": (lambda: new_teacher.user_id, lambda: new_ta.user_id)[use_tas](),
        "user_id": new_student.user_id
    }
    return result

def create_two_admin_two_ta_student_course(use_tas=True, unenroll_ta=False, unenroll_student=False):
    teacher = template_user
    teacher["first_name"] = "Test Teacher"
    teacher["last_name"] = "1"
    teacher["email"] = f"testteacher@gmail.com"
    teacher["owner_id"] = 1
    new_teacher = create_user(teacher)

    new_course = create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": new_teacher.user_id,
        "use_tas": use_tas,
        "use_fixed_teams": False
    })

    if use_tas:
        ta = template_user
        ta["first_name"] = "Test TA 1"
        ta["last_name"] = "1"
        ta["email"] = f"testta1@gmail.com"
        ta["owner_id"] = new_teacher.user_id
        new_ta = create_user(ta)
        if not unenroll_ta:
            new_user_course = create_user_course({
                "course_id": new_course.course_id,
                "user_id": new_ta.user_id,
                # role_id of 4 is a "TA"
                "role_id": 4
            })
        ta2 = template_user
        ta2["first_name"] = "Test TA 2"
        ta2["last_name"] = "2"
        ta2["email"] = f"testta2@gmail.com"
        ta2["owner_id"] = new_teacher.user_id
        new_ta2 = create_user(ta2)
        if not unenroll_ta:
            new_user_course = create_user_course({
                "course_id": new_course.course_id,
                "user_id": new_ta2.user_id,
                # role_id of 4 is a "TA"
                "role_id": 4
            })

    student = template_user
    student["first_name"] = "Test Student"
    student["last_name"] = "1"
    student["email"] = f"teststudent@gmail.com"
    student["owner_id"] = new_teacher.user_id
    new_student = create_user(student)
    
    if not unenroll_student:
        new_user_course = create_user_course({
            "course_id": new_course.course_id,
            "user_id": new_student.user_id,
            # role_id of 5 is a "Student"
            "role_id": 5
        })

    result = {
        "course_id": new_course.course_id,
        "admin_id": new_teacher.user_id,
        "observer_id": (lambda: new_teacher.user_id, lambda: new_ta.user_id, lambda: new_ta2.user_id)[use_tas](),
        "user_id": new_student.user_id
    }
    return result

# delete_one_admin_ta_student_course()
#   - takes two parameters:
#       - the json object returned from create_one_admin_ta_student_course()
#       - whether the test course uses tas or not
#   - deletes
#       - the test teacher
#       - the test ta
#       - the test student
#       - the test course
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def delete_one_admin_ta_student_course(result, use_tas=True):
    def safe_deletion(x:object, value:object) -> None:
        try:
            x(value)
        except Exception as e:
            if not isinstance(e, ValueError):
                raise e

    safe_deletion(delete_user, result["user_id"])
    if use_tas:
        safe_deletion(delete_user, result["observer_id"])

    delete_course(result["course_id"])
    delete_user(result["admin_id"])

    delete_user_course_by_user_id_course_id(result["user_id"], result["course_id"])
    
    if use_tas:
        delete_user_course_by_user_id_course_id(result["observer_id"], result["course_id"])

# create_users()
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
def create_users(course_id, teacher_id, number_of_users, role_id=5):
    users = []
    for index in range(1, number_of_users):
        user = template_user
        user["first_name"] = "Test " + (lambda: (lambda: "", lambda: "TA")[role_id==4](), lambda: "Student")[role_id==5]()
        user["last_name"] = f"{index}"
        user["email"] = f"test{(lambda: (lambda: '', lambda: 'TA')[role_id==4](), lambda: 'Student')[role_id==5]()}{index}@gmail.com"
        user["owner_id"] = teacher_id
        new_user = create_user(user)
        
        new_user_course = create_user_course({
            "user_id": new_user.user_id,
            "course_id": course_id,
            # Passing the parameter role_id
            "role_id": role_id
        })
        
        users.append(new_user)
    return users

# delete_users()
#   - takes one parameter:
#       - an array of test users
#   - deletes the specified test users
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def delete_users(users):
    for user in users:
        deleted_user = delete_user(user.user_id)

# delete_all_teams_team_members()
#   - takes one parameter:
#       - the id of the test course
#   - deletes and unenrolls
#       - the test teams enrolled in the test course
#       - the test users assigned to the test teams
#   - returns nothing
#       - unless an error occurs
#           - returns the error message
def delete_all_teams_team_members(course_id):
    teams = get_team_by_course_id(course_id)

    for team in teams:
        team_id = team.team_id
        team_users = get_team_users_by_team_id(team_id)

        for team_user in team_users:
            delete_team_user(team_user.team_user_id)

        team = delete_team(team.team_id)

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
        if user_course.role_id == role_id:
            users.append(user)
            
    return users

# ta_is_assigned_to_team()
#   - takes two parameters:
#       - an array of test tas
#       - a test team
#   - returns true if one of the tas is assigned to the team, else false
def ta_is_assigned_to_team(tas, team):
    is_assigned = False
    for ta in tas:
        if team.observer_id == ta.user_id:
            is_assigned = True
    return is_assigned

# user_is_only_assigned_to_teams()
#   - takes two parameters:
#       - a test user
#       - an array of test teams
#   - returns true of the test user is assigned to all of the test teams, else false
def user_is_only_assigned_to_teams(user, teams):
    is_assigned = True
    for team in teams:
        if user != team.observer_id:
            is_assigned = False
    return is_assigned

def delete_test_data(result):
    test_users = get_users_by_owner_id(result["user_id"])
    test_teams = get_team_by_course_id(result["course_id"])
    for team in test_teams:
        team_users = get_team_users_by_team_id(team.team_id)
        for team_user in team_users:
            delete_team_user(team_user.team_user_id)
        delete_team(team.team_id)
    for user in test_users:
        user_course = get_user_course_by_user_id_and_course_id(user.user_id, result["course_id"])
        if user_course is not None:
            delete_user_course(user_course.user_course_id)
        delete_user(user.user_id)
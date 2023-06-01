from models.user import *
from models.course import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_user import *

"""
The functions in this file are used in test_assign_teams.py in order to set up a database
with various different scenarios which the RandomAssignTeams() function would encounter
"""

def populate_user(numOfStudents=20,numOfTAs=0):
    if numOfStudents > 900:
        numOfStudents = 900
    if numOfTAs > 20:
        numOfTAs = 10
    if numOfStudents < 0:
        numOfStudents = 0
    if numOfTAs < 0:
        numOfTAs = 0
    create_user({
        "first_name": "Teacher1",
        "last_name": "Vera-Espinoza", 
        "email": "Teacher1@gmail.com",               
        "password": "Skillbuilder", 
        "role_id": 3,
        "lms_id": 1, 
        "consent": None, 
        "owner_id": 1
    })
    students = []
    for x in range(numOfStudents):
        lnames = ["Palomo", "Lipe", "Neema", "Duncan", "Lugo"]
        students.append({
            "first_name": f"Student{x+1}",
            "last_name": lnames[x%5],
            "email": f"Student{x+1}@gmail.com",
            "password": "Skillbuilder",
            "role_id": 5,
            "lms_id": x+2,
            "consent": None,
            "owner_id": 2
        })
    tas = []
    for x in range(numOfTAs):
        tas.append({
            "first_name": f"TA{x+1}",
            "last_name": "Godinez",
            "email": f"TA{x+1}@gmail.com",
            "password": "Skillbuilder",
            "role_id": 4,
            "lms_id": 999-x,
            "consent": None,
            "owner_id": 2
        })
    for i in range(numOfStudents):
        create_user(students[i])
    for i in range(numOfTAs):
        create_user(tas[i])

def create_testcourse(useTAs=False):
    create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": 2,
        "use_tas": useTAs
    })

def create_test_user_course(numOfStudents, usesTAs=False, numOfTAs=0):
    teacher_id = 2
    course_id = 1
    populate_user(numOfStudents, numOfTAs)
    if usesTAs:
        create_testcourse(True)
    else:
        create_testcourse(False)
    counter = 3
    # The first user added, the teacher, has a user_id of 2.
    # The second user added, the first student, has a user_id of 3.
    while counter != numOfStudents+3:
        create_user_course({
            "user_id": counter,
            "course_id": course_id
        })
        counter += 1
    # Continue adding users based on the ID offset.
    while counter != numOfStudents+numOfTAs+3:
        create_itc({
            "owner_id": teacher_id,
            "ta_id": counter,
            "course_id": course_id
        })
        counter += 1
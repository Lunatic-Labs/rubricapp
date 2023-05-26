from models.user import *
from models.course import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_user import *

# def populate_user(studentsNum,tasNum):
def populate_user(studentsNum=20,tasNum=0):
    if studentsNum > 900:
        studentsNum = 900
    if tasNum > 10:
        tasNum = 10
    if studentsNum < 1:
        studentsNum = 1
    if tasNum < 0:
        tasNum = 0
    create_user({
        "first_name": "Teacher1",
        "last_name": "Vera-Espinoza", 
        "email": "Teacher1@gmail.com",               
        "password": "Skillbuilder", 
        "role_id": 3,
        "lms_id": 0, 
        "consent": None, 
        "owner_id": 1
    })
    students = []
    for x in range(studentsNum):
        lnames = ["Palomo", "Lipe", "Neema", "Duncan", "Lugo"]
        students.append({
            "first_name": f"Student{x+1}",
            "last_name": lnames[x%5],
            "email": f"Student{x+1}@gmail.com",
            "password": "Skillbuilder",
            "role_id": 5,
            "lms_id": x+1,
            "consent": None,
            "owner_id": 1
        })
    tas = []
    for x in range(tasNum):
        tas.append({
            "first_name": f"TA{x+1}",
            "last_name": "Godinez",
            "email": f"TA{x+1}@gmail.com",
            "password": "Skillbuilder",
            "role_id": 4,
            "lms_id": 999-x,
            "consent": None,
            "owner_id": 1
        })
    for i in range(studentsNum):
        create_user(students[i])
    for i in range(tasNum):
        create_user(tas[i])

def create_testcourse(useTAs=False):
    create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": 1,
        "use_tas": useTAs
    })

def create_test_user_course(studentsNum, usesTAs=False, tasNum=0):
    teacher_id = 1
    course_id = 1

    populate_user(studentsNum, tasNum)

    if usesTAs:
        create_testcourse(True)
    else:
        create_testcourse(False)
    

    counter = 2
    # The first user added, the teacher, has a user_id of 1.
    # The second user added, the first student, has a user_id of 2.
    while counter != studentsNum+2:
        create_user_course({
            "user_id": counter,
            "course_id": course_id
        })
        counter += 1
    # Continue adding users based on the ID offset.
    while counter != studentsNum+tasNum+2:
        create_itc({
            "owner_id": teacher_id,
            "ta_id": counter,
            "course_id": course_id
        })
        counter += 1
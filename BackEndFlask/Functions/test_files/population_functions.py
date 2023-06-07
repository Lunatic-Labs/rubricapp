from models.user import create_user
from models.course import create_course
from models.user_course import create_user_course
from models.instructortacourse import create_instructor_ta_course

"""
populate_user() takes two parameters:
    - number of total students (numOfStudents)
    - number of total TAs (numOfTAs)
    By default:
        - the total number of students is 20
        - the total number of TAs is 0
populate_user() ensures that:
    - the total number of students (numOfStudents) is a value between 0 and 900 inclusively
    - the total number of TAs (numOfTAs) is a value between 0 and 20 inclusively
        - If the total number of TAs (numOfTAs) is greater than 20, then set the total to 10.
populate_user() creates a test admin, test students, and test TAs.
"""
def populate_user(numOfStudents=20,numOfTAs=0):
    numOfStudents = (lambda: 900, lambda: numOfStudents)[numOfStudents < 900]()
    numOfStudents = (lambda: numOfStudents, lambda: 0)[numOfStudents < 0]()
    numOfTAs = (lambda: 10, lambda: numOfTAs)[numOfTAs <= 20]()
    numOfTAs = (lambda: numOfTAs, lambda: 0)[numOfTAs < 0]()
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
    lnames = ["Palomo", "Lipe", "Neema", "Duncan", "Lugo"]
    for student in range(numOfStudents):
        create_user({
            "first_name": f"Student{student+1}",
            "last_name": lnames[student%5],
            "email": f"Student{student+1}@gmail.com",
            "password": "Skillbuilder",
            "role_id": 5,
            "lms_id": student+2,
            "consent": None,
            "owner_id": 2
        })
    for TA in range(numOfTAs):
        create_user({
            "first_name": f"TA{TA+1}",
            "last_name": "Godinez",
            "email": f"TA{TA+1}@gmail.com",
            "password": "Skillbuilder",
            "role_id": 4,
            "lms_id": 999-TA,
            "consent": None,
            "owner_id": 2
        })

"""
create_testcourse() takes one parameter:
    - whether or not TAs are used (useTAs)
    By default:
        - the test course does not use TAs (usesTAs=False)
create_testcourse() creates a test course.
"""
def create_testcourse(useTAs=False):
    create_course({
        "course_number": "CRS001",
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": 2,
        "use_tas": useTAs,
        "use_fixed_teams": False
    })

"""
create_test_user_course() takes three parameters:
    - the total number of students (numOfStudents)
    - whether the test course uses TAs or not (usesTAs)
    - the total number of TAs (numOfTAs)
    By default:
        - the test course does not use TAs (usesTAs=False)
        - the total number of TAs is 0 (numOfTAs=0)
create_test_user_course() calls populate_user() with the two parameters:
    - the total number of students (numOfStudents)
    - the total number of TAs (numOfTAs)
create_test_user_course() calls create_testcourse() with the parameter:
    - whether the test course uses TAs (usesTAs)
create_test_user_course() enrolls the test students to the hardcoded course_id of 1
create_test_user_course() enrolls the test TAs and test Admin to the hardcoded course_id of 1
"""
def create_test_user_course(numOfStudents, usesTAs=False, numOfTAs=0):
    populate_user(numOfStudents, numOfTAs)
    create_testcourse(usesTAs)
    counter = 3
    # The first user added, the teacher, has a user_id of 2.
    # The second user added, the first student, has a user_id of 3.
    while counter != numOfStudents+3:
        create_user_course({
            "user_id": counter,
            "course_id": 1
        })
        counter += 1
    # Continue adding users based on the ID offset.
    while counter != numOfStudents+numOfTAs+3:
        create_instructor_ta_course({
            "owner_id": 2,
            "ta_id": counter,
            "course_id": 1
        })
        counter += 1
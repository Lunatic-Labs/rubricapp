from models.user import *
from models.course import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_user import *
from models.role import load_existing_roles

def populate_user(studentsNum=20,tasNum=0):
    if studentsNum>20:
        studentsNum=20
    if tasNum>10:
        tasNum=10
    if studentsNum<1:
        studentsNum=1
    if tasNum<0:
        tasNum=0

    create_user({"first_name": "Teacher1"  , "last_name": "Vera-Espinoza" , "email": "Teacher1@gmail.com"  , "password": "Skillbuilder" , "role_id": 3 ,"lms_id": 0  , "consent": None , "owner_id":1 })

    students  = [ 
        {"first_name":"Student1" ,  "last_name":"Palomo",  "email":"Student1@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":1 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student2" ,  "last_name":"Palomo",  "email":"Student2@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":2 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student3" ,  "last_name":"Palomo",  "email":"Student3@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":3 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student4" ,  "last_name":"Palomo",  "email":"Student4@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":4 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student5" ,  "last_name":"Lipe"  ,  "email":"Student5@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":5 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student6" ,  "last_name":"Lipe"  ,  "email":"Student6@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":6 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student7" ,  "last_name":"Lipe"  ,  "email":"Student7@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":7 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student8" ,  "last_name":"Lipe"  ,  "email":"Student8@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":8 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student9" ,  "last_name":"Neema" ,  "email":"Student9@gmail.com" ,  "password":"Skillbuilder",  "role_id":5,  "lms_id":9 ,  "consent":None,  "owner_id":1 },
        {"first_name":"Student10",  "last_name":"Neema" ,  "email":"Student10@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":10,  "consent":None,  "owner_id":1 },
        {"first_name":"Student11",  "last_name":"Neema" ,  "email":"Student11@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":11,  "consent":None,  "owner_id":1 },
        {"first_name":"Student12",  "last_name":"Neema" ,  "email":"Student12@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":12,  "consent":None,  "owner_id":1 },
        {"first_name":"Student13",  "last_name":"Duncan",  "email":"Student13@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":13,  "consent":None,  "owner_id":1 },
        {"first_name":"Student14",  "last_name":"Duncan",  "email":"Student14@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":14,  "consent":None,  "owner_id":1 },
        {"first_name":"Student15",  "last_name":"Duncan",  "email":"Student15@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":15,  "consent":None,  "owner_id":1 },
        {"first_name":"Student16",  "last_name":"Duncan",  "email":"Student16@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":16,  "consent":None,  "owner_id":1 },
        {"first_name":"Student17",  "last_name":"Lugo"  ,  "email":"Student17@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":17,  "consent":None,  "owner_id":1 },
        {"first_name":"Student18",  "last_name":"Lugo"  ,  "email":"Student18@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":18,  "consent":None,  "owner_id":1 },
        {"first_name":"Student19",  "last_name":"Lugo"  ,  "email":"Student19@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":19,  "consent":None,  "owner_id":1 },
        {"first_name":"Student20",  "last_name":"Lugo"  ,  "email":"Student20@gmail.com",  "password":"Skillbuilder",  "role_id":5,  "lms_id":20,  "consent":None,  "owner_id":1 }
    ]

    tas = [
        {"first_name":"TA1" ,  "last_name":"Godinez",  "email":"TA1@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":21,  "consent":None,  "owner_id":1 },
        {"first_name":"TA2" ,  "last_name":"Godinez",  "email":"TA2@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":22,  "consent":None,  "owner_id":1 },
        {"first_name":"TA3" ,  "last_name":"Godinez",  "email":"TA3@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":23,  "consent":None,  "owner_id":1 },
        {"first_name":"TA4" ,  "last_name":"Godinez",  "email":"TA4@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":24,  "consent":None,  "owner_id":1 },
        {"first_name":"TA5" ,  "last_name":"Godinez",  "email":"TA5@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":25,  "consent":None,  "owner_id":1 },
        {"first_name":"TA6" ,  "last_name":"Godinez",  "email":"TA6@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":26,  "consent":None,  "owner_id":1 },
        {"first_name":"TA7" ,  "last_name":"Godinez",  "email":"TA7@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":27,  "consent":None,  "owner_id":1 },
        {"first_name":"TA8" ,  "last_name":"Godinez",  "email":"TA8@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":28,  "consent":None,  "owner_id":1 },
        {"first_name":"TA9" ,  "last_name":"Godinez",  "email":"TA9@gmail.com" ,  "password":"Skillbuilder",  "role_id":4,  "lms_id":29,  "consent":None,  "owner_id":1 },
        {"first_name":"TA10",  "last_name":"Godinez",  "email":"TA10@gmail.com",  "password":"Skillbuilder",  "role_id":4,  "lms_id":30,  "consent":None,  "owner_id":1 }
    ]

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
        "use_tas": useTAs})

def create_test_user_course(studentsNum=20, tasNum=10):
    if studentsNum>20:
        studentsNum=20
    if tasNum>10:
        tasNum=10
    if studentsNum<1:
        studentsNum=1
    if tasNum<0:
        tasNum=0

    teacher_id = 1
    course_id = 1

    populate_user(studentsNum, tasNum)

    if tasNum:
        create_testcourse(True)
    else:
        create_testcourse()
    

    counter=2
    while counter!=studentsNum+2: # Teacher is ID 1. First student start at ID 2
        create_user_course({"user_id":counter, "course_id":course_id})
        counter+=1
    
    while counter != studentsNum+tasNum+2: #pick up from where left off AND ID offset
        create_itc({"owner_id":teacher_id, "ta_id":counter, "course_id":course_id})
        counter+=1
    
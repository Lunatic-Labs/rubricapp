from core import app, db
from models.schemas import *
from models.role import get_roles, load_existing_roles
from models.rubric import get_rubrics
from models.category import get_categories
from models.observable_characteristics import get_observable_characteristics
from models.suggestions import get_suggestions
from models.loadExistingRubrics import *
from models.user import *
from models.course import *
from models.user_course import *
from models.team import *
from models.team_user import *
from models.assessment_task import *
from controller.security.blacklist import startRedis
from models.feedback import *
import time
import os
import sys

sleepTime = 0

print("[dbcreate] starting...")
time.sleep(sleepTime)

with app.app_context():
    print("[dbcreate] attempting to create new db...")
    time.sleep(sleepTime)
    try:
        db.drop_all()
        db.create_all()
        startRedis()
    except Exception as e:
        print(f"[dbcreate] an error ({e}) occured with db.create_all()")
        print("[dbcreate] exiting...")
        os.abort()
    print("[dbcreate] successfully created new db")
    time.sleep(sleepTime)
    if (get_rubrics().__len__() == 0):
        print("[dbcreate] attempting to load existing rubrics...")
        time.sleep(sleepTime)
        load_existing_rubrics()
        print("[dbcreate] successfully loaded existing rubrics...")
        time.sleep(sleepTime)
    if (get_categories().__len__() == 0):
        print("[dbcreate] attempting to load exisiting categories...")
        time.sleep(sleepTime)
        load_existing_categories()
        print("[dbcreate] successfully loaded exisiting categories...")
        time.sleep(sleepTime)
    if (get_observable_characteristics().__len__() == 0):
        print("[dbcreate] attempting to load exisiting observable characteristics...")
        time.sleep(sleepTime)
        load_existing_observable_characteristics()
        print("[dbcreate] successfully loaded existing observable characteristics")
        time.sleep(sleepTime)
    if (get_suggestions().__len__() == 0):
        print("[dbcreate] attempting to load exisiting suggestions...")
        time.sleep(sleepTime)
        load_existing_suggestions()
        print("[dbcreate] successfully loaded existing suggestions")
    if (get_roles().__len__() == 0):
        print("[dbcreate] attempting to load existing roles...")
        time.sleep(sleepTime)
        load_existing_roles()
        print("[dbcreate] successfully loaded existing roles")
        time.sleep(sleepTime)
    if (get_users().__len__() == 0):
        print("[dbcreate] attempting to load SuperAdminUser...")
        time.sleep(sleepTime)
        load_SuperAdminUser()
        print("[dbcreate] successfully loaded SuperAdminUser")
        time.sleep(sleepTime)
    if len(sys.argv) == 2 and sys.argv[1] == "demo":
        if (get_users().__len__() == 1):
            print("[dbcreate] attempting to load demo Admin...")
            time.sleep(sleepTime)
            load_demo_admin()
            print("[dbcreate] successfully loaded demo Admin")
            time.sleep(sleepTime)
            print("[dbcreate] attempting to load demo TA/Instructor...")
            time.sleep(sleepTime)
            load_demo_ta_instructor()
            print("[dbcreate] successfully loaded demo TA/Instructor")
            time.sleep(sleepTime)
            print("[dbcreate] attempting to load demo Student...")
            time.sleep(sleepTime)
            load_demo_student()
            print("[dbcreate] successfully loaded demo Student")
            time.sleep(sleepTime)
        if (get_courses().__len__() == 0):
            print("[dbcreate] attempting to load demo Course...")
            time.sleep(sleepTime)
            load_demo_course()
            print("[dbcreate] successfully loaded demo Course")
            time.sleep(sleepTime)
        if (get_user_courses().__len__() == 0):
            print("[dbcreate] attempting to load demo UserCourse Admin...")
            time.sleep(sleepTime)
            load_demo_user_course_admin()
            print("[dbcreate] successfully loaded demo UserCourse Admin")
            time.sleep(sleepTime)
            print("[dbcreate] attempting to load demo UserCourse TA/Instructor...")
            time.sleep(sleepTime)
            load_demo_user_course_ta_instructor()
            print("[dbcreate] successfully loaded demo UserCourse TA/Instructor")
            time.sleep(sleepTime)
            print("[dbcreate] attempting to load demo CourseStudent...")
            time.sleep(sleepTime)
            load_demo_user_course_student()
            print("[dbcreate] successfully loaded demo CourseStudent")
            time.sleep(sleepTime)
        if (get_teams().__len__() == 0):
            print("[dbcreate] attempting to load demo Team...")
            time.sleep(sleepTime)
            load_demo_team()
            print("[dbcreate] successfully loaded demo Team")
            time.sleep(sleepTime)
        if (get_team_users().__len__() == 0):
            print("[dbcreate] attempting to load demo TeamUser...")
            time.sleep(sleepTime)
            load_demo_team_user()
            print("[dbcreate] successfully loaded demo TeamUser")
            time.sleep(sleepTime)
        if (get_assessment_tasks().__len__() == 0):
            print("[dbcreate] attempting to load demo AssessmentTask...")
            time.sleep(sleepTime)
            load_demo_admin_assessmentTask()
            print("[dbcreate] successfully loaded demo AssessmentTask")
            time.sleep(sleepTime)
        if(get_feedback().__len__()==0):
            print("[dbcreate] attempting to load demo Feedback...")
            time.sleep(sleepTime)
            load_demo_feedback()
            print("[dbcreate] successfully loaded demo Feedback")
            time.sleep(sleepTime)

    print("[dbcreate] exiting...")

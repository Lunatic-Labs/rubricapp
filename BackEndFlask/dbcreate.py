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
from models.completed_assessment import * 
from controller.security.blacklist import start_redis
from sqlalchemy import create_engine, text
from models.feedback import *
from sqlalchemy import text, inspect
import time
import os
import sys
import subprocess

sleep_time = 0

print("[dbcreate] starting...")
time.sleep(sleep_time)

MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')

# Connect without specifying DB
engine = create_engine(f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/")

with engine.connect() as conn:
    conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}"))
    conn.commit()


with app.app_context():
    print("[dbcreate] attempting to create new db...")
    print("[dbcreate] attempting to drop all tables if populated...")
    if len(sys.argv) > 1 and sys.argv[1] == "reset_db":
        try:
            # Drop all tables
            db.session.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
            db.reflect()
            db.drop_all()
            db.session.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
            db.session.commit()
            print("[dbcreate] successfully dropped all tables")
        except Exception as e:
            print(f"[dbcreate] an error ({e}) occurred while dropping all tables")
            print("[dbcreate] exiting...")
    time.sleep(sleep_time)
    try:
        inspector = inspect(db.engine)
        table_names = inspector.get_table_names()
        if table_names:
            subprocess.run(["flask db upgrade"], shell=True, check=True)
        else:
            db.create_all()
            subprocess.run(["flask db stamp head"], shell=True, check=True)


        is_docker = os.getenv('DOCKER_BUILD', 'false').lower() == 'true'
        if not is_docker:
            start_redis()
    except Exception as e:
        print(f"[dbcreate] an error ({e}) occured with db.create_all()")
        print("[dbcreate] exiting...")
        raise e
    print("[dbcreate] successfully created new db")
    time.sleep(sleep_time)
    if (get_roles().__len__() == 0):
        print("[dbcreate] attempting to load existing roles...")
        time.sleep(sleep_time)
        load_existing_roles()
        print("[dbcreate] successfully loaded existing roles")
        time.sleep(sleep_time)
    if(get_users().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminUser...")
        time.sleep(sleep_time)
        load_SuperAdminUser()
        print("[dbcreate] successfully loaded SuperAdminUser")
        time.sleep(sleep_time)
    if(get_rubrics().__len__()==0):
        print("[dbcreate] attempting to load existing rubrics...")
        time.sleep(sleep_time)
        load_existing_rubrics()
        print("[dbcreate] successfully loaded existing rubrics...")
        time.sleep(sleep_time)
    if(get_categories().__len__()==0):
        print("[dbcreate] attempting to load exisiting categories...")
        time.sleep(sleep_time)
        load_existing_categories()
        print("[dbcreate] successfully loaded exisiting categories...")
        time.sleep(sleep_time)
    if(get_observable_characteristics().__len__()==0):
        print("[dbcreate] attempting to load exisiting observable characteristics...")
        time.sleep(sleep_time)
        load_existing_observable_characteristics()
        print("[dbcreate] successfully loaded existing observable characteristics")
        time.sleep(sleep_time)
    if(get_suggestions().__len__()==0):
        print("[dbcreate] attempting to load exisiting suggestions...")
        time.sleep(sleep_time)
        load_existing_suggestions()
        print("[dbcreate] successfully loaded existing suggestions")
    if len(sys.argv) == 2 and sys.argv[1]=="demo":
        if(get_users().__len__()==1):
            print("[dbcreate] attempting to load demo Admin...")
            time.sleep(sleep_time)
            load_demo_admin()
            print("[dbcreate] successfully loaded demo Admin")
            time.sleep(sleep_time)
            print("[dbcreate] attempting to load demo TA/Instructor...")
            time.sleep(sleep_time)
            load_demo_ta_instructor()
            print("[dbcreate] successfully loaded demo TA/Instructor")
            time.sleep(sleep_time)
            print("[dbcreate] attempting to load demo Student...")
            time.sleep(sleep_time)
            load_demo_student()
            print("[dbcreate] successfully loaded demo Student")
            time.sleep(sleep_time)
        if(get_courses().__len__()==0):
            print("[dbcreate] attempting to load demo Course...")
            time.sleep(sleep_time)
            load_demo_course()
            print("[dbcreate] successfully loaded demo Course")
            time.sleep(sleep_time)
        if(get_user_courses().__len__()==0):
            print("[dbcreate] attempting to load demo UserCourse Admin...")
            time.sleep(sleep_time)
            load_demo_user_course_admin()
            print("[dbcreate] successfully loaded demo UserCourse Admin")
            time.sleep(sleep_time)
            print("[dbcreate] attempting to load demo UserCourse TA/Instructor...")
            time.sleep(sleep_time)
            load_demo_user_course_ta_instructor()
            print("[dbcreate] successfully loaded demo UserCourse TA/Instructor")
            time.sleep(sleep_time)
            print("[dbcreate] attempting to load demo CourseStudent...")
            time.sleep(sleep_time)
            load_demo_user_course_student()
            print("[dbcreate] successfully loaded demo CourseStudent")
            time.sleep(sleep_time)
        if(get_teams().__len__()==0):
            print("[dbcreate] attempting to load demo Team...")
            time.sleep(sleep_time)
            load_demo_team()
            print("[dbcreate] successfully loaded demo Team")
            time.sleep(sleep_time)
        if(get_team_users().__len__()==0):
            print("[dbcreate] attempting to load demo TeamUser...")
            time.sleep(sleep_time)
            load_demo_team_user()
            print("[dbcreate] successfully loaded demo TeamUser")
            time.sleep(sleep_time)
        if(get_assessment_tasks().__len__()==0):
            print("[dbcreate] attempting to load demo AssessmentTask...")
            time.sleep(sleep_time)
            load_demo_admin_assessment_task()
            print("[dbcreate] successfully loaded demo AssessmentTask")
            time.sleep(sleep_time)
        if (get_completed_assessments().__len__() == 0):
            print("[dbcreate] attempting to load demo completed assessments...")
            time.sleep(sleep_time)
            load_demo_completed_assessment()
            print("[dbcreate] successfully loaded demo completed assessments")
            time.sleep(sleep_time)
        if(get_feedback().__len__()==0):
            print("[dbcreate] attempting to load demo Feedback...")
            time.sleep(sleep_time)
            load_demo_feedback()
            print("[dbcreate] successfully loaded demo Feedback")
            time.sleep(sleep_time)

    print("[dbcreate] exiting...")

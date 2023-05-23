from core import app, db
from models.schemas import *
from models.user import *
from models.course import get_courses, load_SuperAdminCourse
from models.rubric import get_rubrics
from models.category import get_categories
from models.ratings import get_ratings
from models.oc import get_OCs
from models.suggestions import get_sfis
from models.loadExistingRubrics import *
from models.role import get_roles, load_existing_roles
from models.assessment_task import get_assessment_tasks, load_SuperAdminAssessmentTask
from bulkupload.studentImport import studentcsvToDB
import time
import os

sleepTime = 0.5

print("[dbcreate] starting...")
time.sleep(sleepTime)

with app.app_context():
    print("[dbcreate] attempting to create new db...")
    time.sleep(sleepTime)
    try:
        db.create_all()
    except Exception as e:
        print(f"[dbcreate] an error ({e}) occured with db.create_all()")
        print("[dbcreate] exiting...")
        os.abort()
    print("[dbcreate] successfully created new db")
    time.sleep(sleepTime)
    if(get_rubrics().__len__()==0):
        print("[dbcreate] attempting to load existing rubrics...")
        time.sleep(sleepTime)
        load_existing_rubrics()
        print("[dbcreate] successfully loaded existing rubrics...")
        time.sleep(sleepTime)
    if(get_categories().__len__()==0):
        print("[dbcreate] attempting to load exisiting categories...")
        time.sleep(sleepTime)
        load_existing_categories()
        print("[dbcreate] successfully loaded exisiting categories...")
        time.sleep(sleepTime)
    if(get_ratings().__len__()==0):
        print("[dbcreate] attempting to load existing ratings...")
        time.sleep(sleepTime)
        load_existing_ratings()
        print("[dbcreate] successfully loaded existing ratings")
    if(get_OCs().__len__()==0):
        print("[dbcreate] attempting to load exisiting observable characteristics...")
        time.sleep(sleepTime)
        load_existing_observable_characteristics()
        print("[dbcreate] successfully loaded existing observable characteristics")
        time.sleep(sleepTime)
    if(get_sfis().__len__()==0):
        print("[dbcreate] attempting to load exisiting suggestions...")
        time.sleep(sleepTime)
        load_existing_suggestions()
        print("[dbcreate] successfully loaded existing suggestions")
    if(get_roles().__len__()==0):
        print("[dbcreate] attempting to load existing roles...")
        time.sleep(sleepTime)
        load_existing_roles()
        print("[dbcreate] successfully loaded existing roles")
        time.sleep(sleepTime)
    if(get_users().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminUser...")
        time.sleep(sleepTime)
        load_SuperAdminUser()
        print("[dbcreate] successfully loaded SuperAdminUser")
        time.sleep(sleepTime)
    if(get_courses().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminCourse...")
        time.sleep(sleepTime)
        load_SuperAdminCourse()
        print("[dbcreate] successfully loaded SuperAdminCourse")
        time.sleep(sleepTime)
    if(get_assessment_tasks().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminAssessmentTask...")
        time.sleep(sleepTime)
        load_SuperAdminAssessmentTask()
        print("[dbcreate] successfully loaded SuperAdminAssessmentTask")
        time.sleep(sleepTime)
    print("[dbcreate] exiting...")
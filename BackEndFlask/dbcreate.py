from core import app, db
from models.schemas import *
from models.rubric import get_rubrics
from models.category import get_categories
from models.oc import get_OCs
from models.suggestions import get_sfis
from models.rubric import get_rubrics
from models.category import get_categories
from models.oc import get_OCs
from models.suggestions import get_sfis
from models.loadExistingRubrics import *
from models.role import get_roles, load_existing_roles
# from bulkupload.studentImport import studentcsvToDB
import time
import os

sleepTime = 0.5

print("[dbcreate] starting...")
time.sleep(sleepTime)
from models.role import get_roles, load_existing_roles
# from bulkupload.studentImport import studentcsvToDB
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
        # dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "testStudent1.csv")
        # studentcsvToDB(dir)
        print("[dbcreate] successfully loaded existing roles")
        time.sleep(sleepTime)
    print("[dbcreate] exiting...")
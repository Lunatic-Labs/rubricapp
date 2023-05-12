from core import app, db
from models.schemas import *
from models.user import *
from models.loadExistingRubrics import *
from models.role import load_existing_roles
import os
from bulkupload.studentImport import studentcsvToDB

with app.app_context():
    db.create_all()
    load_existing_rubrics()
    load_existing_categories()
    load_existing_observable_characteristics()
    load_existing_suggestions()
    load_existing_roles()
    dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "SkillBuilderTest.csv")
    studentcsvToDB(dir)
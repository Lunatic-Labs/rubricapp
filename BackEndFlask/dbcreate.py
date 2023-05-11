from core import app, db
import os
from bulkupload.studentImport import studentcsvToDB

with app.app_context():
    db.create_all()
    dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "testStudent1.csv")
    studentcsvToDB(dir)
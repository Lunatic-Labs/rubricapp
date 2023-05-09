from core import app, db
from models.loadExistingRubrics import *

with app.app_context():
    db.create_all()
    load_existing_rubrics()
    load_existing_categories()
    load_existing_observable_characteristics()
    load_existing_suggestions()
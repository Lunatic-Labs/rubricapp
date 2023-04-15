from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import User

#create the extension
db = SQLAlchemy()

# create the app
app = Flask(__name__)

# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE _URI"] = "sqlite://project.db"

# initialize the app with the extention
db.init_app(app)

# creates all the tables

with app.app_context():
    db.create_all()
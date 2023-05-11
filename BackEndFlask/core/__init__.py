from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask_login import UserMixin
import os
import sys
import platform
from django.template import Library

files_dir = "."
register = Library()
db = SQLAlchemy()
os.chdir(".")
base_directory = os.getcwd()
home_directory = base_directory
base_directory = base_directory + "/users"

def create_app():
    if len(sys.argv) <= 1:
        print("Requires argument: path to put files and database (suggestion is `pwd` when already in directory containing app.py)")
        sys.exit(1)
    files_dir = sys.argv[1]
    app = Flask(__name__)
    from controller import bp
    app.register_blueprint(bp, url_prefix='/api')
    app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(files_dir)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    initialize_extensions(app)
    return app

def initialize_extensions(app):
    db.init_app(app)
app = create_app()
# if len(sys.argv) == 2 and sys.argv[1]=="bulkupload_test":
#     studentcsvToDB("BackEndFlask/bulkupload/sample_csv/testStudent1.csv")
#     sys.exit(1)
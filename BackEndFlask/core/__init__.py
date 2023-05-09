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
os.chdir(".")
base_directory = os.getcwd()
home_directory = base_directory
base_directory = base_directory + "/users"
if len(sys.argv) <= 1:
    print("Requires argument: path to put files and database (suggestion is `pwd` when already in directory containing app.py)")
    sys.exit(1)
files_dir = sys.argv[1]
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(files_dir)
db = SQLAlchemy(app)
db.init_app(app)
from controller import bp
app.register_blueprint(bp, url_prefix='/api')
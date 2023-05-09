from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask_login import UserMixin
import os
import sys
import platform
from django.template import Library
from models.tests import main

files_dir = "."
register = Library()
db = SQLAlchemy()
os.chdir(".")
base_directory = os.getcwd()
home_directory = base_directory
base_directory = base_directory + "/users"


def create_app(test_config=None):
    if len(sys.argv) <= 1:
        print("Requires argument: path to put files and database (suggestion is `pwd` when already in directory containing app.py)")
        sys.exit(1)
    if len(sys.argv) == 2 and sys.argv[1]=="test":
        main()
        sys.exit(1)

    files_dir = sys.argv[1]
    app = Flask(__name__, instance_relative_config=True)
    if (test_config is None):
        app.config.from_pyfile('config.py', silent = True)
    else:
        app.config.from_pyfile('config.py', silent=True)
        app.config.update(test_config)
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
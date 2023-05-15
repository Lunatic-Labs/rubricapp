from flask import Flask, render_template, redirect, url_for, request, send_file, jsonify, session
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from flask_wtf.file import FileField, FileAllowed, FileRequired
import wtforms.validators as validators
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
#from selenium import webdriver;
from filelock import Timeout, FileLock

from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user, utils
#import flask_login
import os
import subprocess
# shutil used to delete whole directory(folder)
import shutil
import openpyxl
from openpyxl import load_workbook
import datetime
import uuid

import json
import sys
#from fpdf import FPDF, HTMLMixin

import platform
from django.core.exceptions import ValidationError
from django.utils.safestring import mark_safe
from django.template import Library
import time
import json
import smtplib
from email.message import EmailMessage
from concurrent.futures import ThreadPoolExecutor, as_completed

files_dir = "."
register = Library()
db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'login'

# SET THE BASE DIRECTORY
os.chdir(".")
base_directory = os.getcwd()
home_directory = base_directory
base_directory = base_directory + "/users"

# from dataBase import *
def create_app():

    # file directory
    # requirement of two arguments: file address of app.py and fire address of root directory.
    if len(sys.argv) > 1:
        files_dir = sys.argv[1]
    # elif platform.node() in ['rubric.cs.uiowa.edu', 'rubric-dev.cs.uiowa.edu']:
    #     files_dir = "/var/www/wsgi-scripts/rubric"
    else:
        print(
            "Requires argument: path to put files and database (suggestion is `pwd` when already in directory containing app.py)")
        sys.exit(1)

    app = Flask(__name__)
    from controller import bp
    app.register_blueprint(bp, url_prefix='/api')
    app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
    if platform.node() in ['rubric.cs.uiowa.edu', 'rubric-dev.cs.uiowa.edu']:
        # dbpass = None
        # with open ("{}/dbpass".format(files_dir), 'r') as f:
        #     dbpass = f.readline().rstrip()

        # dbuser = None
        # with open ("{}/dbuser".format(files_dir), 'r') as f:
        #     dbuser = f.readline().rstrip()

        # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://{0}:{1}@127.0.0.1/rubric'.format(dbuser, dbpass)
        pass
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(files_dir)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    initialize_extensions(app)
    return app


def initialize_extensions(app):
    # bootstrap = Bootstrap(app)
    db.init_app(app)
    login_manager.init_app(app)

app = create_app()

# import models.evaluation
# import models.permission
# import models.project
# # import BackEndFlask.functions as functions
# # import BackEndFlask.pages as pages
# # import BackEndFlask.operations as operations
# import functions as functions
# import pages as pages
# import operations as operations
# from tests import *
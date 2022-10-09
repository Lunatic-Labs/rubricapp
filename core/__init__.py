from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask import Flask, render_template, redirect, url_for, request, send_file, jsonify
from flask_wtf.file import FileField, FileAllowed, FileRequired
from flask_sqlalchemy import SQLAlchemy
from filelock import Timeout, FileLock
from flask_bootstrap import Bootstrap
from fpdf import FPDF, HTMLMixin
from flask_wtf import FlaskForm

from werkzeug.security import generate_password_hash, check_password_hash
from wtforms import StringField, PasswordField, BooleanField
import wtforms.validators as validators

from django.utils.safestring import mark_safe
from django.template import Library

from concurrent.futures import ThreadPoolExecutor, as_completed
from email.message import EmailMessage
from openpyxl import load_workbook
from xml.dom import ValidationErr

import subprocess
import platform
import datetime
import openpyxl
import smtplib
# shutil used to delete whole directory(folder)
import shutil
import uuid
import json
import time
import json
import sys
import os

# from classes import LoginForm, RegisterForm

register = Library()

# file directory
# requirement of two arguments: file address of app.py and fire address of root directory.
files_dir = None
if len(sys.argv) > 1:
    files_dir = sys.argv[1]
elif platform.node() in ['rubric.cs.uiowa.edu', 'rubric-dev.cs.uiowa.edu']:
    files_dir = "/var/www/wsgi-scripts/rubric"
else:
    print(
        "Requires argument: path to put files and database (suggestion is `pwd` when already in directory containing app.py)")
    sys.exit(1)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
if platform.node() in ['rubric.cs.uiowa.edu', 'rubric-dev.cs.uiowa.edu']:
    dbpass = None
    with open("{}/dbpass".format(files_dir), 'r') as f:
        dbpass = f.readline().rstrip()

    dbuser = None
    with open("{}/dbuser".format(files_dir), 'r') as f:
        dbuser = f.readline().rstrip()

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://{0}:{1}@127.0.0.1/rubric'.format(
        dbuser, dbpass)
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(
        files_dir)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
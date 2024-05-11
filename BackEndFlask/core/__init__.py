from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from models.tests import testing
from flask import Flask
import sys
import os
import subprocess
import re

"""
Checks to see if the correct job exists. If it does not, it adds it.
NOTE:
    It assumes the only pertinent command to tempCsv is cleaning it 
    and that no other jobs exist. The latter can be modified.
"""
cron_check = subprocess.run(["crontab", "-l"], stdout=subprocess.PIPE, text=True)
if(cron_check.returncode or re.match(".*tempCsv.*", cron_check.stdout) == None):
    f = open(os.path.abspath(".") + "/cronJobs", "a")
    f.write("0 3 * * * rm -f " + os.path.abspath(".") + "/tempCsv/*\n")
    f.close()
    os.system("crontab " + os.path.abspath(".") + "/cronJobs")
    os.system("rm -f " + os.path.abspath(".") + "/cronJobs")


if len(sys.argv) == 2 and sys.argv[1]=="test":
    testing()
    sys.exit(1)

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
app.config['JSON_SORT_KEYS'] = False

jwt = JWTManager(app)

account_db_path = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")

if os.path.exists(account_db_path):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./account.db'

else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/account.db'

db = SQLAlchemy()
db.init_app(app)

ma = Marshmallow()
ma.init_app(app)

from controller import bp
app.register_blueprint(bp, url_prefix='/api')
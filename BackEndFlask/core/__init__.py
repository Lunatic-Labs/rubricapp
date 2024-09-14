from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from models.tests import testing
from flask import Flask
from flask_cors import CORS
import sys
import os
import subprocess
import re

# Set up cron jobs
pull_cron_jobs = subprocess.run(
    ["crontab", "-l"],
    stdout=subprocess.PIPE, text=True
)

find_job = re.search(
    ".*rm -f.*tempCsv/[*].*",
    str(pull_cron_jobs.stdout)
) # str to adddress potential NoneType

if not find_job:
    cron_path = os.path.abspath(".") + "/cronJobs"
    with open(cron_path, "a") as f:
        f.write(pull_cron_jobs.stdout)
        f.write("0 3 * * * rm -f " + os.path.abspath(".") + "/tempCsv/*\n")

    os.system(f"crontab {cron_path}")
    os.remove(cron_path)

if len(sys.argv) == 2 and sys.argv[1] == "test":
    testing()
    sys.exit(1)

# Initialize Flask app
app = Flask(__name__)

# Configurations
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
app.config['JSON_SORT_KEYS'] = False

# Enable CORS
CORS(app)

# Initialize JWT
jwt = JWTManager(app)
account_db_path = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://skillbuilder:WasPogil1#@localhost/account'

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Register blueprints
from controller import bp
app.register_blueprint(bp, url_prefix='/api')
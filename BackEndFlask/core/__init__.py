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

def setup_cron_jobs():
    # Set up cron jobs
    pull_cron_jobs = subprocess.run(
        ["crontab", "-l"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )

    # Check if crontab exists
    if pull_cron_jobs.returncode != 0 and "no crontab for" in pull_cron_jobs.stderr:
        current_cron = ""
    else:
        current_cron = pull_cron_jobs.stdout

    find_job = re.search(
        r".*rm -f.*tempCsv/\*.*",
        current_cron
    )

    if not find_job:
        cron_path = os.path.abspath(".") + "/cronJobs"
        with open(cron_path, "w") as f:
            f.write(current_cron)
            f.write("0 3 * * * rm -f " + os.path.abspath(".") + "/tempCsv/*\n")

        subprocess.run(["crontab", cron_path])
        os.remove(cron_path)

# Check if we should skip crontab setup
SKIP_CRONTAB_SETUP = os.getenv('SKIP_CRONTAB_SETUP', 'false').lower() == 'true'

if not SKIP_CRONTAB_SETUP:
    setup_cron_jobs()

if len(sys.argv) == 2 and sys.argv[1] == "test":
    testing()
    sys.exit(1)

# Initialize Flask app
app = Flask(__name__)

# Configurations
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')
app.config['JSON_SORT_KEYS'] = False

# Enable CORS
CORS(app)

# Initialize JWT
jwt = JWTManager(app)

# Database configuration
account_db_path = os.path.join(os.getcwd(), "core", "account.db")
if os.path.exists(account_db_path):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./account.db'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/account.db'

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Register blueprints
from controller import bp
app.register_blueprint(bp, url_prefix='/api')
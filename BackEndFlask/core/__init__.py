from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from models.tests import testing
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
import subprocess
load_dotenv()
import sys
import os
import re
import redis

def setup_cron_jobs():
    # Check if we've already set up cron
    flag_file = os.path.join(os.path.dirname(__file__), '.cron_setup_complete')
    
    # If we've already set up cron, skip
    if os.path.exists(flag_file):
        return
        
    try:
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
                # Fixed the crontab syntax to include all 5 time fields
                f.write("0 3 * * * rm -f " + os.path.abspath(".") + "/tempCsv/*\n")

            subprocess.run(["crontab", cron_path])
            os.remove(cron_path)

        # Create flag file after successful setup
        with open(flag_file, 'w') as f:
            f.write(f'Cron setup completed at: {subprocess.check_output(["date"]).decode().strip()}\n')
            
    except Exception as e:
        # Log any errors but don't prevent app from starting
        print(f"Warning: Cron setup failed: {str(e)}")

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
account_db_path = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")

MYSQL_HOST=os.getenv('MYSQL_HOST')

MYSQL_USER=os.getenv('MYSQL_USER')

MYSQL_PASSWORD=os.getenv('MYSQL_PASSWORD')

MYSQL_DATABASE=os.getenv('MYSQL_DATABASE')

db_uri = (f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DATABASE}")

app.config['SQLALCHEMY_DATABASE_URI'] = db_uri

db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)

redis_host = os.environ.get('REDIS_HOST', 'localhost')

red = redis.Redis(host=redis_host, port=6379, db=0, decode_responses=True)

# Register blueprints
from controller import bp
app.register_blueprint(bp, url_prefix='/api')

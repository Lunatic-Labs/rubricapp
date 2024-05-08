from flask import Blueprint
from flask_cors import CORS
from core import ma
import os
bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})
from controller.Routes import User_routes
from controller.Routes import Course_routes
from controller.Routes import Rubric_routes
from controller.Routes import Role_routes
from controller.Routes import Assessment_task_routes
from controller.Routes import Completed_assessment_routes
from controller.Routes import Team_routes
from controller.Routes import Checkin_routes
from controller.Routes import Login_route
from controller.Routes import Signup_route
from controller.Routes import Logout_route
from controller.Routes import Bulk_upload_routes
from controller.Routes import Team_bulk_upload_routes
from controller.Routes import Rating_routes
from controller.Routes import Feedback_routes
from controller.Routes import Refresh_route
from controller.Routes import csv_routes
from controller.security import utility
from controller.security import CustomDecorators
from controller.security import blacklist
from Functions.exportCsv import *
create_csv("Critical Thinking Assessment", "here.csv")
os.remove("here.csv")
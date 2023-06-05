from flask import Blueprint
from flask_cors import CORS
from core import ma
bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})
from controller.Routes import User_routes
from controller.Routes import Course_routes
from controller.Routes import Rubric_routes
from controller.Routes import Role_routes
from controller.Routes import Assessment_task_routes
from controller.Routes import Completed_assessment_routes
from controller.Routes import Team_routes
from controller.Routes import Upload_csv_routes
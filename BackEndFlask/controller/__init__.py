from flask import Blueprint
from flask_cors import CORS
bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})
from controller.Routes import User_routes
from controller.Routes import Course_routes
from controller.Routes import Rubric_routes

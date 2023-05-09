from flask import Blueprint
from flask_cors import CORS
from core import ma
bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})
from controller.Routes import User_routes
from controller.Routes import course_routes2
from controller.Routes import Rubric_routes

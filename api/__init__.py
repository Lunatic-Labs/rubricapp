from flask import Blueprint
from flask_cors import CORS
bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})
from api.routes import User_routes
from api.routes import Course_routes
from api.routes import Rubric_routes

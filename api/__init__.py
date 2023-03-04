from flask import Blueprint
from flask_cors import CORS
bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})
from api.Routes import User_routes
from api.Routes import Rubric_routes
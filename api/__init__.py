from flask import Blueprint
from flask_cors import CORS
bp = Blueprint('api', __name__)
CORS(bp, resources={r"/api/*": {"origins": "*"}})
from api import routes
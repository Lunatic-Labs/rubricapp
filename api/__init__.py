from flask import Blueprint
from flask_cors import CORS
bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})
<<<<<<< HEAD
from api import routes
=======
from api.routes import User_routes
>>>>>>> origin/sample_json

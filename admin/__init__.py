from flask import Blueprint
from flask_cors import CORS
adminBp = Blueprint('admin', __name__)
cors = CORS(adminBp, resources={r"/api/*": {"origins": "*"}})
from admin.Routes import User_routes
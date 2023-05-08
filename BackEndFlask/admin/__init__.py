from flask import Blueprint
from flask_cors import CORS
adminBp = Blueprint('admin', __name__)
cors = CORS(adminBp, resources={r"/admin/*": {"origins": "*"}})
from admin.Routes import user_routes
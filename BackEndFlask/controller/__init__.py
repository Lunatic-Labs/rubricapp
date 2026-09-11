from flask import Blueprint
from flask_cors import CORS
from core import ma
import os
bp = Blueprint('api', __name__)

FRONT_END_URL = os.environ.get('FRONT_END_URL', 'http://127.0.0.1:3000')

# CRA's Jest test runner (react-scripts) hard-codes jsdom's test-document origin to
# http://localhost and doesn't expose a way to override it without ejecting, so the
# Jest suite's live-backend integration tests need it allowed alongside the real
# frontend origin.
ALLOWED_ORIGINS = [FRONT_END_URL, 'http://localhost']
cors = CORS(bp, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})
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
from controller.Routes import Csv_routes
from controller.Routes import notification_routes
from controller.security import utility
from controller.security import CustomDecorators
from controller.security import blacklist
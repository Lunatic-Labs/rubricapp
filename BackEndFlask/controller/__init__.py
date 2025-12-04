from flask import Blueprint
from flask_cors import CORS
import os

bp = Blueprint('api', __name__)
cors = CORS(bp, resources={r"/api/*": {"origins": "*"}})

# Import route modules AFTER blueprint is defined
from controller.Routes import (
    User_routes,
    Course_routes,
    Rubric_routes,
    Role_routes,
    Assessment_task_routes,
    Completed_assessment_routes,
    Team_routes,
    Checkin_routes,
    Login_route,
    Signup_route,
    Logout_route,
    Bulk_upload_routes,
    Team_bulk_upload_routes,
    Rating_routes,
    Feedback_routes,
    Refresh_route,
    Csv_routes,
    notification_routes,
)

from controller.security import (
    utility,
    CustomDecorators,
    blacklist,
)

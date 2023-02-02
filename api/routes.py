from api import bp 
from flask import jsonify

@bp.route('/get_user/<int:id>')
# @login_required
def get_user(id):
    message="Return a single user"
    content = {
        "user_id" : "1",
    "username" : "testuser",
    "first_name" : "Test",
    "last_name" : "User",
    "email" : "testuser@gmail.com",
    "password" : "********",
    "bio" : "I am a new student",
    "role" : "Student"
    }
    status_dict = {
        "status" : 200,
        "success" : True,
        "message" : message,
        "contentType" : "application/json",
        "content" : content
    }
    return jsonify(status_dict, status_dict["status"])
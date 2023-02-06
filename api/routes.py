from api import bp
from flask_login import login_required

@bp.route('/user', methods=['GET'])
# @login_required
def get_users():
    JSON = {
        "users": [
            {
                "bio": "I am a new student",
                "email": "testuser@gmail.com",
                "firstName": "Test",
                "lastName": "User",
                "password": "secretpassword",
                "role": "Student",
                "username": "testuser"
            }, {
                "bio": "I look forward to learning about lipscomb!!!",
                "email": "testuser2@gmail.com",
                "firstName": "Test",
                "lastName": "User2",
                "password": "secretpassword2",
                "role": "Student",
                "username": "testuser2"
            }, {
                "bio": "I love React!!!",
                "email": "testuser3@gmail.com",
                "firstName": "Test",
                "lastName": "User3",
                "password": "secretpassword3",
                "role": "Student",
                "username": "testuser3"
            }
        ]
    }
    response = {
        "status": 200,
        "sucess": True,
        "message": "All Users data",
        "contentType": "application/json",
        "content": JSON
    }
    return response

@bp.route('/user/<int:id>', methods=['GET'])
# @login_required
def get_user(id):
    JSON = {
        "users": [
            {
                "bio": "I am a new student",
                "email": "testuser@gmail.com",
                "firstName": "Test",
                "lastName": "User",
                "password": "secretpassword",
                "role": "Student",
                "username": "testuser"
            }
        ]
    }
    response = {
        "status": 200,
        "sucess": True,
        "message": "User {id}'s data",
        "contentType": "application/json",
        "content": JSON
    }
    return response
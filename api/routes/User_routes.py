from api import bp
from core import db
from flask import jsonify, request                  
from flask_login import login_required
from migrations import User
from objects import *

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
                "role": "Student",
                "username": "testuser"
            }, {
                "bio": "I look forward to learning about lipscomb!!!",
                "email": "testuser2@gmail.com",
                "firstName": "Test",
                "lastName": "User2",
                "role": "Student",
                "username": "testuser2"
            }, {
                "bio": "I love React!!!",
                "email": "testuser3@gmail.com",
                "firstName": "Test",
                "lastName": "User3",
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
        "content": JSON,
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
        "Access-Control-Allow-Methods": ["POST", "GET", "OPTIONS"],
        "Access-Control-Allow-Headers": "Content-Type"
    }
    return response

@bp.route('/user/<int:id>', methods=['GET'])
# @login_required
def get_user(id):
    user = load_user(id)
    JSON = {
        "users": [
            {
                "bio": user.description,
                "email": user.email,
                "firstName": "Not currently",
                "lastName": "in database",
                "role": user.role,
                "username": user.username
            }
        ]
    }
    response = {
        "status": 200,
        "sucess": True,
        "message": "User {id}'s data",
        "contentType": "application/json",
        "content": JSON,
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
        "Access-Control-Allow-Methods": ["POST", "GET", "OPTIONS"],
        "Access-Control-Allow-Headers": "Content-Type"
    }
    return response

@bp.route('/create_user', methods=["POST"])
def create_user():
    print("/api/student POST recieved!!!")
    if request.method == "POST":
        studentName = request.form.get('studentName')
        studentEmail = request.form.get('Email')
        studentID = request.form.get('LastName')
        new_user = User(username=studentName, email=studentEmail, password=studentID, role="test", University="test",description="test" )
        db.session.add(new_user)
        db.session.commit()
        return { "POST": "success!!!"}
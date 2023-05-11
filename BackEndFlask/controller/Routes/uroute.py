from flask import jsonify, request, Response
from flask_login import login_required
from models.user import *
from controller import bp
import ma

class CourseSchema(ma.ma.Schema):
    class Meta:
        fields = ('fname', 'lname', 'email', 'password', 'role', 'lms_id', 'consent', 'owner_id')

user_schema = CourseSchema()
user_schema = CourseSchema(many=True)

@bp.route('/user/<id>', methods = ['GET'])
def getUser(id):
    return user_schema.jsonify(get_user(id))

@bp.route('/users', methods = ['GET'])
def getAllUsers():
    return jsonify(user_schema.dump(get_users()))

@bp.route('/userpassword/<id>', methods = ['GET'])
def getUserPassword(id):
    return jsonify(get_user_password(id))

@bp.route('/user/add', methods = ['POST'])
def addUser():
    try: 
        #data = {key: request.json[key] for key in ['fname', 'lname', 'email', 'password', 'role', 'lms_id', 'consent', 'owner_id']}
        #user = Users(**data)
        return user_schema.jsonify(create_user(request.json))
        # db.add(user)
        # db.commit()
        # return user_schema.jsonify(user)
    except Exception:
        Response.update({'status' : 400, 'message' : "Error: User not added", 'success' : False})
        return Response
    
""" @bp.route('/user', methods = ['PUT'])
def updateUser(id):
    try:
        users = Users.query.get(id)
        data = {key: request.json[key] for key in ['fname', 'lname', 'email', 'password', 'role', 'lms_id', 'consent', 'owner_id']}
        for attr in data:
            setattr(users, attr, request.json.get(attr))
        db.session.commit()
        return user_schema.jsonify(users)
    except Exception:
        Response.update({'status' : 400, 'message' : "Error: User not updated", 'success' : False})
        return Response """
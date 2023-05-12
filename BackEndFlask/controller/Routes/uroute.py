from flask import jsonify, request, Response
from flask_login import login_required
from models.user import *
from controller import bp
import json
import ma


@bp.route('/user/<id>', methods = ['GET'])
def getUser(id):
    return users_schema.jsonify(get_user(id))

@bp.route('/users', methods = ['GET'])
def getAllUsers():
    return jsonify(users_schema.dump(get_users()))

@bp.route('/user/password/<id>', methods = ['GET'])
def getUserPassword(id):
    return jsonify(get_user_password(id))

@bp.route('/user/add', methods = ['POST'])
def add_user():
    try:
        return user_schema.jsonify(create_user(request.json))
    except Exception:
        response = Response(response=json.dumps({'status': 400, 'message': 'Error: User not added', 'success': False}), status=400, mimetype='application/json')
        return response
    
@bp.route('/user/update/<id>', methods = ['PUT'])
def updateUser(id):
    if(id):
        try:
            return user_schema.jsonify(replace_user(request.json, id))
        except Exception:
            response = Response(response=json.dumps({'status': 400, 'message': 'Error: User not updated', 'success': False}), status=400, mimetype='application/json')
            return response
    else:
        response = Response(response=json.dumps({'status': 400, 'message': 'Error: Email taken', 'success': False}), status=400, mimetype='application/json')
        return response

class UserSchema(ma.ma.Schema):
    class Meta:
        fields = ('user_id','fname','lname', 'email', 'password','role', 'lms_id', 'consent','consent_is_null','owner_id')

user_schema = UserSchema()
users_schema = UserSchema(many=True)
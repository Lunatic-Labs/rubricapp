from flask import jsonify, request, Response
from flask_login import login_required
from models.role import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage):
    JSON = {"roles": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, all_role_names, status):
    JSON = {"roles": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["roles"].append(all_role_names)
    response["content"] = JSON
    JSON = {"roles": []}

@bp.route('/role', methods = ['GET'])
def get_all_roles():
    all_roles = get_roles()
    if type(all_roles) == type(""):
        print("[Roles_routes /role GET] An error occurred fetching all roles ", all_roles)
        createBadResponse("An error occured fetching all roles ", all_roles)
        return response
    result = roles_schema.dump(all_roles)
    print("[Roles_routes/ role GET] Successfully retrived all roles!")
    createGoodResponse("Successfully retrieved all roles!", result, 200)
    return response

@bp.route('/role/<int:id>', methods =['GET'])
def post_details(id):
    one_role = get_role(id)
    if type(one_role)==type(""):
        print("[Roles_routes /role/<id> GET] An error occurred fetching one single role ", one_role)
        createBadResponse("An error occurred fetching a single role ", one_role)
    result = role_schema.dump(one_role)
    totalRoles = 0
    for role in result:
        totalRoles += 1
    if(totalRoles == 0):
        print(f"[Roles_routes /role/<id> GET] role_id: {id} does not exist!")
        createBadResponse("An error occured fetching role! ", f"role_id: {id} does not exist")
        return response
    print("[Roles_routes /role/<id>/ GET] Successfully fetched a single role!")
    createGoodResponse("Successfully fetched single role!", result, 200)
    return response
    
        
class RoleSchema(ma.Schema):
    class Meta:
        fields = ('role_id','role_name')

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
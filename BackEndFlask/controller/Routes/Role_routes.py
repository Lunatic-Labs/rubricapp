from controller  import bp
from models.role import get_roles, get_role 
from flask_jwt_extended import jwt_required
from controller.security.customDecorators import AuthCheck, badTokenCheck
from controller.Route_response import *

@bp.route('/role', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_all_roles():
    all_roles = get_roles()
    if type(all_roles) == type(""):
        print("[Roles_routes /role GET] An error occurred retrieving all roles: ", all_roles, "roles")
        createBadResponse("An error occurred retrieving all roles!", all_roles, "roles")
        return response
    result = roles_schema.dump(all_roles)
    print("[Roles_routes /role GET] Successfully retrived all roles!")
    createGoodResponse("Successfully retrieved all roles!", result, 200, "roles")
    return response

@bp.route('/role/<int:role_id>', methods =['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def post_details(role_id):
    single_role = get_role(role_id)
    if type(single_role)==type(""):
        print(f"[Roles_routes /role/<int:role_id> GET] An error occurred fetching role_id: {role_id}, ", single_role)
        createBadResponse(f"An error occurred fetching role_id: {role_id}!", single_role, "roles")
    result = role_schema.dump(single_role)
    print(f"[Roles_routes /role/<int:role_id> GET] Successfully fetched role_id: {role_id}!")
    createGoodResponse(f"Successfully fetched role_id: {role_id}!", result, 200, "roles")
    return response
        
class RoleSchema(ma.Schema):
    class Meta:
        fields = ('role_id','role_name')

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
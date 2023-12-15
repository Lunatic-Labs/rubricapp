from flask import jsonify, request, Response
from models.role import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/role', methods = ['GET'])
def get_all_roles():
    try:
        all_roles = get_roles()
        result = roles_schema.dump(all_roles)
        createGoodResponse("Successfully retrieved all roles!", result, 200, "roles")
        return response

    except Exception as e:
        createBadResponse("An error occurred retrieving all roles!", e, "roles")
        return response


@bp.route('/role/<int:role_id>', methods =['GET'])
def post_details(role_id):
    try:
        single_role = get_role(role_id)
        result = role_schema.dump(single_role)
        createGoodResponse(f"Successfully fetched role_id: {role_id}!", result, 200, "roles")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred fetching role_id: {role_id}!", e, "roles")
        return response


class RoleSchema(ma.Schema):
    class Meta:
        fields = ('role_id','role_name')

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

from flask import jsonify, request, Response
from models.role import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *


@bp.route('/role', methods=['GET'])
def get_all_roles():
    try:
        all_roles = get_roles()
        result = roles_schema.dump(all_roles)

        return create_good_response(result, 200, "roles")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all roles: {e}", "roles")


@bp.route('/role/<int:role_id>', methods=['GET'])
def post_details(role_id):
    try:
        single_role = get_role(role_id)
        result = role_schema.dump(single_role)

        return create_good_response(result, 200, "roles")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching a role: {e}", "roles")


class RoleSchema(ma.Schema):
    class Meta:
        fields = ('role_id', 'role_name')


role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

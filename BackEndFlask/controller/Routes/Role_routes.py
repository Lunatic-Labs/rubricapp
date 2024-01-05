from controller  import bp
from controller.Route_response import *
from models.role import get_roles, get_role 
from flask_jwt_extended import jwt_required
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.queries import get_role_in_course

@bp.route('/role', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_all_roles():
    try:
        if request.args and (course_id := request.args.get("course_id")) and (user_id := request.args.get("user_id")): 
            role = get_role_in_course(user_id, course_id)
            return create_good_response(role_schema.dump(role), 200, "roles")    

        all_roles = get_roles()
        result = roles_schema.dump(all_roles)

        return create_good_response(result, 200, "roles")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all roles: {e}", "roles", 400)


# Fix
@bp.route('/role/<int:role_id>', methods =['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def post_details(role_id):  # Fix: should not have the role_id
    try:
        single_role = get_role(role_id)
        result = role_schema.dump(single_role)

        return create_good_response(result, 200, "roles")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching a role: {e}", "roles", 400)


class RoleSchema(ma.Schema):
    class Meta:
        fields = (
            'role_id',
            'role_name'
        )

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

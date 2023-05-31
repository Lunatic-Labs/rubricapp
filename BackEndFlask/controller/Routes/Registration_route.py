from flask import jsonify, request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/registration', methods=['GET'])
def post(email):
    postData = request.get_json(email)
    #checking if user exists
    userEmail = get_user(2)
    if type(userEmail) == type("" ):
        print(f"[Registration_route /user/<id> GET] An error occurred fetching email: {email}, ", userEmail)
        createBadResponse(f"An error occurred fetching email: {email}!", userEmail, "user")
    result = userSchema.dump(userEmail)
    print(f"[Registration_route /users/<int:id> GET] Successfully fetched email: {userEmail}!")  
    createGoodResponse(f"Successfully fetched email: {email}", result, 200, "user")
    return response

class _UserSchema(ma.Schema):
    class Meta:
        feilds = (
            'stuff',
            'other'
        )
userSchema  = _UserSchema()
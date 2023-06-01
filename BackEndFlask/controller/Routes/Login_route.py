from flask import jsonify,  request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from token.encryption import decodeAuthToken, encodeAuthToken
from User_routes import UserSchema

@bp.route('/LogIn', methods=['GET'])
def loginUser(givenEmail, givenPassword):
    user = get_user_by_email(givenEmail)
    if type(user) != type(''):    
        user = userSchema.dump(user)
        if(user['password'] == get_user_password(user['user_id'])):
            authToken = encodeAuthToken(user['user_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully varfied user: {givenEmail}!")
            createGoodResponse(f"Successfully verified log in information: {givenEmail}!", userSchema.dump(user), 200, "users", authToken)
            return response
    print(f"[Login_route /user/<str:email> GET] An error occured fetching email or password: {givenEmail} {givenPassword}, ", user)
    createBadResponse(f"Unable to verify log in information: {givenEmail} {givenPassword}!", (user), "email")
    return response
     
userSchema = UserSchema()
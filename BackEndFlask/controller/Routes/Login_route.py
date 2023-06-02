from flask import jsonify,  request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.token.encryption import encodeAuthToken 
from controller.Routes.User_routes import UserSchema

@bp.route('/Login', methods=['GET'])
def loginUser(givenEmail):
    givenPassword = "pbkdf2:sha256:600000$2jtJ6wK8IDIySc6o$17754cde2eb25d1297bfc59fc0d861764a6445c154e070fa800515551e847b04"
    user = get_user_by_email(givenEmail)
    print(user)
    if type(user) != type(''):
        user = userSchema.dump(user)
        if(givenPassword == get_user_password(user['user_id'])):
            print("--------------------------------------------")
            authToken = encodeAuthToken(user['user_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully varfied user: {givenEmail}!")
            createGoodResponse(f"Successfully verified log in information: {givenEmail}!", userSchema.dump(user), 200, "users", authToken)
            return response
    print(f"[Login_route /user/<str:email> GET] An error occured fetching email or password: {givenEmail} {givenPassword}, ", user)
    #createBadResponse(f"Unable to verify log in information: {givenEmail} {givenPassword}!", (user), "email")
    return response
     
userSchema = UserSchema()
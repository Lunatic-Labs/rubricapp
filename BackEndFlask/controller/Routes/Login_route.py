from flask import jsonify,  request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.token.encryption import encodeAuthToken 
from controller.Routes.User_routes import UserSchema
from werkzeug.security import check_password_hash

#Before going live switch to https over POST
@bp.route('/Login', methods=['POST'])
def loginUser():
    if request.method == 'POST':
        email = request.args.get('email')
        password = request.args.get('password')
    print(type(email), email)
    user = get_user_by_email(email)
    print(type(user['user_id']))
    if type(user) != type(''):
        user = userSchema.dump(user)
        if(check_password_hash(get_user_password(user['user_id']), password)):
        #if(password == get_user_password(user['user_id'])):
            authToken = encodeAuthToken(user['user_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully varfied user: {email}!")
            createGoodResponse(f"Successfully verified log in information: {email}!", email, 200, "user", authToken)
            return response
    print(f"[Login_route /Login POST] An error occured fetching email or password: {email} {[password]}")
    createBadResponse(f"Unable ot verify log in information", "", "log in", 401)
    return response

userSchema = UserSchema()
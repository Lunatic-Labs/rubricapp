import datetime
import jwt
from flask import Flask
#-----------------------------#
#   Creates an authorization  #
#   token; Returns a string   #
#-----------------------------#
def encodeAuthToken(userID, roleID):
    try:
        payload = {
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            'iat' : datetime.datetime.utcnow(),
            'user_id' : userID,
            'role_id' : roleID
        }
        
        return jwt.encode(payload, "Thisissupposedtobesecret!")
        #return jwt.encode(payload, app.config.get('SECRET_KEY'), algorithm='HS256')
    except Exception as error:
        return error
    
#-----------------------------#
#   Decodes an authorization  #
#   token; Returns a string   #
#-----------------------------#
def decodeAuthToken(authToken):
    try:
        payload = jwt.decode(authToken, "Thisissupposedtobesecret!", algorithms=["HS256"])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return -1
    except jwt.InvalidTokenError:
        return -2
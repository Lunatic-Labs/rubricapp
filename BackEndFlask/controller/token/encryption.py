import datetime
import jwt
from flask import Flask

#-----------------------------#
#   Creates an authorization  #
#   token; Returns a string   #
#-----------------------------#
def encodeAuthToken(userID):
    try:
        payload = {
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(weeks=2),
            'iat' : datetime.datetime.utcnow(),
            'sub' : userID 
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
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signitured expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'
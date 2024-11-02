import random
import string

from flask_jwt_extended import decode_token
from core import app, red
from flask_jwt_extended.exceptions import NoAuthorizationError

def create_short_lived_token(jwt_token: str) -> str:
	short_lived_token = "".join(random.choices(string.ascii_letters + string.digits, k=64))
	
	red.set(short_lived_token, jwt_token, ex=30)
	
	return short_lived_token

def decode_short_lived_token(short_lived_token: str) -> str:
	if not (len(short_lived_token) == 64 and set(short_lived_token) <= set(string.ascii_letters + string.digits)):
		raise NoAuthorizationError("Invalid short lived token")
	
	jwt_token = red.get(short_lived_token)
	
	if jwt_token is None:
		raise NoAuthorizationError("Short lived token expired")
	
	return jwt_token

def verify_short_lived_token(short_lived_token: str) -> dict:
	with app.app_context():
		jwt_token = decode_short_lived_token(short_lived_token)
		
		return decode_token(jwt_token)

from flask import jsonify, request, Response
from flask_login import login_required
from models.role import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()

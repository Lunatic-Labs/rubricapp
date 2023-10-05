from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from models.tests import testing
import os
import sys
from flask_jwt_extended import JWTManager

if len(sys.argv) == 2 and sys.argv[1]=="test":
        testing()
        sys.exit(1)
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
app.config['JSON_SORT_KEYS'] = False
jwt = JWTManager(app)
accountDBPath = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
if os.path.exists(accountDBPath):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./account.db'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/account.db'
db = SQLAlchemy()
db.init_app(app)
ma = Marshmallow()
ma.init_app(app)
from controller import bp
app.register_blueprint(bp, url_prefix='/api')
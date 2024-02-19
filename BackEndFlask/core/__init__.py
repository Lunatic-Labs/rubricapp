from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from models.tests import testing
from flask import Flask
import sys
import os

if len(sys.argv) == 2 and sys.argv[1]=="test":
    testing()
    sys.exit(1)

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
app.config['JSON_SORT_KEYS'] = False

jwt = JWTManager(app)
account_db_path = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://skillbuilder:WasPogil1#@localhost/account'

db = SQLAlchemy()
db.init_app(app)

ma = Marshmallow()
ma.init_app(app)

from controller import bp
app.register_blueprint(bp, url_prefix='/api')
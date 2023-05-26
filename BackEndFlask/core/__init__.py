from django.template import Library
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from models.tests import testing
from dotenv import load_dotenv
import os
import sys

if len(sys.argv) == 2 and sys.argv[1]=="test":
        testing()
        sys.exit(1)
register = Library()
app = Flask(__name__)
app.config.from_prefixed_env()
accountDBPath = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
load_dotenv('./env/.env.development')
if(len(sys.argv) == 2 and sys.argv[1] == 'p'):
    load_dotenv('./env/.env.production', override=True)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('MAC') if os.path.exists(accountDBPath) else os.getenv("WIN_LIN")
print(app.config['SQLALCHEMY_DATABASE_URI'])
app.config['SECRET_KEY'] = os.getenv('DONT_LOOK')
db = SQLAlchemy()
db.init_app(app)
ma = Marshmallow()
ma.init_app(app)
from controller import bp #why is there an import here rather than above?
app.register_blueprint(bp, url_prefix='/api') #I need to be able to change this bring it up with B
from django.template import Library
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

register = Library()
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./account.db'
db = SQLAlchemy(app)
db.init_app(app)
from controller import bp
app.register_blueprint(bp, url_prefix='/api')

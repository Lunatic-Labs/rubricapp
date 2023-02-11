from core import render_template 
from admin import adminBp
from flask import jsonify, request, session, redirect, url_for
from models.User import *
import os

@adminBp.route('/', methods=['GET', 'POST'])
def login():
    if request.method=='POST':
        admin_username = os.environ.get("ADMIN_USERNAME")
        admin_password = os.environ.get("ADMIN_PASSWORD")
        username = request.form.get("username")
        password = request.form.get("password")
        if admin_username==username and admin_password==password:
            return render_template("admin_view_users.html")
    return render_template("admin_login.html")

@adminBp.route('/user', methods=['GET'])
def view_users():
    return render_template("admin_view_users.html")

@adminBp.route('/add_user', methods=['GET'])
def add_user():
    return render_template("admin_add_user.html")
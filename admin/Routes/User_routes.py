from core import render_template
from admin import adminBp
from flask import jsonify, request

@adminBp.route('/user', methods=['GET'])
def view_users():
    return render_template("admin_view_users.html")

@adminBp.route('/add_user', methods=['GET'])
def add_user():
    return render_template("admin_add_user.html")
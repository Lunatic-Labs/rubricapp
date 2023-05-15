from flask import jsonify, request, Response
from flask_login import login_required
from models.role import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

@bp.route('/role', methods = ['GET'])
def get_all_roles():
    all_roles =  roles_schema.dump (get_roles())
    return jsonify(all_roles)

@bp.route('/single_role/<id>', methods =['GET'])
def get_one_role(id):
    return role_schema.jsonify(get_role(id))    

class CourseSchema(ma.ma.Schema):
    class Meta:
        fields = ('role_id''role_name')

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
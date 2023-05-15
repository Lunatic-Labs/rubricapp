from flask import jsonify, request, Response
from flask_login import login_required
from models.role import *
from controller import bp
import ma

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
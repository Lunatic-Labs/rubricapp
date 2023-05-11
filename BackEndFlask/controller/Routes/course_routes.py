# from controller import bp
# from flask import Response, jsonify, render_template, request, redirect, url_for, flash
# from flask_login import login_required
# from models.course import *
# import json
# from flask_marshmallow import Marshmallow

# @bp.route('/course', methods=['GET'])  ##give json object to view
# #@login_required
# def courses():
#     courses = Course.query.all()
#     return jsonify([course.__dict__ for course in courses])

# @bp.route('/course/<int:id>', methods=['GET']) ##return json object that is the course queried by id
# #@login_required
# def course(id):
#     return jsonify(Course.query.get(id))

# @bp.route('/add_course', methods=['POST']) 
# #@login_required
# def add_course():
#     try:
#         data = request.get_json() ##get data from form
#         db_update = Course(course_id=data.get('course_id'), course_number=data.get('course_number'), course_name=data.get('course_name'),
#                            year=data.get('year'), term=data.get('term'), active=data.get('active'), admin_id=data.get('admin_id'))
#         db.session.add(db_update)
#         db.session.commit()
#         return #what to return here? render_template()? redirect to the view that calls this route
#     except Exception:
#         Response.update({'status' : 400, 'message' : "Error: Course not added", 'success' : False})
#         return Response
        
        
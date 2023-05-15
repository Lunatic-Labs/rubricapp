from flask import jsonify, request, Response
from flask_login import login_required
from models.course import *
from controller import bp
import ma

JSON = {
    "courses": []
}

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage):
    JSON = {"courses": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, entire_courses, status):
    JSON = {"courses": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["courses"].append(entire_courses)
    response["content"] = JSON
    JSON = {"courses": []}

@bp.route('/course', methods = ['GET'])
def get_all_courses():
    all_courses = get_courses()
    if type(all_courses)==type(""):
        print("[Course_routes /course GET] An error occurred fetching all courses!!! ", all_courses)
        createBadResponse("An error occured fetching all courses!", all_courses)
        return response
    results = courses_schema.dump(all_courses)
    print("[Course_routes /course GET] Successfully retrieved all courses!!!")
    createGoodResponse("Successfully retrieved all courses!", results, 200)
    return response

@bp.route('/course/<id>/', methods = ['GET'])
def post_details(id):
    one_course = get_course(id)
    if type(one_course)==type(""):
        print("[Course_routes /course/<id> GET] An error occurred fetching one course!", one_course)
        createBadResponse("An error occurred fetching a course!", one_course)
    results = course_schema.dump(one_course)
    totalCourses = 0
    for course in results:
        totalCourses += 1
    if(totalCourses == 0):
        print(f"[Course_routes /course/<id> GET] Course_id: {id} does not esit!")
        createBadResponse("An error occured fetching course!", f"Course_id: {id} does not exist")
        return response
    print("[Course_routes /course/<id>/ GET] Successfully fetched one course!")
    createGoodResponse("Successfully fetched course!", results, 200)
    return response

@bp.route('/add_course', methods = ['POST'])
def add_course():
    new_course = create_course(request.json)
    if type(new_course)==type(""):
        print("[Course_routes /course POST] An error occurred creating a new course!!!", new_course)
        createBadResponse("An error occurred creating a new course!", new_course)
        return response
    results = course_schema.jsonify(new_course)
    print("[Course_routes /add_course POST] Successfully created a new course!")
    createGoodResponse("Successfully created a new course!", {}, 201)
    return response

@bp.route('/update_course/<id>/', methods = ['PUT'])
def update_course(id):
    updated_course = replace_course(request.json, id)
    if type(updated_course)==type(""):
        print("[Course_routes /update_course/<id>/ PUT] An error occurred replacing course!", updated_course)
        createBadResponse("An error occurred updating the existing course!", updated_course)
        return response
    results = course_schema.dump(updated_course)
    print("[Course_routes /update_course/<id>/ PUT] Successfully updated course!")
    createGoodResponse("Sucessfully updated existing course!", results, 201)
    return response

"""
Delete route below! Not to be implemented until the fall semester!
"""

# @bp.route('/delete/<id>/', methods = ['DELETE'])
# def course_delete(id):
#     course = Course.query.get(id)
#     db.session.delete(course)
#     db.session.commit()
#     return course_schema.jsonify(course)

class CourseSchema(ma.ma.Schema):
    class Meta:
        fields = ('course_id', 'course_number', 'course_name', 'year', 'term', 'active', 'admin_id', 'use_tas')

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
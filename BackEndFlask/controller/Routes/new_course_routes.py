from flask import jsonify, request, Response
from flask_login import login_required
from models.course import *
from controller import bp
import ma

# def convertSQLQuerytoJSON(all_courses):
#     entire_courses = []
#     for course in all_courses:
#         new_course = {}
#         new_course["course_id"] = course.course_id
#         new_course["course_number"] = course.course_number
#         new_course["course_name"] = course.course_name
#         new_course["year"] = course.year
#         new_course["term"] = course.term
#         new_course["active"] = course.active
#         new_course["admin_id"] = course.admin_id
#         new_course["use_tas"] = course.use_tas
#         entire_courses.append(new_course)
#     return entire_courses

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

def extractData(course):
    return [course["course_number"], course["course_name"], course["year"], course["term"],
            course["active"], course["admin_id"], course["use_tas"]]

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
    return course_schema.jsonify(get_course(id))

@bp.route('/add_course', methods = ['POST'])
def add_course():
    try:
        print(request.json)
        return course_schema.jsonify(create_course(request.json))
    except Exception:
        Response.update({'status' : 400, 'message' : "Error: Course not added", 'success' : False})
        return Response

@bp.route('/update_course/<id>/', methods = ['PUT'])
def update_course(id):
    print(request.json)
    results = course_schema.jsonify(replace_course(request.json, id))
    return results

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
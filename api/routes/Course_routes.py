from api import bp
from flask import jsonify, request, redirect, url_for, flash
from flask_login import login_required
from models.Course import *
import json


 



@bp.route('/courses', methods=['GET'])
def courses():
    response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500, *",
        "Access-Control-Allow-Methods": ['GET'],
        "Access-Control-Allow-Headers": "Content-Type"
    }
    if request.method == 'GET':
        # retrieve all Courses
        # allCourses = getCourses()
        # store Courses queries into a JSON object
        
        # response["content"] = allCourses
        # return response with JSON object
        return response

@bp.route('/course/<int:id>', methods=['GET', 'POST'])
def course(id):
    response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500, *",
        "Access-Control-Allow-Methods": ['GET', 'POST'],
        "Access-Control-Allow-Headers": "Content-Type"
    }
    if request.method == 'GET':
        # retrieve one Course based on the passed in ID
        # store the single Course query into a JSON object
        # return response with JSON object
        pass
    elif request.method == 'POST':
        # retrive all of the new passed in attributes to create a new Course
        # create the new Course using functions defined in the models.Course
        # return response with a success
        pass

@bp.route('/add_course', methods=['GET','POST']) ##this wont have a GET method, just doing it to learn
#@login_required
def add_course():
    ##COURSES = someway to get courses from database 
    COURSES = [
    {'id' : 0,
    'course_number' : 'EN1313',
    'course_name' : 'University Writing',
    'semester' : 'Spring',
    'active' : 'yes',
    'admin_id' : 1},
    
    {'id' : 1,
    'course_number' : 'EN1113',
    'course_name' : 'Intro to University Writing',
    'semester' : 'Spring',
    'active' : 'yes',
    'admin_id' : 1},
    
    {'id' : 2,
    'course_number' : 'CS1113',
    'course_name' : 'Introduction to Computing',
    'semester' : 'Spring',
    'active' : 'yes',
    'admin_id' : 1}
    ]
    response = {
        "status": 200,
        "success": True,
        "message": "Course added",
        "contentType": "application/json",
        "content": COURSES,
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
        "Access-Control-Allow-Methods": ["GET", "POST"], ##get is temporary
        "Access-Control-Allow-Headers": "Content-Type"
    }
    if request.method == 'GET':
        return response
    elif request.method == 'POST':
        try:
            course_data = request.get_json() #we need JSON object ??
            course_id = course_data.get('id')
            course_number = course_data.get('course_number')
            course_name = course_data.get('course_name')
            course_semester = course_data.get('semester')
            status = course_data.get('active')
            adminID = course_data.get('adminID')
            addCourse(course_id, course_name, course_number, course_semester, status, adminID)
            #course_data = {'id' : 0,
            #'course_number' : '1313',
            #'course_name' : 'University Writing',
            #'semester' : 'Spring',
            #'active' : 'yes',
            #'admin_id' : 1},
            #COURSES += course_data
            return response
        except Exception:
            response.update({'status' : 400, 'message' : "Error: Course not added", 'success' : False})
            return response
        courses += course_data;
        return response
        
        
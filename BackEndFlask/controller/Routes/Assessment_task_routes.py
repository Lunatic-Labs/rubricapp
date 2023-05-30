from flask import jsonify, request, Response
from flask_login import login_required
from models.assessment_task import *
from models.course import *
# from models.user import *
from models.role import *
# from models.user_course import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

# This route will retrieve all of the available the assessment tasks
@bp.route('/assessment_task', methods = ['GET'])
def get_all_assessment_tasks():
    if(request.args and request.args.get("course_id")):
        course_id = int(request.args.get("course_id"))
        course = get_course(course_id)
        if type(course)==type(""):
            print(f"[Assessment_task_routes /assessment_task?course_id=<int:id> GET] An error occurred retrieving all assessment_tasks enrolled in course_id: {course_id}, ", course)
            createBadResponse(f"An error occurred retrieving course_id: {course_id}!", course, "assessment_tasks")
            return response
        all_assessment_tasks = get_assessment_tasks_by_course_id(course_id)
        if type(all_assessment_tasks) == type(""):
            print(f"[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}, ", all_assessment_tasks)
            createBadResponse(f"An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}!", all_assessment_tasks, "assessment_tasks")
            return response
        print(f"[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks enrolled in course_id: {course_id}!")
        createGoodResponse(f"Successfully retrived all assessment tasks enrolled in course_id: {course_id}!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
        return response
    all_assessment_tasks = get_assessment_tasks()
    if type(all_assessment_tasks) == type(""):
        print("[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks: ", all_assessment_tasks)
        createBadResponse("An error occurred retrieving all assessment tasks!", all_assessment_tasks, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
    return response

# This route will retrieve individual assessment tasks
@bp.route('/assessment_task/<int:id>', methods =['GET'])
def get_one_assessment_task(id):
    one_assessment_task = get_assessment_task(id)
    if type(one_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> GET] An error occurred fetching assessment_task_id: {id}, ", one_assessment_task)
        createBadResponse(f"An error occurred fetching assessment_task_id: {id}!", one_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> GET] Successfully fetched assessment_task_id: {id}!")
    createGoodResponse(f"Successfully fetched assessment_task_id: {id}!", assessment_task_schema.dump(one_assessment_task), 200, "assessment_tasks")
    return response

# This route will create the actual assessment tasks
@bp.route('/assessment_task', methods = ['POST'])
def add_assessment_task():
    new_assessment_task = create_assessment_task(request.json)
    if type(new_assessment_task)==type(""):
        print("[Assessment_task_routes /assessment_task POST] An error occurred creating a new assessment task: ", new_assessment_task)
        createBadResponse("An error occurred creating a new assessment task!", new_assessment_task, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task POST] Successfully created a new assessment task!")
    createGoodResponse("Successfully created a new assessment task!", assessment_task_schema.dump(new_assessment_task), 201, "assessment_tasks")
    return response

# This route will update the assessment tasks that are existing
@bp.route('/assessment_task/<int:id>', methods = ['PUT'])
def update_assessment_task(id):
    updated_assessment_task = replace_assessment_task(request.json, id)
    if type(updated_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred replacing assessment_task_id: {id}, ", updated_assessment_task)
        createBadResponse(f"An error occurred replacing assessment_task_id: {id}!", updated_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] Successfully replaced assessment_task_id: {id}!")
    createGoodResponse(f"Sucessfully replaced assessment_task_id: {id}!", assessment_task_schema.dump(updated_assessment_task), 201, "assessment_tasks")
    return response

# @bp.route('assessment_task/<int:id>', methods =['GET']) #This will get specific assessment tasks for the individual student
# def student_get_AT(id):
#     student_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id)))))
#     if type(student_AT)==type(""):
#         print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task for a student! ", student_AT)
#         createBadResponse("An error occurred geting specific assessment task for a student! ", student_AT)
#         return response
#     results = assessment_task_schema.dump(student_AT)
#     all_student_AT = 0
#     for assessment_task in results:
#         all_student_AT += 1
#     if(all_student_AT == 0):
#         print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
#         createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
#         return response
#     print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
#     createGoodResponse("Successfully fetched single assessment task!", results, 200)
#     return response


# @bp.route('assessment_task/<int:id>', methods =['GET']) #This will get specific assessment tasks for the TA/instructor
# def TA_Instructor_get_AT(id):      
#     TA_Instructor_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id))))) 
#     if type(TA_Instructor_AT)==type(""):
#         print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", TA_Instructor_AT)
#         createBadResponse("An error occurred geting specific assessment task! ", TA_Instructor_AT)
#         return response
#     results = assessment_task_schema.dump(TA_Instructor_AT)
#     all_TA_Instructor_AT = 0
#     for assessment_task in results:
#         all_TA_Instructor_AT += 1
#     if(all_TA_Instructor_AT == 0):
#         print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
#         createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
#         return response
#     print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
#     createGoodResponse("Successfully fetched single assessment task!", results, 200)
#     return response



# @bp.route('assessment_task/<int:id>', methods = ['GET'])
# def student_get_AT(id):
#     student_AT = get_assessment_task(get_course(get_role(5)))
#     if type(student_AT) == type(""):
#         print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", student_AT)
#         createBadResponse("An error occurred geting specific assessment task! ", student_AT)
#         return response
#     results = assessment_task_schema.dump(student_AT)
#     all_student_AT = 0
#     for assessment_task in results:
#         all_student_AT += 1
#     if(all_student_AT == 0):
#         print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
#         createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
#         return response
#     print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
#     createGoodResponse("Successfully fetched single assessment task!", results, 200)
#     return response

class AssessmentTaskSchema(ma.Schema):
    class Meta:
        fields = ('assessment_task_id','assessment_task_name', 'course_id', 'rubric_id', 'role_id', 'due_date', 'show_suggestions', 'show_ratings')

assessment_task_schema = AssessmentTaskSchema()
assessment_tasks_schema = AssessmentTaskSchema(many=True)

    #TA_Instructor_AT = get_role(get_user(get_user_course(get_course(get_assessment_task(id))))) - The data set will get way too large before cutting it
        
    #student_AT = get_role(get_user(get_user_course(get_course(get_assessment_task(id))))) - The data set will get way too large before cutting it
    
    #student_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id)))))
    #The logic behind the line of code above is that you first get the role id of the student which will cut the amount of data that needs to be sorted.
    #Then you will get the the user id from the role id which will give you the specific user.
    #After that, the connection between course and user is the user_course. 
    #That is why there is the get_user_course and get_course and you can get the specific course this way. 
    #Finally, you can get the specific assessment tasks that are tied to the specific student.
    
    #TA_Instructor_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id))))) 
    #The logic behind the line of code above is that you first get the role id of the TA/Instructor which will cut the amount of data that needs to be sorted.
    #Then you will get the the user id from the role id which will give you the specific user.
    #After that, the connection between course and user is the user_course. 
    #That is why there is the get_user_course and get_course and you can get the specific course this way. 
    #Finally, you can get the specific assessment tasks that are tied to the specific TA/Instructor.
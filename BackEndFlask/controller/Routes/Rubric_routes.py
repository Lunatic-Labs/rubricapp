from flask import jsonify, request, Response
from flask_login import login_required
from models.rubric import *
from models.category import *
from models.oc import *
from models.suggestions import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage):
    JSON = {"rubrics": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponseForAll(message, entire_rubrics, status):
    JSON = {"rubrics": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["rubrics"].append(entire_rubrics)
    response["content"] = JSON
    JSON = {"rubrics": []}

# def createGoodResponse(message, entire_rubrics, entire_categories, entire_ocs, entire_suggestions, status):
#     JSON = {"rubrics": []}
#     response["status"] = status
#     response["success"] = True
#     response["message"] = message
#     JSON["rubrics"].append(entire_rubrics)
#     JSON["rubrics"].append(entire_categories)
#     JSON["rubrics"].append(entire_ocs)
#     JSON["rubrics"].append(entire_suggestions)
#     response["content"] = JSON
#     JSON = {"rubrics": []}

def buildRubric(one_rubric, category, all_ocs, all_suggestions):
    JSON = {"rubrics": []}
    JSON["rubrics"].append(one_rubric)
    JSON["rubrics"].append(category)
    JSON["rubrics"].append(all_ocs)
    JSON["rubrics"].append(all_suggestions)
    JSON = {"rubrics": []}

@bp.route('/rubric', methods = ['GET'])
def get_all_rubrics():
    all_rubrics = get_rubrics()
    if type(all_rubrics)==type(""):
        print("[Rubric_routes /rubric GET] An error occurred fetching all rubrics!", all_rubrics)
        createBadResponse("An error occured fetching all courses!", all_rubrics)
        return response
    results = rubrics_schema.dump(all_rubrics)
    print("[Rubric_routes /rubric GET] Successfully retrieved all rubrics!")
    createGoodResponseForAll("Successfully retrieved all rubrics!", results, 200)
    return response

@bp.route('/rubric/<id>', methods = ['GET'])
def get_one_rubric(id):
    one_rubric = get_rubric(id)
    all_category_for_specific_rubric = get_categories_per_rubric(one_rubric.rubric_id)
    for category in all_category_for_specific_rubric:
        # print(category)
        all_ocs = get_OC_per_category(category.category_id)
        # print(all_ocs)
        all_suggestions = get_sfi_per_category(category.category_id)
        full_rubric = buildRubric(one_rubric, category.category_id, all_ocs, all_suggestions)
        results = rubric_schema.dump(full_rubric)
        print("[Rubric_routes /rubric/<id> GET] Successfully fetched one rubric!")
        createGoodResponseForAll("Succesffuly retrieved the rubric!", results, 200)
        
        # print(all_suggestions)

    # all_categories = get_categories_per_rubric(id)
    # category_count = get_amount_of_categories(id)
    # print(category_count)
    # all_ocs = get_OC_per_rubric(id)
    # all_sfi = get_sfi_per_rubric(id)
    # if type(one_rubric)==type(""):
    #     print("[Rubric_routes /rubric/<id>/ GET] An error occurred fetching one rubic!", one_rubric)
    #     createBadResponse("An error occurred fetching a rubric!", one_rubric)
    # results = rubric_schema.dump(full_rubric)
    # results2 = categories_schema.dump(all_category_for_specific_rubric)
    # results3 = ocs_schema.dump(all_ocs)
    # results4 = sfis_schema.dump(all_suggestions)
    # results2 = categories_schema.dump(all_categories)
    # results3 = ocs_schema.dump(all_ocs)
    # results4 = sfis_schema.dump(all_sfi)
    # totalRubrics = 0
    # for rubric in results:
    #     totalRubrics += 1
    # if(totalRubrics == 0):
    #     print(f"[Rubric_routes /rubric/<id> GET] Rubric_id {id} does not exist!")
    #     createBadResponse("An error occurred fetching course!", f"Course_id: {id} does not exist")
    #     return response
    # createGoodResponseForAll("Successfully retrieved all rubrics!", results, 200)   
    # createGoodResponse("Successfully fetched rubric!", results, 200)
    # createGoodResponse("test", results2, 200)
    # createGoodResponse("test3", results3, 200)
    # createGoodResponse("test4", results4, 200)
    return response


class RubricSchema(ma.Schema):
    class Meta:
        fields = ('rubric_id', 'rubric_name', 'rubric_desc')
class CategorySchema(ma.Schema):
    class Meta:
        fields = ('category_id', 'rubric_id', 'name', 'ratings')
class ObservableCharacteristicsSchema(ma.Schema):
    class Meta:
        fields = ('oc_id', 'rubric_id', 'category_id', 'oc_text')
class SuggestionsForImprovementSchema(ma.Schema):
    class Meta:
        fields = ('sfi_id', 'rubric_id', 'category_id', 'sfi_text')
            

rubric_schema = RubricSchema()
rubrics_schema = RubricSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
oc_schema = ObservableCharacteristicsSchema()
ocs_schema = ObservableCharacteristicsSchema(many=True)
sfi_schema = SuggestionsForImprovementSchema()
sfis_schema = SuggestionsForImprovementSchema(many=True)

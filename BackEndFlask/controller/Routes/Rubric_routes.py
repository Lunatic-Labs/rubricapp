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

def createGoodResponse(message, entire_rubrics, entire_categories, entire_ocs, entire_suggestions, status):
    JSON = {"rubrics": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["rubrics"].append(entire_rubrics)
    JSON["rubrics"].append(entire_categories)
    JSON["rubrics"].append(entire_ocs)
    JSON["rubrics"].append(entire_suggestions)
    response["content"] = JSON
    JSON = {"rubrics": []}

# @bp.route('/rubric', methods = ['GET'])
# def get_all_rubrics():
#     all_rubrics = get_rubrics()
#     all_categories = get_categories()
#     all_ocs = get_OCs()
#     all_sfis = get_sfis()
#     if type(all_rubrics)==type(""):
#         print("[Rubric_routes /rubric GET] An error occurred fetching all rubrics!", all_rubrics)
#         createBadResponse("An error occured fetching all courses!", all_rubrics)
#         return response
#     results = rubrics_schema.dump(all_rubrics)
#     # results2 = categories_schema.dump(all_categories)
#     # results3 = ocs_schema.dump(all_ocs)
#     # results4 = sfis_schema.dump(all_sfis)
#     print("[Rubric_routes /rubric GET] Successfully retrieved all rubrics!")
#     createGoodResponse("Successfully retrieved all rubrics!", results, 200)
#     # createGoodResponse("Successfully retrieved all rubrics!", results2, 200)
#     # createGoodResponse("Successfully retrieved all rubrics!", results3, 200)
#     # createGoodResponse("Successfully retrieved all rubrics!", results4, 200)
#     return response

@bp.route('/rubric/<id>', methods = ['GET'])
def get_one_rubric(id):
    one_rubric = get_rubric(id)
    all_categories = get_categories_per_rubric(id)
    all_ocs = get_OC_per_rubric(id)
    all_sfi = get_sfi_per_rubric(id)
    # if type(one_rubric)==type(""):
    #     print("[Rubric_routes /rubric/<id>/ GET] An error occurred fetching one rubic!", one_rubric)
    #     createBadResponse("An error occurred fetching a rubric!", one_rubric)
    results = rubric_schema.dump(one_rubric)
    results2 = categories_schema.dump(all_categories)
    results3 = ocs_schema.dump(all_ocs)
    results4 = sfis_schema.dump(all_sfi)
    # totalRubrics = 0
    # for rubric in results:
    #     totalRubrics += 1
    # if(totalRubrics == 0):
    #     print(f"[Rubric_routes /rubric/<id> GET] Rubric_id {id} does not exist!")
    #     createBadResponse("An error occurred fetching course!", f"Course_id: {id} does not exist")
    #     return response
    print("[Rubric_routes /rubric/<id> GET] Successfully fetched one rubric!")
    createGoodResponse("Successfully fetched rubric!", results, results2, results3, results4, 200)
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

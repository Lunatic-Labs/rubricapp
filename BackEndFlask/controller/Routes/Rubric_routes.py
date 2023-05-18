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

def createGoodResponse(message, entire_rubrics, status):
    JSON = {"rubrics": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["rubrics"].append(entire_rubrics)
    response["content"] = JSON
    JSON = {"rubrics": []}

@bp.route('/rubric', methods = ['GET'])
def get_all_rubrics():
    all_rubrics = get_rubrics()
    if type(all_rubrics)==type(""):
        print("[Rubric_routes /rubric GET] An error occurred retrieving all rubrics!", all_rubrics)
        createBadResponse("An error occured retrieving all courses!", all_rubrics)
        return response
    results = rubrics_schema.dump(all_rubrics)
    print("[Rubric_routes /rubric GET] Successfully retrieved all rubrics!")
    createGoodResponse("Successfully retrieved all rubrics!", results, 200)
    return response

@bp.route('/rubric/<id>', methods = ['GET'])
def get_one_rubric(id):
    one_rubric = get_rubric(id)
    if type(one_rubric)==type(""):
        # Need to write print statement for error handling!
        pass
    rubric = rubric_schema.dump(one_rubric)
    rubricJSON = {
        "rubric_id": rubric["rubric_id"],
        "rubric_name": rubric["rubric_name"],
        "rubric_description": rubric["rubric_desc"],
    }
    all_category_for_specific_rubric = get_categories_per_rubric(id)
    categories = categories_schema.dump(all_category_for_specific_rubric)
    rubricJSON["categories"] = []
    for category in categories:
        category_id = category["category_id"]
        categoryJSON = {
            "category_id": category_id,
            "category_name": category["name"],
            "rubric_id": category["rubric_id"],
            "category_ratings": category["ratings"],
        }
        all_ocs = get_OC_per_category(category_id)
        ocs = ocs_schema.dump(all_ocs)
        categoryJSON["observable_characteristics"] = ocs
        all_suggestions = get_sfi_per_category(category_id)
        suggestions = sfis_schema.dump(all_suggestions)
        categoryJSON["suggestions"] = suggestions
        rubricJSON["categories"].append(categoryJSON) 
    print(f"[Rubric_routes /rubric/<id> GET] Successfully fetched rubric_id: {id}!")
    createGoodResponse(f"Succesffuly fetched rubric_id: {id}!", rubricJSON, 200)
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

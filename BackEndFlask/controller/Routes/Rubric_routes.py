from flask import jsonify, request, Response
from flask_login import login_required
from models.rubric import *
from models.category import *
from models.ratings import *
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
        createBadResponse("An error occurred retrieving all rubrics!", all_rubrics)
        return response
    results = rubrics_schema.dump(all_rubrics)
    print("[Rubric_routes /rubric GET] Successfully retrieved all rubrics!")
    createGoodResponse("Successfully retrieved all rubrics!", results, 200)
    return response

@bp.route('/rubric/<int:id>', methods = ['GET'])
def get_one_rubric(id):
    one_rubric = get_rubric(id)
    if type(one_rubric)==type(""):
        print(f"[Rubric_routes /rubric/<int:id> GET] An error occurred fetching rubric_id: {id}!", one_rubric)
        createBadResponse(f"An error occurred fetching rubric_id: {id}!", one_rubric)
        return response
    one_rubric.categories = []
    all_category_for_specific_rubric = get_categories_per_rubric(id)
    for category in all_category_for_specific_rubric:
        ratings = get_rating_by_category(category.category_id)
        category.rating = ratings
        observable_characteristics = get_OC_per_category(category.category_id)
        category.observable_characteristics = observable_characteristics 
        suggestions = get_sfi_per_category(category.category_id)
        category.suggestions = suggestions
        one_rubric.categories.append(category)
    rubric = rubric_schema.dump(one_rubric)
    print(f"[Rubric_routes /rubric/<int:id> GET] Successfully fetched rubric_id: {id}!")
    createGoodResponse(f"Successfully fetched rubric_id: {id}!", rubric, 200)
    return response

class ObservableCharacteristicsSchema(ma.Schema):
    class Meta:
        fields = ('oc_id', 'rubric_id', 'category_id', 'oc_text')

class SuggestionsForImprovementSchema(ma.Schema):
    class Meta:
        fields = ('sfi_id', 'rubric_id', 'category_id', 'sfi_text')

class RatingsSchema(ma.Schema):
    class Meta:
        fields = ('rating_id', 'rating_description', 'rating_json', 'category_id')

class CategorySchema(ma.Schema):
    class Meta:
        fields = ('category_id', 'rubric_id', 'name', 'ratings', "observable_characteristics", "suggestions")
    ratings = ma.Nested(RatingsSchema(many=True))
    observable_characteristics = ma.Nested(ObservableCharacteristicsSchema(many=True))
    suggestions = ma.Nested(SuggestionsForImprovementSchema(many=True)) 

class RubricSchema(ma.Schema):
    class Meta:
        fields = ('rubric_id', 'rubric_name', 'rubric_desc', 'categories')
    categories = ma.Nested(CategorySchema(many=True))

rubric_schema = RubricSchema()
rubrics_schema = RubricSchema(many=True)
rating_schema = RatingsSchema()
rating_schemas = RatingsSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
oc_schema = ObservableCharacteristicsSchema()
ocs_schema = ObservableCharacteristicsSchema(many=True)
sfi_schema = SuggestionsForImprovementSchema()
sfis_schema = SuggestionsForImprovementSchema(many=True)
from flask import jsonify, request, Response
from flask_login import login_required
from models.rubric import *
from models.category import *
from models.oc import *
from models.suggestions import *
from controller import bp
from flask_marshmallow import Marshmallow
from marshmallow import Schema, fields

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
        createBadResponse("An error occurred retrieving all courses!", all_rubrics)
        return response
    results = rubrics_schema.dump(all_rubrics)
    print("[Rubric_routes /rubric GET] Successfully retrieved all rubrics!")
    createGoodResponse("Successfully retrieved all rubrics!", results, 200)
    return response

class User():
    def __init__(self, name):
        self.name = name

class UserSchema(ma.Schema):
    class Meta:
        fields = (["name"])

class Anything():
    def __init__(self, name):
        self.name = name
        self.user = []

class AnythingSchema(ma.Schema):
    class Meta:
        fields = (["name", "user"])
    user = ma.Nested(UserSchema)

class ObservableCharacteristicsSchema(ma.Schema):
    class Meta:
        fields = ('oc_id', 'rubric_id', 'category_id', 'oc_text')

class SuggestionsForImprovementSchema(ma.Schema):
    class Meta:
        fields = ('sfi_id', 'rubric_id', 'category_id', 'sfi_text')

class CategorySchema(ma.Schema):
    class Meta:
        fields = ('category_id', 'rubric_id', 'name', 'ratings', "observable_characteristics", "suggestions")
    observable_characteristics = ma.Nested(ObservableCharacteristicsSchema)
    suggestions = ma.Nested(SuggestionsForImprovementSchema) 

class RubricSchema(ma.Schema):
    class Meta:
        fields = ('rubric_id', 'rubric_name', 'rubric_desc', 'caregories')
    categories = ma.Nested(CategorySchema)

rubric_schema = RubricSchema()
rubrics_schema = RubricSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
oc_schema = ObservableCharacteristicsSchema()
ocs_schema = ObservableCharacteristicsSchema(many=True)
sfi_schema = SuggestionsForImprovementSchema()
sfis_schema = SuggestionsForImprovementSchema(many=True)

@bp.route('/rubric/<int:id>', methods = ['GET'])
def get_one_rubric(id):
    # anything = Anything(name="Anything")
    # anything.user.append(User(name="User1"))
    # anything.user.append(User(name="User2"))
    # anything.user.append(User(name="User3"))
    # anything_dump = AnythingSchema().dump(anything)
    # print(anything_dump)

    one_rubric = get_rubric(id)
    if type(one_rubric)==type(""):
        print(f"[Rubric_routes /rubric/<int:id> GET] An error occurred fetching a rubric_id: {id}!", one_rubric)
        createBadResponse(f"An error occurred fetching rubric_id: {id}!", one_rubric)
        return response
    
    all_category_for_specific_rubric = get_categories_per_rubric(id)
    print(type(all_category_for_specific_rubric))
    for category in all_category_for_specific_rubric:
        observable_characteristics = get_OC_per_category(category.category_id)
        category.observable_characteristics = observable_characteristics 
        suggestions = get_sfi_per_category(category.category_id)
        category.suggestions = suggestions

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
    print(f"[Rubric_routes /rubric/<int:id> GET] Successfully fetched rubric_id: {id}!")
    createGoodResponse(f"Successfully fetched rubric_id: {id}!", rubricJSON, 200)
    # createGoodResponse(f"Successfully fetched rubric_id: {id}!", {}, 200)
    return response

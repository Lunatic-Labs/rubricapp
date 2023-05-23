from flask import jsonify, request, Response
from flask_login import login_required
from models.rubric import *
from models.category import *
from models.ratings import *
from models.oc import *
from models.suggestions import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/rubric', methods = ['GET'])
def get_all_rubrics():
    all_rubrics = get_rubrics()
    if type(all_rubrics)==type(""):
        print("[Rubric_routes /rubric GET] An error occurred retrieving all rubrics!", all_rubrics)
        createBadResponse("An error occurred retrieving all rubrics!", all_rubrics, "rubrics")
        return response
    results = rubrics_schema.dump(all_rubrics)
    print("[Rubric_routes /rubric GET] Successfully retrieved all rubrics!")
    createGoodResponse("Successfully retrieved all rubrics!", results, 200, "rubrics")
    return response

@bp.route('/rubric/<int:id>', methods = ['GET'])
def get_one_rubric(id):
    one_rubric = get_rubric(id)
    if type(one_rubric)==type(""):
        print(f"[Rubric_routes /rubric/<int:id> GET] An error occurred fetching rubric_id: {id}!", one_rubric)
        createBadResponse(f"An error occurred fetching rubric_id: {id}!", one_rubric, "rubrics")
        return response
    one_rubric.categories = []
    all_category_for_specific_rubric = get_categories_per_rubric(id)
    for category in all_category_for_specific_rubric:
        ratings = get_rating_by_category(category.category_id)
        category.ratings = ratings
        observable_characteristics = get_OC_per_category(category.category_id)
        category.observable_characteristics = observable_characteristics 
        suggestions = get_sfi_per_category(category.category_id)
        category.suggestions = suggestions
        one_rubric.categories.append(category)
    rubric = rubric_schema.dump(one_rubric)
    print(f"[Rubric_routes /rubric/<int:id> GET] Successfully fetched rubric_id: {id}!")
    createGoodResponse(f"Successfully fetched rubric_id: {id}!", rubric, 200, "rubrics")
    return response

class RatingsSchema(ma.Schema):
    class Meta:
        fields = ('rating_id', 'rating_description', 'rating_json', 'category_id')

class ObservableCharacteristicsSchema(ma.Schema):
    class Meta:
        fields = ('oc_id', 'rubric_id', 'category_id', 'oc_text')

class SuggestionsForImprovementSchema(ma.Schema):
    class Meta:
        fields = ('sfi_id', 'rubric_id', 'category_id', 'sfi_text')

class CategorySchema(ma.Schema):
    class Meta:
        fields = ('category_id', 'rubric_id', 'name', "ratings", "observable_characteristics", "suggestions")
        ordered = True
    ratings = ma.Nested(RatingsSchema(many=True))
    observable_characteristics = ma.Nested(ObservableCharacteristicsSchema(many=True))
    suggestions = ma.Nested(SuggestionsForImprovementSchema(many=True)) 

class RubricSchema(ma.Schema):
    class Meta:
        fields = ('rubric_id', 'rubric_name', 'rubric_desc', 'categories')
    categories = ma.Nested(CategorySchema(many=True))

rubric_schema = RubricSchema()
rubrics_schema = RubricSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
rating_schema = RatingsSchema()
rating_schemas = RatingsSchema(many=True)
oc_schema = ObservableCharacteristicsSchema()
ocs_schema = ObservableCharacteristicsSchema(many=True)
sfi_schema = SuggestionsForImprovementSchema()
sfis_schema = SuggestionsForImprovementSchema(many=True)
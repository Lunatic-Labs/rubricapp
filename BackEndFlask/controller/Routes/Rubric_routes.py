from flask import jsonify, request, Response
from flask_login import login_required
from models.rubric import *
from models.category import *
from models.ratings import *
from models.observable_characteristics import *
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

@bp.route('/rubric/<int:rubric_id>', methods = ['GET'])
def get_one_rubric(rubric_id):
    one_rubric = get_rubric(rubric_id)
    if type(one_rubric)==type(""):
        print(f"[Rubric_routes /rubric/<int:rubric_id> GET] An error occurred fetching rubric_id: {rubric_id}!", one_rubric)
        createBadResponse(f"An error occurred fetching rubric_id: {rubric_id}!", one_rubric, "rubrics")
        return response
    one_rubric.categories = []
    all_category_for_specific_rubric = get_categories_per_rubric(rubric_id)
    if type(all_category_for_specific_rubric)==type(""):
        print(f"[Rubric_routes /rubric/<int:rubric_id> GET] An error occurred fetching rubric_id: {rubric_id}, ", all_category_for_specific_rubric)
        createBadResponse(f"An error occurred fetching rubric_id: {rubric_id}!", all_category_for_specific_rubric, "rubrics")
        return response
    one_rubric.total_observable_characteristics = 0
    one_rubric.total_suggestions = 0
    category_json = {}
    category_rating_observable_characteristics_suggestions_json = {}
    for category in all_category_for_specific_rubric:
        current_category_json = {
            "rating": 0,
            "observable_characteristics": "",
            "suggestions": "",
            "comments": ""
        }
        category_json[category.category_name] = 0
        ratings = get_ratings_by_category(category.category_id)
        if type(ratings)==type(""):
            print(f"[Rubric_routes /rubric/<int:rubric_id> GET] An error occurred fetching rubric_id: {rubric_id}, ", ratings)
            createBadResponse(f"An error occurred fetching rubric_id: {rubric_id}!", ratings, "rubrics")
            return response
        category.ratings = ratings
        observable_characteristics = get_observable_characteristic_per_category(category.category_id)
        if type(observable_characteristics)==type(""):
            print(f"[Rubric_routes /rubric/<int:rubric_id> GET] An error occurred fetching rubric_id: {rubric_id}, ", observable_characteristics)
            createBadResponse(f"An error occurred fetching rubric_id: {rubric_id}!", observable_characteristics, "rubrics")
            return response
        one_rubric.total_observable_characteristics += ocs_schema.dump(observable_characteristics).__len__()
        for index in ocs_schema.dump(observable_characteristics):
            current_category_json["observable_characteristics"] += "0"
        category.observable_characteristics = observable_characteristics 
        suggestions = get_suggestions_per_category(category.category_id)
        if type(suggestions)==type(""):
            print(f"[Rubric_routes /rubric/<int:rubric_id> GET] An error occurred fetching rubric_id: {rubric_id}, ", suggestions)
            createBadResponse(f"An error occurred fetching rubric_id: {rubric_id}!", suggestions, "rubrics")
            return response
        one_rubric.total_suggestions += sfis_schema.dump(suggestions).__len__()
        for index in ocs_schema.dump(suggestions):
            current_category_json["suggestions"] += "0"
        category.suggestions = suggestions
        one_rubric.categories.append(category)
        category_rating_observable_characteristics_suggestions_json[category.category_name] = current_category_json
    rubric = rubric_schema.dump(one_rubric)
    rubric["category_json"] = category_json
    rubric["category_rating_observable_characteristics_suggestions_json"] = category_rating_observable_characteristics_suggestions_json
    print(f"[Rubric_routes /rubric/<int:rubric_id> GET] Successfully fetched rubric_id: {rubric_id}!")
    createGoodResponse(f"Successfully fetched rubric_id: {rubric_id}!", rubric, 200, "rubrics")
    return response

class RatingsSchema(ma.Schema):
    class Meta:
        fields = (
            'rating_id',
            'rating_description',
            'rating_json',
            'category_id'
        )

class ObservableCharacteristicsSchema(ma.Schema):
    class Meta:
        fields = (
            'observable_characteristic_id',
            'rubric_id',
            'category_id',
            'observable_characteristic_text'
        )

class SuggestionsForImprovementSchema(ma.Schema):
    class Meta:
        fields = (
            'suggestion_id',
            'rubric_id',
            'category_id',
            'suggestion_text'
        )

class CategorySchema(ma.Schema):
    class Meta:
        fields = (
            'category_id',
            'rubric_id',
            'category_name',
            "ratings",
            "observable_characteristics",
            "suggestions"
        )
        ordered = True
    ratings = ma.Nested(RatingsSchema(many=True))
    observable_characteristics = ma.Nested(ObservableCharacteristicsSchema(many=True))
    suggestions = ma.Nested(SuggestionsForImprovementSchema(many=True)) 

class RubricSchema(ma.Schema):
    class Meta:
        fields = (
            'rubric_id',
            'rubric_name',
            'rubric_description',
            'categories',
            'total_observable_characteristics',
            'total_suggestions'
        )
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
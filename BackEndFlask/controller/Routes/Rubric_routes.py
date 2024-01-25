from flask import request
from controller import bp 
from models.rubric_categories import *
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from models.rubric   import get_rubric, get_rubrics, create_rubric
from models.category import get_categories_per_rubric, get_categories, get_ratings_by_category
from models.suggestions import get_suggestions_per_category
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.observable_characteristics import get_observable_characteristic_per_category

@bp.route('/rubric', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_all_rubrics():
    try:
        if request.args and request.args.get("rubric_id"):
            one_rubric = get_rubric(int(request.args.get("rubric_id")))

            one_rubric.categories = []
            one_rubric.total_observable_characteristics = 0
            one_rubric.total_suggestions = 0

            all_category_for_specific_rubric = get_categories_per_rubric(int(request.args.get("rubric_id")))

            category_json = {}
            category_rating_observable_characteristics_suggestions_json = {}

            for category in all_category_for_specific_rubric:
                current_category_json = {
                    "rating": 0,
                    "rating_json": category.rating_json,
                    "description": category.description,
                    "observable_characteristics": "",
                    "suggestions": "",
                    "comments": ""
                }

                category_json[category.category_name] = {}
                category_json[category.category_name]["observable_characteristics"] = []
                category_json[category.category_name]["suggestions"] = []

                ratings = get_ratings_by_category(category.category_id)

                category.ratings = ratings

                observable_characteristics = get_observable_characteristic_per_category(category.category_id)

                one_rubric.total_observable_characteristics += ocs_schema.dump(
                    observable_characteristics
                ).__len__()

                for observable_characteristic in ocs_schema.dump(observable_characteristics):
                    category_json[category.category_name]["observable_characteristics"].append(observable_characteristic['observable_characteristic_text'])
                    current_category_json["observable_characteristics"] += "0"

                category.observable_characteristics = observable_characteristics

                suggestions = get_suggestions_per_category(category.category_id)

                one_rubric.total_suggestions += sfis_schema.dump(
                    suggestions
                ).__len__()

                for suggestion in sfis_schema.dump(suggestions):
                    category_json[category.category_name]["suggestions"].append(suggestion["suggestion_text"])
                    current_category_json["suggestions"] += "0"

                category.suggestions = suggestions
                one_rubric.categories.append(category)
                category_rating_observable_characteristics_suggestions_json[category.category_name] = current_category_json

            rubric = rubric_schema.dump(one_rubric)
            rubric["category_json"] = category_json
            rubric["category_rating_observable_characteristics_suggestions_json"] = category_rating_observable_characteristics_suggestions_json

            return create_good_response(rubric, 200, "rubrics")

        return create_good_response(rubrics_schema.dump(get_rubrics()), 200, "rubrics")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all rubrics: {e}", "rubrics", 400)

@bp.route("/rubric", methods=['POST'])
def add_rubric(): 
    # expects to recieve a json object with all two fields.
    # one named 'rubric' holds all the fields for a rubric (except rubric_id)
    # the other one named 'categories' field has a list of category ids that belong to this rubric 
    # so the format would be 
    # {
    #   rubric: { 
    #        rubric_name: "",
    #        rubric_description: "", 
    #        owner = 1
    #   },
    #   category: [1, 2, 3, 4]
    # }
    # 
    try:
        rubric = create_rubric(request.json["rubric"])

        rc = {}
        rc["rubric_id"] = rubric.rubric_id

        for category in rubric["category"]: 
            rc["category_id"] = category 

            create_rubric_category(rc)

        return create_good_response(rubric_schema.dump(rubric), 200, "rubrics")

    except Exception as e:
        return create_bad_response(f"An error occurred creating a rubric: {e}", "rubrics", 400)

@bp.route('/category', methods = ['GET'])
def get_all_categories():
    try:
        if request.args and request.args.get("rubric_id"):
            all_categories_by_rubric_id=get_categories_per_rubric(int(request.args.get("rubric_id")))
            return create_good_response(categories_schema.dump(all_categories_by_rubric_id), 200, "categories")
        return create_good_response(categories_schema.dump(get_categories()), 200, "categories")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all categories: {e}", "categories", 400)

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
            'category_id',
            'suggestion_text'
        )


class CategorySchema(ma.Schema):
    class Meta:
        fields = (
            'category_id',
            'category_name',
            'description',
            'rating_json', 
            'rubric_name'
        )
        ordered = True
    ratings = ma.Nested(RatingsSchema(many=True))
    observable_characteristics = ma.Nested(
        ObservableCharacteristicsSchema(many=True))
    suggestions = ma.Nested(SuggestionsForImprovementSchema(many=True))


class RubricSchema(ma.Schema):
    class Meta:
        fields = (
            'rubric_id',
            'rubric_name',
            'rubric_description',
            'owner'
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

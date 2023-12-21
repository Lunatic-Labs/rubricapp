from flask import request
from controller import bp 
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from models.rubric   import get_rubric, get_rubrics
from models.category import get_categories_per_rubric
from models.ratings  import get_ratings_by_category
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
                    "observable_characteristics": "",
                    "suggestions": "",
                    "comments": ""
                }

                category_json[category.category_name] = 0
                ratings = get_ratings_by_category(category.category_id)
                category.ratings = ratings
                observable_characteristics = get_observable_characteristic_per_category(
                    category.category_id)
                one_rubric.total_observable_characteristics += ocs_schema.dump(
                    observable_characteristics).__len__()

                for index in ocs_schema.dump(observable_characteristics):
                    current_category_json["observable_characteristics"] += "0"

                category.observable_characteristics = observable_characteristics
                suggestions = get_suggestions_per_category(category.category_id)
                one_rubric.total_suggestions += sfis_schema.dump(
                    suggestions).__len__()

                for index in ocs_schema.dump(suggestions):
                    current_category_json["suggestions"] += "0"

                category.suggestions = suggestions
                one_rubric.categories.append(category)
                category_rating_observable_characteristics_suggestions_json[
                    category.category_name] = current_category_json

            rubric = rubric_schema.dump(one_rubric)
            rubric["category_json"] = category_json
            rubric["category_rating_observable_characteristics_suggestions_json"] = category_rating_observable_characteristics_suggestions_json

            return create_good_response(rubric, 200, "rubrics")

        all_rubrics = get_rubrics()
        results = rubrics_schema.dump(all_rubrics)

        return create_good_response(results, 200, "rubrics")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all rubrics: {e}", "rubrics", 400)

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
    observable_characteristics = ma.Nested(
        ObservableCharacteristicsSchema(many=True))
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

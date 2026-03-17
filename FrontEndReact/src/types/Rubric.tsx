
export interface Rubric {
    /** ID of the rubric. */
    rubric_id: number
    /** Name of the rubric. */
    rubric_name: string
    /** Description of the rubric. */
    rubric_description: string
    /** Map of category name to category data, ordered by index. */
    category_json: Record<string, { index: number; observable_characteristics: string[]; suggestions: string[] }>
    category_rating_observable_characteristics_suggestions_json: Record<string, unknown>

};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialRubric = Partial<Rubric>;
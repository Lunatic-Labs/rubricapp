import { ISODateString } from "./StringLabels"

export interface Category {
    /** ID of the category. */
    category_id: number
    /** Name of the category. */
    category_name: string
    /** The ID of the rubric the category belongs to. */
    rubric_id: number
    /** The rubric the category belongs to. */
    rubric_name?: string
    /** The default rubric for the category. */
    default_rubric?: string
};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialCategory = Partial<Category>;
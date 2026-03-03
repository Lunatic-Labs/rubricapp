import { ISODateString } from "./StringLabels"

export interface Rubric {
    /** ID of the rubric. */
    rubric_id: number
    /** Name of the rubric. */
    rubric_name: string
    /** Description of the rubric. */
    rubric_description: string
};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialRubric = Partial<Rubric>;
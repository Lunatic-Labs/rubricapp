import { ISODateString } from "./StringLabels"

/**
 * Represents a completed assessment task object typically returned from the backend.
 */
export interface CompleteAssessmentTask{
    /** Related assessment task ID. */
    assessment_task_id: number
    /** Related assessment task name. */
    assessment_task_name: string
    /** ID of this completed assessment. */
    completed_assessment_id: number
    /** ID of individual/team who last edited this completed assessment. */
    completed_by: number
    /** If this completed assessment is done. */
    done: boolean
    /** First time this completed assessment was created. */
    initial_time: ISODateString
    /** Latest update to this completed assessment. */
    last_update: ISODateString
    /** Is the completed assessment locked and preventing edits. */
    locked: boolean
    /** All the OC and SFI data for this completed assessment. */
    rating_observable_characteristics_suggestions_data: any
    /** ID of related rubric. */
    rubric_id: number
    /** ID of the team that this completed assessment belongs to. */
    team_id: number | null
    /** ID of the user that this completed assessment belongs to. */
    user_id: number | null
};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialCompleteAssessmentTask = Partial<CompleteAssessmentTask>;
import { ISODateString } from "./StringLables"

/**
 * Represents an assessment task object typically returned from the backend.
 */
export interface AssessmentTask {
    /** Assessment task ID. */
    assessment_task_id: number
    /** Name of assessment. */
    assessment_task_name: string
    /** Comment left by teacher about the assessment. */
    comment: string
    /** Related course ID. */
    course_id: number
    /** Password to swap teams. Will be an empty string if not applicable. */
    create_team_password: string
    /** When assessment task is due. */
    due_date: ISODateString
    /** If the assessment task is editable. */
    locked: boolean
    /** Max team size. Null if not applicable */
    max_team_size: number | null
    /** Date of when the notification was sent else null. */
    notification_sent: ISODateString | null
    /** Number of teams for the task else null if not applicable. */
    number_of_teams: number | null
    /** If the assessment task is accessable. */
    published: boolean
    /** The role ID of who can complete it. */
    role_id: number
    /** Related rubric ID. */
    rubric_id: number
    /** Should raitings be displayed. */
    show_ratings: boolean
    /** Should suggestions be displayed. */
    show_suggestions: boolean
    /** Time zone of the assessment task. */
    time_zone: string
    /** Team or individual type of assessment. True means that it is a team assessment. */
    unit_of_assessment: boolean
};

/*
 * A version of AssessmentTask where all fields are optional.
 */
export type PartialAssessmentTask = Partial<AssessmentTask>;
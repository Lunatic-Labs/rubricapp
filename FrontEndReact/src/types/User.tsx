import { ISODateString } from "./StringLabels"

export interface User {
    /** ID of the user. */
    user_id: number
    /** First name of the user. */
    first_name: string
    /** Last name of the user. */
    last_name: string
    /** Email of the user. */
    email: string
    /** Name of the team to which the user belongs. */
    team_name?: string | null
};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialUser = Partial<User>;
import { ISODateString } from "./StringLabels"

export interface User {
    /** ID of the user. */
    user_id: number
    /** First name of the user. */
    first_name: string
    /** Last name of the user. */
    last_name: string
};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialUser = Partial<User>;
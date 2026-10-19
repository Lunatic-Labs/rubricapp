
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
    /** When the user last logged in (UTC, ISO 8601); only returned to the super admin. */
    last_login_at?: string | null
};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialUser = Partial<User>;
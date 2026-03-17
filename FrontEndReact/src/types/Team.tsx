import { ISODateString } from "./StringLabels"

export interface Team {
    /** ID of the team. */
    team_id: number
    /** Name of the team. */
    team_name: string

};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialTeam = Partial<Team>;
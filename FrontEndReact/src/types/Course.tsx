
export interface Course {
    /** ID of the course. */
    course_id: number
    /** Name of the course. */
    course_name: string
};

/*
 * A version of CompletedAssessment where all fields are optional.
 */
export type PartialCourse = Partial<Course>;
/**
 * This enum holds the common values and the role names associated with each value.
 */
export const ROLE = {
    RESEARCHER :   1,
    SUPER_ADMIN:   2,
    ADMIN:         3,
    TA_INSTRUCTOR: 4,
    STUDENT:       5,
    TEST_STUDENT:  6,
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];
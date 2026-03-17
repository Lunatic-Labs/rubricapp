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

// Number comparisons are confusing so there is a ranking map and func to avoid confusion.
const ROLE_RANK = {
    [ROLE.RESEARCHER] :   100,
    [ROLE.SUPER_ADMIN]:   80,
    [ROLE.ADMIN]      :   60,
    [ROLE.TA_INSTRUCTOR]: 40,
    [ROLE.STUDENT]      : 20,
    [ROLE.TEST_STUDENT] : 10,
} as const;

export function isHigherPrivilege(a: Role, b: Role): boolean {
    return ROLE_RANK[a] > ROLE_RANK[b];
}

export function isEqualPrivilege(a:Role, b:Role): boolean {
    return ROLE_RANK[a] === ROLE_RANK[b]; 
}

export function isEqualOrHigherPrivilege(a: Role, b: Role): boolean {
    return isHigherPrivilege(a, b) || isEqualPrivilege(a, b);
}
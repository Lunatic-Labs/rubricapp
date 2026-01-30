/**
 * This enum holds the common names and values of http status codes.
 */
export const HTTP_STATUS = {
    OK: 200,
    BadRequest: 400,
    Unauthorized: 401,
    UnprocessableEntity: 422,
} as const;

// Https status code type
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
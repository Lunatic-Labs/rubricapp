/**
 * This enum holds the common names and values of http status codes.
 */
export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST:  400,
    UNAUTHORIZED: 401,
    CONTENT_TOO_LARGE: 413,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const;

// Https status code type
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
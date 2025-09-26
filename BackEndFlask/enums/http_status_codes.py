#---------------------------------------------------
# Contains system-wide http status code enums.
#---------------------------------------------------

from enum import Enum

class HttpStatus(Enum):
    """
    Repesents the Http status codes.

    Value(int)
    """
    # Success
    OK         = 200
    CREATED    = 201
    NO_CONTENT = 204
    # Redirection
    MOVED_PERMANENTLY = 301
    FOUND             = 302
    NOT_MODIFIED      = 304
    # Client errors
    BAD_REQUEST       = 400
    UNAUTHORIZED      = 401
    FORBIDDEN         = 403
    NOT_FOUND         = 404
    TOO_MANY_REQUESTS = 429
    # Server errors
    INTERNAL_SERVER_ERROR = 500
    BAD_GATEWAY           = 502
    SERVICE_UNAVAILABLE   = 503
    GATEWAY_TIMEOUT       = 504

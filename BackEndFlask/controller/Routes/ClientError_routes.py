from flask import request
from controller import bp
from controller.Route_response import create_good_response, create_bad_response
from core import limiter
from enums.http_status_codes import HttpStatus
from models.logger import client_logger
from constants.ClientError import (
    RATE_LIMIT,
    MAX_BODY_BYTES,
    MAX_LEVEL_LENGTH,
    MAX_USER_ID_LENGTH,
    MAX_URL_LENGTH,
    MAX_MESSAGE_LENGTH,
    MAX_STACK_LENGTH,
    DEFAULT_LEVEL,
    LEVEL_TO_LOG_METHOD,
)


# Deliberately has no @jwt_required()/AuthCheck() etc: the whole point is
# to capture frontend errors that can happen before login, during login,
# or after a token has already expired, so it must work regardless of
# auth state. Being unauthenticated is also why it needs the rate limit
# and body cap below - they're what keeps an open collector from being
# usable to fill the disk or bury real failures.
@bp.route('/client-error', methods=['POST'])
@limiter.limit(RATE_LIMIT)
def report_client_error():
    try:
        # Checked before request.json so an oversized body is refused
        # rather than parsed. Content-Length can be absent (a chunked
        # request), in which case the field caps are the only bound.
        if request.content_length is not None and request.content_length > MAX_BODY_BYTES:
            return create_bad_response(
                "Request body too large.",
                "client_error",
                HttpStatus.CONTENT_TOO_LARGE.value
            )

        data = request.json or {}

        field = lambda name, limit: str(data.get(name) or "")[:limit]

        level = field('level', MAX_LEVEL_LENGTH).lower()
        if level not in LEVEL_TO_LOG_METHOD:
            level = DEFAULT_LEVEL

        record = getattr(client_logger, LEVEL_TO_LOG_METHOD[level])

        record(
            "Frontend error reported: "
            f"level={level}, "
            f"url={field('url', MAX_URL_LENGTH)}, "
            f"user_id={field('user_id', MAX_USER_ID_LENGTH)}, "
            f"message={field('message', MAX_MESSAGE_LENGTH)}, "
            f"extra={field('extra', MAX_STACK_LENGTH)}"
        )

        return create_good_response({}, HttpStatus.OK.value, "client_error")
    except Exception:
        client_logger.exception("Failed to log frontend client error report")
        return create_bad_response(
            "An error occurred while processing the request.",
            "client_error",
            HttpStatus.BAD_REQUEST.value
        )

from flask import request
from controller import bp
from controller.Route_response import create_good_response, create_bad_response
from core import limiter, REQUEST_ID_PATTERN
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
        # Checked before the JSON is parsed so an oversized body is refused
        # rather than parsed. Content-Length can be absent (a chunked
        # request), in which case the field caps are the only bound.
        if request.content_length is not None and request.content_length > MAX_BODY_BYTES:
            return create_bad_response(
                "Request body too large.",
                "client_error",
                HttpStatus.CONTENT_TOO_LARGE.value
            )

        # silent=True: a missing/wrong Content-Type or malformed JSON comes
        # back as None instead of raising. Anything other than a JSON object
        # is a caller mistake, not a server failure, so it gets a plain 400
        # rather than a traceback in client_errors.log.
        data = request.get_json(silent=True)

        if not isinstance(data, dict):
            client_logger.warning("Rejected frontend error report: body is not a JSON object")
            return create_bad_response(
                "Request body must be a JSON object.",
                "client_error",
                HttpStatus.BAD_REQUEST.value
            )

        def field(name: str, limit: int) -> str:
            # Only a missing/null value becomes ''; falsy values such as 0
            # or False are real data and are kept.
            value = data.get(name)
            return "" if value is None else str(value)[:limit]

        # The X-Request-ID of the backend request that most recently failed
        # in the reporting tab (see FrontEndReact/src/logger.ts), so this
        # report can be matched to that request's log lines. Client-supplied,
        # so only a well-formed id is recorded; the pattern also caps length.
        reported_request_id = data.get('request_id')
        failed_request_id = (
            reported_request_id
            if isinstance(reported_request_id, str) and REQUEST_ID_PATTERN.fullmatch(reported_request_id)
            else ""
        )

        level = field('level', MAX_LEVEL_LENGTH).lower()
        if level not in LEVEL_TO_LOG_METHOD:
            level = DEFAULT_LEVEL

        record = getattr(client_logger, LEVEL_TO_LOG_METHOD[level])

        record(
            "Frontend error reported: "
            f"level={level}, "
            f"url={field('url', MAX_URL_LENGTH)}, "
            f"user_id={field('user_id', MAX_USER_ID_LENGTH)}, "
            f"failed_request_id={failed_request_id}, "
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

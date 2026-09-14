from flask import request
from controller import bp
from controller.Route_response import create_good_response, create_bad_response
from models.logger import logger

# Caps keep a misbehaving/hostile client from writing unbounded blobs into
# the log file.
MAX_SHORT_FIELD = 500
MAX_MESSAGE_LENGTH = 2000
MAX_STACK_LENGTH = 8000


def _field(data: dict, name: str, limit: int) -> str:
    return str(data.get(name) or "")[:limit]


# Deliberately has no @jwt_required()/AuthCheck() etc: the whole point is
# to capture frontend errors that can happen before login, during login,
# or after a token has already expired, so it must work regardless of
# auth state.
@bp.route('/client-error', methods=['POST'])
def report_client_error():
    try:
        data = request.json or {}

        logger.error(
            "Frontend error reported: "
            f"level={_field(data, 'level', 20) or 'error'}, "
            f"url={_field(data, 'url', MAX_SHORT_FIELD)}, "
            f"client_request_id={_field(data, 'request_id', 100)}, "
            f"message={_field(data, 'message', MAX_MESSAGE_LENGTH)}, "
            f"extra={_field(data, 'extra', MAX_STACK_LENGTH)}"
        )

        return create_good_response({}, 200, "client_error")
    except Exception as e:
        return create_bad_response(f"An error occurred logging a client error: {e}", "client_error", 400)

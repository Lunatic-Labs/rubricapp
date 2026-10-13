#---------------------------------------------------------
# Contains system-wide consts for the client error
# reporting route.
#---------------------------------------------------------

# Per-IP rate limit for the (unauthenticated) client error route. A
# genuinely broken page can report a burst - an error boundary
# re-rendering, say - so the per-minute allowance is generous, while the
# hourly one is what actually bounds how much one host can write in a
# day. Keyed on the remote address rather than the reported user_id,
# because the payload is client-controlled and a flooder would simply
# omit or rotate that field.
RATE_LIMIT = "20 per minute;200 per hour"

# Largest request body accepted, checked before the JSON is parsed. The
# per-field caps below add up to a little under 12KB, so this leaves room
# for JSON overhead and key names while still refusing bodies that only
# exist to be expensive to parse.
MAX_BODY_BYTES = 16 * 1024

# Caps keep a misbehaving/hostile client from writing unbounded blobs into
# the client error log file. Each cap is applied per field after parsing.
MAX_LEVEL_LENGTH = 20
MAX_USER_ID_LENGTH = 100
MAX_URL_LENGTH = 500
MAX_MESSAGE_LENGTH = 2000
MAX_STACK_LENGTH = 8000

# Level recorded when the client sends none, or one we don't recognise.
DEFAULT_LEVEL = 'error'

# Maps the levels FrontEndReact/src/logger.ts sends onto the Logger method
# that records them, so a client warning stays a WARNING rather than
# arriving as an ERROR and tripping alerts. Anything outside this map is
# treated as DEFAULT_LEVEL.
LEVEL_TO_LOG_METHOD = {
    'debug': 'debug',
    'info': 'info',
    'warn': 'warning',
    'error': 'error',
}

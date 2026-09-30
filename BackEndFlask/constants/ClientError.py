#---------------------------------------------------------
# Contains system-wide consts for the client error
# reporting route.
#---------------------------------------------------------

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

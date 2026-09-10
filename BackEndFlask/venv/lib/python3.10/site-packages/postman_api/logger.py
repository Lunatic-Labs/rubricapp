import logging

logger = logging.getLogger("postman-api")


def enable_debug_logging() -> None:
    logger.setLevel(logging.DEBUG)
    logger.addHandler(logging.StreamHandler())

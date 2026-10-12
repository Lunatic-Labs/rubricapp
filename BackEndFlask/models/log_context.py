import contextvars
from typing import Optional

"""
Per-request context (request_id, user_id) that the JSON log formatter
(models/logger.py) reads so every log line emitted while a request is
being handled is tagged with it, without every call site needing to pass
it explicitly. Set/reset from the before_request/teardown_request hooks
in core/__init__.py.
"""

_request_id: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("request_id", default=None)
_user_id: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("user_id", default=None)


def set_request_id(request_id: Optional[str]) -> contextvars.Token:
    return _request_id.set(request_id)


def reset_request_id(token: contextvars.Token) -> None:
    _request_id.reset(token)


def get_request_id() -> Optional[str]:
    return _request_id.get()


def set_user_id(user_id: Optional[str]) -> contextvars.Token:
    return _user_id.set(user_id)


def reset_user_id(token: contextvars.Token) -> None:
    _user_id.reset(token)


def get_user_id() -> Optional[str]:
    return _user_id.get()

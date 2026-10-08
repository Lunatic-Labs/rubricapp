from models.log_context import (
    set_request_id, reset_request_id, get_request_id,
    set_user_id, reset_user_id, get_user_id,
)


def test_request_id_defaults_to_none():
    assert get_request_id() is None


def test_user_id_defaults_to_none():
    assert get_user_id() is None


def test_set_and_get_request_id():
    token = set_request_id("req-1")
    try:
        assert get_request_id() == "req-1"
    finally:
        reset_request_id(token)


def test_reset_request_id_restores_previous_value():
    outer_token = set_request_id("outer")
    inner_token = set_request_id("inner")
    assert get_request_id() == "inner"

    reset_request_id(inner_token)
    assert get_request_id() == "outer"

    reset_request_id(outer_token)
    assert get_request_id() is None


def test_set_and_get_user_id():
    token = set_user_id("7")
    try:
        assert get_user_id() == "7"
    finally:
        reset_user_id(token)


def test_reset_user_id_restores_previous_value():
    outer_token = set_user_id("outer-user")
    inner_token = set_user_id("inner-user")
    assert get_user_id() == "inner-user"

    reset_user_id(inner_token)
    assert get_user_id() == "outer-user"

    reset_user_id(outer_token)
    assert get_user_id() is None


def test_request_id_and_user_id_are_independent():
    rid_token = set_request_id("req-9")
    try:
        assert get_request_id() == "req-9"
        assert get_user_id() is None
    finally:
        reset_request_id(rid_token)

    uid_token = set_user_id("9")
    try:
        assert get_user_id() == "9"
        assert get_request_id() is None
    finally:
        reset_user_id(uid_token)

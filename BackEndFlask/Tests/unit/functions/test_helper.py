import os
import pytest
import pandas as pd

from unittest.mock import patch, MagicMock
from Functions.helper import (
    delete_xlsx,
    xlsx_to_csv,
    helper_ok,
    helper_str_to_int_role,
    helper_cleanup,
)
from Functions.customExceptions import InvalidRole


# ------------------------------
# delete_xlsx
# ------------------------------
def test_delete_xlsx_removes_file(tmp_path):
    # Create a temporary file to delete
    test_file = tmp_path / "test.xlsx"
    test_file.write_text("dummy content")

    delete_xlsx(str(test_file), is_xlsx=True)
    assert not test_file.exists()  # file should be deleted


def test_delete_xlsx_no_delete_when_not_xlsx(tmp_path):
    test_file = tmp_path / "test.xlsx"
    test_file.write_text("dummy content")

    delete_xlsx(str(test_file), is_xlsx=False)
    assert test_file.exists()  # should remain since is_xlsx=False


# ------------------------------
# xlsx_to_csv
# ------------------------------
def test_xlsx_to_csv_creates_csv(tmp_path, monkeypatch):
    # Mock pandas read_excel to return a DataFrame
    df = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
    monkeypatch.setattr(pd, "read_excel", lambda f, **kwargs: df)

    # Mock os.getcwd() to the temporary directory
    monkeypatch.setattr(os, "getcwd", lambda: str(tmp_path))

    csv_path = xlsx_to_csv("fake_file.xlsx")

    assert csv_path.endswith(".csv")
    assert "temp_" in csv_path
    assert os.path.exists(csv_path)
    content = open(csv_path).read()
    assert "A" in content and "B" in content


# ------------------------------
# helper_ok
# ------------------------------
def test_helper_ok_with_string_returns_false():
    assert helper_ok("hello") is False


def test_helper_ok_with_non_string_returns_true():
    assert helper_ok(123) is True
    assert helper_ok([]) is True


# ------------------------------
# helper_str_to_int_role
# ------------------------------
def test_helper_str_to_int_role_valid_student():
    assert helper_str_to_int_role("student") == 5


def test_helper_str_to_int_role_valid_ta():
    assert helper_str_to_int_role("ta") == 4


def test_helper_str_to_int_role_invalid_raises():
    with pytest.raises(InvalidRole):
        helper_str_to_int_role("admin")


# ------------------------------
# helper_cleanup
# ------------------------------
def test_helper_cleanup_closes_and_deletes(monkeypatch, tmp_path):
    # Mock delete_xlsx
    deleted = {}
    monkeypatch.setattr("Functions.helper.delete_xlsx", lambda f, is_xlsx: deleted.update({"called": True}))

    # Create a dummy file-like object with a close() method
    file_obj = MagicMock()
    cleanup_arr = [str(tmp_path / "file.xlsx"), True, file_obj]

    result = helper_cleanup(cleanup_arr, "done")

    # Verify behaviors
    assert result == "done"
    assert deleted.get("called") is True
    file_obj.close.assert_called_once()


def test_helper_cleanup_with_none_csv(monkeypatch):
    monkeypatch.setattr("Functions.helper.delete_xlsx", lambda f, is_xlsx: None)
    cleanup_arr = ["fake_file.xlsx", True, None]

    result = helper_cleanup(cleanup_arr, 42)
    assert result == 42

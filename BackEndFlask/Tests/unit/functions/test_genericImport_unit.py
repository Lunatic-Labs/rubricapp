import pytest
from unittest.mock import patch, mock_open, MagicMock
from Functions.genericImport import validate_row, __add_user, generic_csv_to_db
from Functions.customExceptions import *

# ---------------------------------------------------
# validate_row() 
# ---------------------------------------------------

def test_validate_row_valid_data():
    seen_emails, seen_lms_ids = {}, {}
    valid_roles = ["Student", "TA", "Instructor"]

    result = validate_row(
        ["Doe, John", "john@example.com", "Student", "12345"],
        row_num=1,
        seen_emails=seen_emails,
        seen_lms_ids=seen_lms_ids,
        valid_roles=valid_roles
    )

    assert result == ("John", "Doe", "john@example.com", "Student", "12345")
    assert seen_emails["john@example.com"] == 1
    assert seen_lms_ids["12345"] == 1


@pytest.mark.parametrize("row", [
    ["John Doe", "john@example.com", "Student"],  # missing comma
    ["Doe,", "john@example.com", "Student"],       # missing first name
])
def test_validate_row_invalid_name(row):
    seen_emails, seen_lms_ids = {}, {}
    with pytest.raises(InvalidNameFormat):
        validate_row(row, 1, seen_emails, seen_lms_ids, ["Student"])


def test_validate_row_invalid_email():
    seen_emails, seen_lms_ids = {}, {}
    with patch("Functions.genericImport.helper_verify_email_syntax", return_value=False):
        with pytest.raises(InvalidEmail):
            validate_row(["Doe, John", "not-an-email", "Student"], 1, seen_emails, seen_lms_ids, ["Student"])


def test_validate_row_duplicate_email():
    seen_emails = {"john@example.com": 1}
    seen_lms_ids = {}
    with patch("Functions.genericImport.helper_verify_email_syntax", return_value=True):
        with pytest.raises(DuplicateEmail):
            validate_row(["Doe, John", "john@example.com", "Student"], 2, seen_emails, seen_lms_ids, ["Student"])


def test_validate_row_invalid_role():
    seen_emails, seen_lms_ids = {}, {}
    with patch("Functions.genericImport.helper_verify_email_syntax", return_value=True):
        with pytest.raises(InvalidRole):
            validate_row(["Doe, John", "john@example.com", "Alien"], 1, seen_emails, seen_lms_ids, ["Student"])


def test_validate_row_invalid_lms_id():
    seen_emails, seen_lms_ids = {}, {}
    with patch("Functions.genericImport.helper_verify_email_syntax", return_value=True):
        with pytest.raises(InvalidLMSID):
            validate_row(["Doe, John", "john@example.com", "Student", "abc"], 1, seen_emails, seen_lms_ids, ["Student"])


def test_validate_row_duplicate_lms_id():
    seen_emails, seen_lms_ids = {}, {"12345": 1}
    with patch("Functions.genericImport.helper_verify_email_syntax", return_value=True):
        with pytest.raises(DuplicateLMSID):
            validate_row(["Doe, John", "john@example.com", "Student", "12345"], 2, seen_emails, seen_lms_ids, ["Student"])

import pytest
from Functions.genericImport import validate_row
from Functions.customExceptions import NotEnoughColumns, TooManyColumns

def test_validate_row_not_enough_columns():
    row = ["Doe, John", "john@example.com"]  
    with pytest.raises(NotEnoughColumns) as excinfo:
        validate_row(row, row_num=1, seen_emails={}, seen_lms_ids={}, valid_roles=["Student"])
    assert "Row 1" in str(excinfo.value)

def test_validate_row_too_many_columns():
    row = ["Doe, John", "john@example.com", "Student", "123", "ExtraColumn"]
    with pytest.raises(TooManyColumns) as excinfo:
        validate_row(row, row_num=1, seen_emails={}, seen_lms_ids={}, valid_roles=["Student"])
    assert "Row 1" in str(excinfo.value)


# ---------------------------------------------------
# __add_user()
# ---------------------------------------------------

@patch("Functions.genericImport.get_user_by_email")
@patch("Functions.genericImport.replace_user")
@patch("Functions.genericImport.get_user_user_id_by_email", return_value=42)
@patch("Functions.genericImport.get_user_course_by_user_id_and_course_id", return_value=None)
@patch("Functions.genericImport.create_user_course")
def test_add_user_existing_user_creates_course_link(mock_create_course, mock_get_user_course, mock_get_user_id, mock_replace_user, mock_get_user):
    mock_user = MagicMock()
    mock_user.first_name = "John"
    mock_user.last_name = "Doe"
    mock_user.lms_id = "100"
    mock_user.email = "john@example.com"
    mock_user.password = "hash"
    mock_user.consent = True
    mock_user.owner_id = 1
    mock_get_user.return_value = mock_user

    __add_user(1, 1, "John", "Doe", "john@example.com", 2, "101", True)

    mock_replace_user.assert_called_once()
    mock_create_course.assert_called_once()

# ---------------------------------------------------
# generic_csv_to_db() 
# ---------------------------------------------------

@patch("Functions.genericImport.xlsx_to_csv", return_value="converted.csv")
@patch("builtins.open", new_callable=mock_open, read_data="Doe, John,john@example.com,Student,12345\n")
@patch("Functions.genericImport.csv.reader", return_value=iter([["Doe, John", "john@example.com", "Student", "12345"]]))
@patch("Functions.genericImport.get_role")
@patch("Functions.genericImport.__add_user")
def test_generic_csv_to_db_valid(mock_add_user, mock_get_role, mock_csv, mock_open_file, mock_xlsx_to_csv):
    mock_get_role.return_value = MagicMock(role_id=1)
    result = generic_csv_to_db("test.xlsx", owner_id=1, course_id=2)
    assert result is None
    mock_xlsx_to_csv.assert_called_once()


@patch("builtins.open", side_effect=FileNotFoundError)
@patch("Functions.genericImport.delete_xlsx")
def test_generic_csv_to_db_file_not_found(mock_delete, mock_open_file):
    with pytest.raises(FileNotFound):
        generic_csv_to_db("missing.csv", 1, 1)
    mock_delete.assert_called_once()


def test_generic_csv_to_db_empty_file(tmp_path):
    # Create an empty CSV
    p = tmp_path / "empty.csv"
    p.write_text("")
    with pytest.raises(EmptyFile):
        generic_csv_to_db(str(p), 1, 1)

# ---------------------------------------------------
# TooManyColumns
# ---------------------------------------------------
@patch("builtins.open", new_callable=mock_open, read_data="Doe, John,john@example.com,Student,12345,Extra\n")
def test_generic_csv_to_db_too_many_columns(mock_file):
    with pytest.raises(TooManyColumns):
        generic_csv_to_db("test.csv", 1, 1)

@patch("builtins.open", new_callable=mock_open, read_data='"John Doe",john@example.com,Student\n')
def test_generic_csv_to_db_invalid_name_missing_comma(mock_file):
    with pytest.raises(InvalidNameFormat):
        generic_csv_to_db("test.csv", 1, 1)

@patch("builtins.open", new_callable=mock_open, read_data='"Doe, ",john@example.com,Student\n')
def test_generic_csv_to_db_invalid_name_missing_first_or_last(mock_file):
    with pytest.raises(InvalidNameFormat):
        generic_csv_to_db("test.csv", 1, 1)

@patch("Functions.genericImport.__add_user")  # prevents DB call
@patch("Functions.genericImport.get_role")    # prevents DB call
@patch("builtins.open", new_callable=mock_open,
       read_data='"Doe, John",john@example.com,Student\n"Doe, Jane",john@example.com,Student\n')
def test_generic_csv_to_db_duplicate_email(mock_file, mock_get_role, mock_add_user):
    mock_get_role.return_value = MagicMock(role_id=1)
    with pytest.raises(DuplicateEmail):
        generic_csv_to_db("test.csv", 1, 1)

@patch("Functions.genericImport.__add_user")  # mock __add_user to prevent DB access
@patch("Functions.genericImport.get_role")
@patch("builtins.open", new_callable=mock_open, read_data='"Doe, John",john@example.com,Alien\n')
def test_generic_csv_to_db_invalid_role(mock_file, mock_get_role, mock_add_user):
    mock_get_role.return_value = MagicMock(role_id=1)
    with pytest.raises(InvalidRole):
        generic_csv_to_db("test.csv", 1, 1)

@patch("Functions.genericImport.get_role")
@patch("builtins.open", new_callable=mock_open, read_data='"Doe, John",john@example.com,Student,abc\n')
def test_generic_csv_to_db_invalid_lms_id(mock_file, mock_get_role):
    mock_get_role.return_value = MagicMock(role_id=1) 
    with pytest.raises(InvalidLMSID):
        generic_csv_to_db("test.csv", 1, 1)

@patch("Functions.genericImport.get_role")
@patch("builtins.open", new_callable=mock_open, read_data='"Doe, John",john@example.com,Student,123\n"Doe, Jane",jane@example.com,Student,123\n')
def test_generic_csv_to_db_duplicate_lms_id(mock_file, mock_get_role):
    mock_get_role.return_value = MagicMock(role_id=1)
    with pytest.raises(DuplicateLMSID):
        generic_csv_to_db("test.csv", 1, 1)


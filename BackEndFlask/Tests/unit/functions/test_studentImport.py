# Tests/unit/Functions/test_studentImport.py
import pytest
from unittest.mock import patch, MagicMock
from Functions import studentImport as si
from Functions.customExceptions import (
    NotEnoughColumns,
    TooManyColumns,
    InvalidNameFormat,
    InvalidLMSID,
    InvalidEmail,
    DuplicateLMSID,
    DuplicateEmail,
    WrongExtension,
    EmptyFile,
)

# ------------------------------
# Test validate_student_row
# ------------------------------
def test_validate_student_row_valid():
    seen_emails = {}
    seen_lms_ids = {}
    row = ["Doe, John", "123", "john@example.com"]
    first_name, last_name, lms_id, email = si.validate_student_row(row, 1, seen_emails, seen_lms_ids)
    assert first_name == "John"
    assert last_name == "Doe"
    assert lms_id == "123"
    assert email == "john@example.com"
    assert seen_emails == {"john@example.com": 1}
    assert seen_lms_ids == {"123": 1}

def test_validate_student_row_invalid_name():
    row = ["John Doe", "123", "john@example.com"]
    with pytest.raises(InvalidNameFormat):
        si.validate_student_row(row, 1, {}, {})

def test_validate_student_row_invalid_name_empty_part():
    row = ["Doe,", "123", "john@example.com"]
    with pytest.raises(InvalidNameFormat):
        si.validate_student_row(row, 1, {}, {})

def test_validate_student_row_duplicate_email():
    seen_emails = {"john@example.com": 1}
    seen_lms_ids = {}
    row = ["Doe, John", "123", "john@example.com"]
    with pytest.raises(DuplicateEmail):
        si.validate_student_row(row, 2, seen_emails, seen_lms_ids)

def test_validate_student_row_duplicate_lms_id():
    seen_emails = {}
    seen_lms_ids = {"123": 1}
    row = ["Doe, John", "123", "john2@example.com"]
    with pytest.raises(DuplicateLMSID):
        si.validate_student_row(row, 2, seen_emails, seen_lms_ids)

def test_validate_student_row_invalid_email():
    row = ["Doe, John", "123", "notanemail"]
    with pytest.raises(InvalidEmail):
        si.validate_student_row(row, 1, {}, {})

def test_validate_student_row_not_enough_columns():
    row = ["Doe, John"]
    with pytest.raises(NotEnoughColumns):
        si.validate_student_row(row, 1, {}, {})

def test_validate_student_row_too_many_columns():
    row = ["Doe, John", "123", "john@example.com", "extra"]
    with pytest.raises(TooManyColumns):
        si.validate_student_row(row, 1, {}, {})

def test_validate_student_row_invalid_lms_id_non_digit():
    row = ["Doe, John", "abc", "john@example.com"]
    with pytest.raises(InvalidLMSID):
        si.validate_student_row(row, 1, {}, {})

def test_validate_student_row_invalid_lms_id_empty():
    row = ["Doe, John", "", "john@example.com"]
    with pytest.raises(InvalidLMSID):
        si.validate_student_row(row, 1, {}, {})

# ------------------------------
# Test student_csv_to_db
# ------------------------------
@patch("Functions.studentImport.get_user_by_email")
@patch("Functions.studentImport.get_user_user_id_by_email")
@patch("Functions.studentImport.get_user_course_by_user_id_and_course_id")
@patch("Functions.studentImport.create_user")
@patch("Functions.studentImport.create_user_course")
@patch("Functions.studentImport.delete_xlsx")
@patch("Functions.studentImport.open")
@patch("Functions.studentImport.csv.reader")
def test_student_csv_to_db_success(
    mock_csv_reader, mock_open, mock_delete_xlsx,
    mock_create_user_course, mock_create_user,
    mock_get_user_course, mock_get_user_user_id, mock_get_user_by_email
):
    mock_csv_reader.return_value = [["Doe, John", "123", "john@example.com"]]
    mock_open.return_value.__enter__.return_value = MagicMock()
    mock_get_user_by_email.return_value = None
    mock_get_user_user_id.return_value = 1
    mock_get_user_course.return_value = None
    mock_create_user.return_value = MagicMock()
    mock_create_user_course.return_value = MagicMock()

    result = si.student_csv_to_db("fakefile.csv", owner_id=1, course_id=1)
    assert result == "Upload Successful!"
    assert mock_delete_xlsx.called

def test_student_csv_to_db_wrong_extension():
    with pytest.raises(WrongExtension):
        si.student_csv_to_db("file.txt", owner_id=1, course_id=1)

@patch("Functions.studentImport.get_user_by_email")
@patch("Functions.studentImport.get_user_user_id_by_email")
@patch("Functions.studentImport.get_user_course_by_user_id_and_course_id")
@patch("Functions.studentImport.create_user")
@patch("Functions.studentImport.create_user_course")
@patch("Functions.studentImport.delete_xlsx")
@patch("Functions.studentImport.open")
@patch("Functions.studentImport.csv.reader")
def test_student_csv_to_db_row_exceptions(
    mock_csv_reader, mock_open, mock_delete_xlsx,
    mock_create_user_course, mock_create_user,
    mock_get_user_course, mock_get_user_user_id, mock_get_user_by_email
):
    # Mock all DB functions to avoid Flask context issues
    mock_get_user_by_email.return_value = None
    mock_get_user_user_id.return_value = 1
    mock_get_user_course.return_value = None
    mock_create_user.return_value = MagicMock()
    mock_create_user_course.return_value = MagicMock()
    mock_open.return_value.__enter__.return_value = MagicMock()

    # Empty file
    mock_csv_reader.return_value = []
    with pytest.raises(EmptyFile):
        si.student_csv_to_db("file.csv", 1, 1)

    # Not enough columns
    mock_csv_reader.return_value = [["Doe, John", "123"]]
    with pytest.raises(NotEnoughColumns):
        si.student_csv_to_db("file.csv", 1, 1)

    # Too many columns
    mock_csv_reader.return_value = [["Doe, John", "123", "john@example.com", "extra"]]
    with pytest.raises(TooManyColumns):
        si.student_csv_to_db("file.csv", 1, 1)

    # Invalid name (no comma)
    mock_csv_reader.return_value = [["John Doe", "123", "john@example.com"]]
    with pytest.raises(InvalidNameFormat):
        si.student_csv_to_db("file.csv", 1, 1)

    # Invalid name (empty part)
    mock_csv_reader.return_value = [["Doe,", "123", "john@example.com"]]
    with pytest.raises(InvalidNameFormat):
        si.student_csv_to_db("file.csv", 1, 1)

    # Invalid LMS ID
    mock_csv_reader.return_value = [["Doe, John", "abc", "john@example.com"]]
    with pytest.raises(InvalidLMSID):
        si.student_csv_to_db("file.csv", 1, 1)

    # Duplicate LMS ID
    mock_csv_reader.return_value = [
        ["Doe, John", "123", "john@example.com"],
        ["Smith, Jane", "123", "jane@example.com"]
    ]
    with pytest.raises(DuplicateLMSID):
        si.student_csv_to_db("file.csv", 1, 1)

    # Invalid email
    mock_csv_reader.return_value = [["Doe, John", "123", "not-an-email"]]
    with pytest.raises(InvalidEmail):
        si.student_csv_to_db("file.csv", 1, 1)

    # Duplicate email
    mock_csv_reader.return_value = [
        ["Doe, John", "123", "john@example.com"],
        ["Smith, Jane", "124", "john@example.com"]
    ]
    with pytest.raises(DuplicateEmail):
        si.student_csv_to_db("file.csv", 1, 1)

    assert mock_delete_xlsx.called

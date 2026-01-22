import pytest
from unittest.mock import patch, mock_open, MagicMock
from Functions.teamBulkUpload import (
    _expect, _parse, _verify_information, 
    TBUStudent, TBUTeam, ParseState, team_bulk_upload
)
from Functions.customExceptions import *


class TestExpectFunction:
    def test_expect_cleans_unnamed_columns(self):
        lst = [['Name', 'Unnamed: 1', 'Email', '']]
        result = _expect(lst)
        assert result == ['Name', 'Email']
    
    def test_expect_strips_whitespace(self):
        lst = [['  Name  ', '  Email  ']]
        result = _expect(lst, cols=2)
        assert result == ['Name', 'Email']
    
    def test_expect_raises_too_many_columns(self):
        lst = [['Col1', 'Col2', 'Col3']]
        with pytest.raises(TooManyColumns):
            _expect(lst, cols=2)

class TestParseFunction:
    def test_parse_empty_team_name_exception(self):

        lst = [
            ['ta@example.com'],
            [''],  # Empty team name
            ['Doe, John', 'john@example.com']
        ]
        with pytest.raises(EmptyTeamName):
            _parse(lst)
            
    
    def test_parse_empty_ta_email_exception(self):
        lst = [
            [''],  # Empty TA email
            ['Team A'],
            ['Doe, John', 'john@example.com']
        ]
        with pytest.raises(TooManyColumns):
            _parse(lst)
    
    def test_parse_too_many_columns_ta_row(self):
        lst = [
            ['ta@example.com', 'extra_column'],
            ['Team A'],
            ['Doe, John', 'john@example.com']
        ]
        with pytest.raises(TooManyColumns):
            _parse(lst)
    
    def test_parse_too_many_columns_team_row(self):
        lst = [
            ['ta@example.com'],
            ['Team A', 'extra_column'],
            ['Doe, John', 'john@example.com']
        ]
        with pytest.raises(TooManyColumns):
            _parse(lst)
    
    def test_parse_too_many_columns_student_row(self):
        lst = [
            ['ta@example.com'],
            ['Team A'],
            ['Doe, John', 'john@example.com', 'lms123', 'extra']
        ]
        with pytest.raises(TooManyColumns):
            _parse(lst)
    
    def test_parse_invalid_name_format(self):
        lst = [
            ['ta@example.com'],
            ['Team A'],
            ['InvalidName', 'john@example.com']  # No comma in name
        ]
        with pytest.raises(InvalidNameFormat):
            _parse(lst)
    
    def test_parse_empty_teams(self):
        lst = [['ta@example.com']]
        with pytest.raises(EmptyTeamMembers):
            _parse(lst)
    
    def test_parse_successful_single_team(self):
        lst = [
            ['ta@example.com'],
            ['Team A'],
            ['Doe, John', 'john@example.com'],
            ['Smith, Jane', 'jane@example.com', 'lms456']
        ]
        teams = _parse(lst)
        assert len(teams) == 1
        assert teams[0].name == 'Team A'
        assert teams[0].ta_email == 'ta@example.com'
        assert len(teams[0].students) == 2
        assert teams[0].students[0].fname == 'John'
        assert teams[0].students[0].lname == 'Doe'
        assert teams[0].students[1].lms_id == 'lms456'
    
    def test_parse_multiple_teams(self):
        lst = [
            ['ta1@example.com'],
            ['Team A'],
            ['Doe, John', 'john@example.com'],
            [],  # Empty row separator
            ['ta2@example.com'],
            ['Team B'],
            ['Smith, Jane', 'jane@example.com']
        ]
        teams = _parse(lst)
        assert len(teams) == 2
        assert teams[0].name == 'Team A'
        assert teams[1].name == 'Team B'


class TestVerifyInformation:
    
    def test_verify_empty_ta_email(self):
        team = TBUTeam("Team A", "", [TBUStudent("John", "Doe", "john@example.com")])
        with pytest.raises(EmptyTAEmail):
            _verify_information([team])
    
    def test_verify_empty_team_name(self):
        team = TBUTeam("", "ta@example.com", [TBUStudent("John", "Doe", "john@example.com")])
        with pytest.raises(EmptyTeamName):
            _verify_information([team])
    
    def test_verify_empty_team_members(self):
        team = TBUTeam("Team A", "ta@example.com", [])
        with pytest.raises(EmptyTeamMembers):
            _verify_information([team])
    
    def test_verify_invalid_ta_email_syntax(self):
        team = TBUTeam("Team A", "invalid-email", [TBUStudent("John", "Doe", "john@example.com")])
        with pytest.raises(SuspectedMisformatting):
            _verify_information([team])
    
    def test_verify_empty_student_fname(self):
        team = TBUTeam("Team A", "ta@example.com", [TBUStudent("", "Doe", "john@example.com")])
        with pytest.raises(EmptyStudentFName):
            _verify_information([team])
    
    def test_verify_empty_student_lname(self):
        team = TBUTeam("Team A", "ta@example.com", [TBUStudent("John", "", "john@example.com")])
        with pytest.raises(EmptyStudentLName):
            _verify_information([team])
    
    def test_verify_empty_student_email(self):
        team = TBUTeam("Team A", "ta@example.com", [TBUStudent("John", "Doe", "")])
        with pytest.raises(EmptyStudentEmail):
            _verify_information([team])
    
    def test_verify_invalid_student_email_syntax(self):
        team = TBUTeam("Team A", "ta@example.com", [TBUStudent("John", "Doe", "invalid-email")])
        with pytest.raises(SuspectedMisformatting):
            _verify_information([team])
    
    def test_verify_valid_team(self):
        """Test successful verification"""
        team = TBUTeam("Team A", "ta@example.com", [
            TBUStudent("John", "Doe", "john@example.com"),
            TBUStudent("Jane", "Smith", "jane@example.com", "lms123")
        ])
        # Should not raise any exception
        _verify_information([team])


class TestTeamBulkUploadValidation:
    
    def test_wrong_extension(self):
        with pytest.raises(WrongExtension):
            team_bulk_upload("file.txt", 1, 1)
    
    @patch("builtins.open", mock_open(read_data='ta@example.com\n'))
    @patch("Functions.teamBulkUpload.csv.reader")
    def test_empty_teams_after_parse(self, mock_csv_reader):
        mock_csv_reader.return_value = [['ta@example.com']]  # TA only, no team/students
        
        with pytest.raises(EmptyTeamMembers):
            team_bulk_upload("file.csv", owner_id=1, course_id=1)

    def test_team_bulk_upload_empty_teams(monkeypatch):
        # Patch _parse to return an empty list
        with patch("Functions.teamBulkUpload._parse", return_value=[]):
            with patch("builtins.open", create=True):
                with pytest.raises(EmptyTeamMembers):
                    team_bulk_upload("dummy.csv", owner_id=1, course_id=1)

    @patch("Functions.teamBulkUpload.__create_team")
    @patch("Functions.teamBulkUpload._verify_information")
    @patch("builtins.open", new_callable=mock_open, read_data='ta@example.com\nTeam A\n"Doe, John",john@example.com')
    @patch("Functions.teamBulkUpload.xlsx_to_csv", return_value="dummy.csv")
    def test_team_bulk_upload_xlsx_conversion(self, mock_xlsx_to_csv, mock_file, mock_verify, mock_create):
        """Test that an .xlsx file triggers xlsx_to_csv and processes CSV output"""
        
        result = team_bulk_upload("file.xlsx", owner_id=1, course_id=1)

        mock_xlsx_to_csv.assert_called_once_with("file.xlsx")
        assert result == "Success"




class TestTBUStudentClass:
    """Unit tests for TBUStudent class"""
    
    def test_student_creation_with_lms_id(self):
        """Test student creation with LMS ID"""
        student = TBUStudent("John", "Doe", "john@example.com", "lms123")
        assert student.fname == "John"
        assert student.lname == "Doe"
        assert student.email == "john@example.com"
        assert student.lms_id == "lms123"
    
    def test_student_creation_without_lms_id(self):
        """Test student creation without LMS ID"""
        student = TBUStudent("Jane", "Smith", "jane@example.com")
        assert student.fname == "Jane"
        assert student.lname == "Smith"
        assert student.email == "jane@example.com"
        assert student.lms_id is None


class TestTBUTeamClass:
    """Unit tests for TBUTeam class"""
    
    def test_team_creation(self):
        """Test team creation"""
        students = [
            TBUStudent("John", "Doe", "john@example.com"),
            TBUStudent("Jane", "Smith", "jane@example.com", "lms456")
        ]
        team = TBUTeam("Team A", "ta@example.com", students)
        assert team.name == "Team A"
        assert team.ta_email == "ta@example.com"
        assert len(team.students) == 2


# Fixtures for common test data
@pytest.fixture
def valid_student():
    """Fixture for a valid student"""
    return TBUStudent("John", "Doe", "john@example.com", "lms123")


@pytest.fixture
def valid_team(valid_student):
    """Fixture for a valid team"""
    return TBUTeam("Team A", "ta@example.com", [valid_student])


# Parametrized tests for better coverage
@pytest.mark.parametrize("email,should_raise", [
    ("", True),  # Empty email
    ("invalid-email", True),  # Invalid format
    ("valid@example.com", False),  # Valid email
])
def test_email_validation_parametrized(email, should_raise):
    """Parametrized test for email validation"""
    team = TBUTeam("Team A", email, [TBUStudent("John", "Doe", "john@example.com")])
    if should_raise:
        with pytest.raises((EmptyTAEmail, SuspectedMisformatting)):
            _verify_information([team])
    else:
        _verify_information([team])


@pytest.mark.parametrize("name_format,should_raise", [
    ("Doe, John", False),  # Valid format
    ("InvalidName", True),  # Missing comma
    ("Doe,John", False),  # Valid (spaces handled by strip)
])
def test_name_format_parametrized(name_format, should_raise):
    """Parametrized test for name format validation"""
    lst = [
        ['ta@example.com'],
        ['Team A'],
        [name_format, 'john@example.com']
    ]
    if should_raise:
        with pytest.raises(InvalidNameFormat):
            _parse(lst)
    else:
        teams = _parse(lst)
        assert len(teams) == 1
import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from Functions.exportCsv import (
    rounded_hours_difference,
    Ratings_Csv,
    Ocs_Sfis_Csv,
    Comments_Csv,
    create_csv_strings,
    CSV_Type,
    Csv_Data
)


class TestRoundedHoursDifferenceUnit:
    """Unit tests for rounded_hours_difference function"""
    
    def test_rounds_down_when_less_than_30_minutes(self):
        """UNIT: Test rounding down when remainder < 30 minutes"""
        completed = datetime(2025, 1, 1, 10, 0, 0)
        seen = datetime(2025, 1, 1, 12, 25, 0)  # 2 hours 25 minutes
        
        result = rounded_hours_difference(completed, seen)
        
        assert result == 2  # Should round down to 2
    
    
    def test_rounds_up_when_greater_than_30_minutes(self):
        """UNIT: Test rounding up when remainder >= 30 minutes"""
        completed = datetime(2025, 1, 1, 10, 0, 0)
        seen = datetime(2025, 1, 1, 12, 35, 0)  # 2 hours 35 minutes
        
        result = rounded_hours_difference(completed, seen)
        
        assert result == 3  # Should round up to 3
    
    
    def test_returns_zero_for_same_time(self):
        """UNIT: Test returns 0 when times are identical"""
        time = datetime(2025, 1, 1, 10, 0, 0)
        
        result = rounded_hours_difference(time, time)
        
        assert result == 0
    
    
    def test_raises_type_error_for_non_datetime(self):
        """UNIT: Test raises TypeError for invalid input types"""
        completed = datetime(2025, 1, 1, 10, 0, 0)
        
        with pytest.raises(TypeError) as exc_info:
            rounded_hours_difference(completed, "not a datetime")
        
        assert "Expected:" in str(exc_info.value)


class TestRatingsCsvUnit:
    """Unit tests for Ratings_Csv class"""
    
    @patch('Functions.exportCsv.get_csv_data_by_at_id')
    @patch('Functions.exportCsv.get_course_name_by_at_id')
    def test_creates_csv_with_headers(self, mock_get_course, mock_get_data):
        """UNIT: Test CSV creation includes proper headers"""
        # Arrange
        mock_get_course.return_value = "Test Course"
        mock_get_data.return_value = [
            {
                Csv_Data.AT_NAME.value: "Assessment 1",
                Csv_Data.FIRST_NAME.value: "John",
                Csv_Data.LAST_NAME.value: "Doe",
                Csv_Data.TEAM_NAME.value: None,  # Not a team assessment
                Csv_Data.COMP_DATE.value: datetime(2025, 1, 1, 10, 0),
                Csv_Data.LAG_TIME.value: datetime(2025, 1, 1, 12, 0),
                Csv_Data.JSON.value: {
                    "category1": {"rating": 5},
                    "done": True,
                    "comments": "Good work"
                }
            }
        ]
        
        # Act
        csv_obj = Ratings_Csv(1)
        result = csv_obj.return_csv_str()
        
        # Assert
        assert "Test Course" in result
        assert "First Name" in result
        assert "Last Name" in result
        assert "Lag Time (Hours)" in result
        assert "John" in result
        assert "Doe" in result
    
    
    @patch('Functions.exportCsv.get_csv_data_by_at_id')
    @patch('Functions.exportCsv.get_course_name_by_at_id')
    def test_creates_csv_for_team_assessment(self, mock_get_course, mock_get_data):
        """UNIT: Test CSV creation for team-based assessments"""
        # Arrange
        mock_get_course.return_value = "Team Course"
        mock_get_data.return_value = [
            {
                Csv_Data.FIRST_NAME.value: "John",
                Csv_Data.LAST_NAME.value: "Doe",
                Csv_Data.TEAM_NAME.value: "Team Alpha",  # IS a team assessment
                Csv_Data.COMP_DATE.value: datetime(2025, 1, 1, 10, 0),
                Csv_Data.LAG_TIME.value: datetime(2025, 1, 1, 12, 0),
                Csv_Data.JSON.value: {
                    "category1": {"rating": 5},
                    "done": True
                }
            }
        ]
        
        # Act
        csv_obj = Ratings_Csv(1)
        result = csv_obj.return_csv_str()
        
        # Assert
        assert "Team Name" in result
        assert "Team Alpha" in result
        # Should NOT have individual names for team assessments
        assert result.count("First Name") == 0  # Not in headers
    
    
    @patch('Functions.exportCsv.get_csv_data_by_at_id')
    @patch('Functions.exportCsv.get_course_name_by_at_id')
    def test_handles_empty_data(self, mock_get_course, mock_get_data):
        """UNIT: Test CSV creation with no assessment data"""
        # Arrange
        mock_get_course.return_value = "Empty Course"
        mock_get_data.return_value = []  # No data
        
        # Act
        csv_obj = Ratings_Csv(1)
        result = csv_obj.return_csv_str()
        
        # Assert
        assert "Empty Course" in result
        assert len(result) < 100  # Should be minimal
    
    
    @patch('Functions.exportCsv.get_csv_data_by_at_id')
    @patch('Functions.exportCsv.get_course_name_by_at_id')
    def test_handles_null_lag_time(self, mock_get_course, mock_get_data):
        """UNIT: Test CSV handles None lag_time (student hasn't seen assessment)"""
        # Arrange
        mock_get_course.return_value = "Test Course"
        mock_get_data.return_value = [
            {
                Csv_Data.FIRST_NAME.value: "John",
                Csv_Data.LAST_NAME.value: "Doe",
                Csv_Data.TEAM_NAME.value: None,
                Csv_Data.COMP_DATE.value: datetime(2025, 1, 1, 10, 0),
                Csv_Data.LAG_TIME.value: None,  # Student hasn't seen yet
                Csv_Data.JSON.value: {
                    "category1": {"rating": 5}
                }
            }
        ]
        
        # Act
        csv_obj = Ratings_Csv(1)
        result = csv_obj.return_csv_str()
        
        # Assert - Should not crash, should have empty lag time
        assert "John" in result
        # Verify it doesn't crash on None lag_time

class TestOcs_Sfis_CsvUnit:

    def test_ocs_sfis_csv_init_sets_marks(self):
        """Unit test __init__"""
        csv_obj = Ocs_Sfis_Csv(123)
        # Accessing name-mangled private attributes
        assert csv_obj._Ocs_Sfis_Csv__checkmark == "\u2713"
        assert csv_obj._Ocs_Sfis_Csv__crossmark == " "

    @patch("Functions.exportCsv.get_csv_categories")
    def test_ocs_sfis_format_writes_expected_rows(self, mock_get_csv_categories):
        """Unit test _format"""
        # Mock data returned by get_csv_categories()
        mock_get_csv_categories.return_value = (
            [("OC1",), ("OC2",)],
            [("SFI1",), ("SFI2",)],
        )

        # Fake data that would exist in Csv_Data.JSON
        fake_json = {
            "CategoryA": {
                "observable_characteristics": ["1", "0"],
                "suggestions": ["0", "1"]
            },
            "done": {},
            "comments": {}
        }

        csv_obj = Ocs_Sfis_Csv(1)
        csv_obj._writer = MagicMock()  # Spy on writer calls
        csv_obj._is_teams = False
        csv_obj._singular = {
            2: "rubric_id",
            7: "user_id",
            5: "team_id",
            13: fake_json,  # Corresponds to Csv_Data.JSON
        }
        csv_obj._completed_assessment_data = [
            {
                8: "John",  # FIRST_NAME
                9: "Doe",   # LAST_NAME
                13: fake_json,
            }
        ]

        csv_obj._format()

        # Ensure writer is called correctly
        calls = [call[0][0] for call in csv_obj._writer.writerow.call_args_list]
        assert any("CategoryA" in c for c in calls if isinstance(c, list))
        assert any("OC:OC1" in c for c in calls if isinstance(c, list))
        assert any("SFI:SFI2" in c for c in calls if isinstance(c, list))


    class TestCommentsCsvUnit:
        """Unit tests for Comments_Csv class"""
        
        @patch('Functions.exportCsv.get_csv_data_by_at_id')
        @patch('Functions.exportCsv.get_course_name_by_at_id')
        def test_extracts_comments_from_json(self, mock_get_course, mock_get_data):
            """UNIT: Test that comments are extracted correctly"""
            # Arrange
            mock_get_course.return_value = "Test Course"
            mock_get_data.return_value = [
                {
                    Csv_Data.FIRST_NAME.value: "John",
                    Csv_Data.LAST_NAME.value: "Doe",
                    Csv_Data.TEAM_NAME.value: None,
                    Csv_Data.JSON.value: {
                        "category1": {"comments": "Great work!"},
                        "category2": {"comments": "Needs improvement"},
                        "done": True,
                        "comments": "Overall good"  # This should be skipped
                    }
                }
            ]
            
            # Act
            csv_obj = Comments_Csv(1)
            result = csv_obj.return_csv_str()
            
            # Assert
            assert "Great work!" in result
            assert "Needs improvement" in result
            assert "category1" in result
            assert "category2" in result

class TestCreateCsvStringsUnit:
    """Unit tests for create_csv_strings function"""
    
    @patch('Functions.exportCsv.Ratings_Csv')
    def test_creates_ratings_csv(self, mock_ratings_class):
        """UNIT: Test that RATING_CSV type creates Ratings_Csv"""
        # Arrange
        mock_instance = Mock()
        mock_instance.return_csv_str.return_value = "csv content"
        mock_ratings_class.return_value = mock_instance
        
        # Act
        result = create_csv_strings(1, CSV_Type.RATING_CSV.value)
        
        # Assert
        mock_ratings_class.assert_called_once_with(1)
        mock_instance.return_csv_str.assert_called_once()
        assert result == "csv content"
    
    
    @patch('Functions.exportCsv.Ocs_Sfis_Csv')
    def test_creates_ocs_sfi_csv(self, mock_ocs_class):
        """UNIT: Test that OCS_SFI_CSV type creates Ocs_Sfis_Csv"""
        # Arrange
        mock_instance = Mock()
        mock_instance.return_csv_str.return_value = "ocs content"
        mock_ocs_class.return_value = mock_instance
        
        # Act
        result = create_csv_strings(1, CSV_Type.OCS_SFI_CSV.value)
        
        # Assert
        mock_ocs_class.assert_called_once_with(1)
        assert result == "ocs content"
    
    
    def test_raises_value_error_for_invalid_type(self):
        """UNIT: Test that invalid CSV type raises ValueError"""
        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            create_csv_strings(1, 999)  # Invalid type
        
        assert "No type of csv is associated" in str(exc_info.value)

    @patch("Functions.exportCsv.Comments_Csv.return_csv_str", return_value="mocked comments csv")
    def test_create_csv_strings_comments(self, mock_return_csv):
        result = create_csv_strings(123, CSV_Type.COMMENTS_CSV.value)
        mock_return_csv.assert_called_once()
        assert result == "mocked comments csv"

    @patch("Functions.exportCsv.CSV_Type", autospec=True)
    def test_create_csv_strings_default_case_returns_error(self, mock_csv_type):
        # Simulate an Enum-like object that doesn't match any case
        mock_csv_type.return_value = "UNKNOWN_CSV"

        result = create_csv_strings(at_id=1, type_csv=999)
        assert result == "Error in create_csv_strings()."
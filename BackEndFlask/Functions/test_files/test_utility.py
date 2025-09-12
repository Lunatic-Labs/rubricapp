import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy.exc import SQLAlchemyError, DatabaseError
# Assuming the function is in a module called 'team_service'
from models.queries import does_team_user_exist, TeamUser, db

class TestDoesTeamUserExist:
    """
    Test suite for the does_team_user_exist function.
    
    This suite tests the function's ability to correctly determine if a user
    belongs to a team by checking the TeamUser table in the database.
    """
    
    @patch('models.queries.db.session.query')
    def test_user_exists_in_team(self, mock_query):
        """
        Test the happy path where a user is found in the team.
        
        Strategy:
        1. Mock the database query to return a non-empty result
        2. Call the function with valid IDs
        3. Assert the function returns True
        4. Verify the query was constructed correctly
        """
        # Setup - Create a chain of mocks to simulate the query builder pattern
        mock_filter = MagicMock()
        mock_query.return_value.filter.return_value = mock_filter
        mock_filter.all.return_value = [(1,)]  # Non-empty result with a team_user_id
        
        # Execute
        result = does_team_user_exist(user_id=1, team_id=2)
        
        # Assert
        assert result is True
        # Verify the query was constructed with the right parameters
        mock_query.assert_called_once_with(TeamUser.team_user_id)
        mock_query.return_value.filter.assert_called_once()
        # Extract and verify the filter arguments
        args, _ = mock_query.return_value.filter.call_args
        assert len(args) == 2
        assert str(args[0]) == str(TeamUser.user_id == 1)
        assert str(args[1]) == str(TeamUser.team_id == 2)
        mock_filter.all.assert_called_once()
    
    @patch('models.queries.db.session.query')
    def test_user_does_not_exist_in_team(self, mock_query):
        """
        Test the case where a user is not found in the team.
        
        Strategy:
        1. Mock the database query to return an empty result
        2. Call the function with valid IDs
        3. Assert the function returns False
        4. Verify the query was constructed correctly
        """
        # Setup
        mock_filter = MagicMock()
        mock_query.return_value.filter.return_value = mock_filter
        mock_filter.all.return_value = []  # Empty result
        
        # Execute
        result = does_team_user_exist(user_id=1, team_id=2)
        
        # Assert
        assert result is False
        mock_query.assert_called_once_with(TeamUser.team_user_id)
        mock_query.return_value.filter.assert_called_once()
        mock_filter.all.assert_called_once()
    
    @patch('models.queries.db.session.query')
    def test_multiple_entries_for_same_user_team(self, mock_query):
        """
        Test the case where multiple entries exist for the same user-team pair.
        
        This is an edge case that tests data integrity. In a properly designed
        database, this shouldn't happen, but the function should handle it gracefully.
        
        Strategy:
        1. Mock the database to return multiple results
        2. Verify the function still returns True (user exists in team)
        """
        # Setup - Return multiple entries (shouldn't happen in practice but function should handle it)
        mock_filter = MagicMock()
        mock_query.return_value.filter.return_value = mock_filter
        mock_filter.all.return_value = [(1,), (2,)]  # Multiple results
        
        # Execute
        result = does_team_user_exist(user_id=1, team_id=2)
        
        # Assert - Function should return True if any entries exist
        assert result is True
    
    @patch('models.queries.db.session.query')
    def test_with_zero_user_id(self, mock_query):
        """
        Test with edge case input: user_id = 0
        
        Strategy:
        1. Mock the database to return empty results
        2. Call function with user_id = 0
        3. Verify correct query construction and result
        """
        # Setup
        mock_filter = MagicMock()
        mock_query.return_value.filter.return_value = mock_filter
        mock_filter.all.return_value = []
        
        # Execute
        result = does_team_user_exist(user_id=0, team_id=2)
        
        # Assert
        assert result is False
        args, _ = mock_query.return_value.filter.call_args
        assert str(args[0]) == str(TeamUser.user_id == 0)
    
    @patch('models.queries.db.session.query')
    def test_with_negative_team_id(self, mock_query):
        """
        Test with edge case input: negative team_id
        
        Strategy:
        1. Mock the database to return empty results
        2. Call function with negative team_id
        3. Verify correct query construction and result
        """
        # Setup
        mock_filter = MagicMock()
        mock_query.return_value.filter.return_value = mock_filter
        mock_filter.all.return_value = []
        
        # Execute
        result = does_team_user_exist(user_id=1, team_id=-5)
        
        # Assert
        assert result is False
        args, _ = mock_query.return_value.filter.call_args
        assert str(args[1]) == str(TeamUser.team_id == -5)
    
    @patch('models.queries.db.session.query')
    def test_with_type_error_user_id(self, mock_query):
        """
        Test handling of type errors for user_id parameter.
        
        Strategy:
        1. Set up the mock to raise TypeError when called with invalid type
        2. Call function with string instead of int for user_id
        3. Verify the exception is propagated (function doesn't handle type conversion)
        """
        # Setup - SQLAlchemy would raise TypeError for incompatible types
        mock_query.return_value.filter.side_effect = TypeError("Invalid type for user_id")
        
        # Execute and Assert
        with pytest.raises(TypeError) as excinfo:
            does_team_user_exist(user_id="invalid", team_id=2)
        assert "Invalid type for user_id" in str(excinfo.value)
    
    @patch('models.queries.db.session.query')
    def test_with_database_connection_error(self, mock_query):
        """
        Test handling of database connection errors.
        
        Strategy:
        1. Set up the mock to raise a DatabaseError
        2. Call the function and verify the exception is propagated
        3. This tests that the function doesn't silently catch database errors
        """
        # Setup - Simulate database connection failure
        mock_query.side_effect = DatabaseError("Connection refused", None, None)
        
        # Execute and Assert
        with pytest.raises(DatabaseError) as excinfo:
            does_team_user_exist(user_id=1, team_id=2)
        assert "Connection refused" in str(excinfo.value)
    
    @patch('models.queries.db.session.query')
    def test_with_sqlalchemy_error(self, mock_query):
        """
        Test handling of general SQLAlchemy errors.
        
        Strategy:
        1. Set up the mock to raise a SQLAlchemyError
        2. Call the function and verify the exception is propagated
        """
        # Setup - Simulate a general SQLAlchemy error
        mock_query.side_effect = SQLAlchemyError("Invalid query")
        
        # Execute and Assert
        with pytest.raises(SQLAlchemyError) as excinfo:
            does_team_user_exist(user_id=1, team_id=2)
        assert "Invalid query" in str(excinfo.value)
    
    def test_integration_with_db(self, db_session):
        """
        Integration test using a test database.
        
        Note: This test requires a fixture 'db_session' that provides a
        test database session. This is commented out as it's environment-specific.
        
        Strategy:
        1. Use a real database session (typically with test data)
        2. Test the function with known data in the test database
        """
        # This test is commented out as it requires a specific test environment
        # Uncomment and adapt for your specific testing setup
        """
        # Setup - Assuming test data is already in the database
        # or we could add test data here
        
        # Execute
        result_existing = does_team_user_exist(user_id=1, team_id=1)  # Known to exist
        result_nonexisting = does_team_user_exist(user_id=999, team_id=999)  # Known not to exist
        
        # Assert
        assert result_existing is True
        assert result_nonexisting is False
        """
        pass  # Placeholder
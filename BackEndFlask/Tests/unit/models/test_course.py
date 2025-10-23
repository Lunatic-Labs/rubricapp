import pytest
from unittest.mock import Mock, patch, MagicMock
from models.course import (
    get_courses,
    get_course,
    get_course_use_tas,
    get_courses_by_admin_id,
    create_course,
    replace_course,
    delete_course,
    InvalidCourseID
)


# ============================================================================
# FIXTURES - Reusable test data and mocks
# ============================================================================

@pytest.fixture
def mock_db_session():
    """Mock the database session to avoid actual DB calls"""
    with patch('models.course.db.session') as mock_session:
        yield mock_session


@pytest.fixture
def sample_course_data():
    """Standard course data for testing"""
    return {
        "course_number": "CS3523",
        "course_name": "Operating Systems",
        "year": 2025,
        "term": "Spring",
        "active": True,
        "admin_id": 2,
        "use_tas": True,
        "use_fixed_teams": True
    }


@pytest.fixture
def mock_course_object():
    """Mock Course object that simulates a database record"""
    mock_course = Mock()
    mock_course.course_id = 1
    mock_course.course_number = "CS3523"
    mock_course.course_name = "Operating Systems"
    mock_course.year = 2025
    mock_course.term = "Spring"
    mock_course.active = True
    mock_course.admin_id = 2
    mock_course.use_tas = True
    mock_course.use_fixed_teams = True
    return mock_course


# ============================================================================
# TEST: get_courses()
# ============================================================================

@patch('models.course.Course')
def test_get_courses_returns_all_courses(mock_course_class):
    """Test that get_courses returns all courses from database"""
    # Arrange
    mock_courses = [Mock(), Mock(), Mock()]
    mock_course_class.query.all.return_value = mock_courses
    
    # Act
    result = get_courses()
    
    # Assert
    assert result == mock_courses
    mock_course_class.query.all.assert_called_once()


@patch('models.course.Course')
def test_get_courses_returns_empty_list_when_no_courses(mock_course_class):
    """Test that get_courses returns empty list when database is empty"""
    # Arrange
    mock_course_class.query.all.return_value = []
    
    # Act
    result = get_courses()
    
    # Assert
    assert result == []
    assert isinstance(result, list)


# ============================================================================
# TEST: get_course(course_id)
# ============================================================================

@patch('models.course.Course')
def test_get_course_returns_course_when_found(mock_course_class, mock_course_object):
    """Test that get_course returns the correct course when it exists"""
    # Arrange
    course_id = 1
    mock_course_class.query.filter_by.return_value.first.return_value = mock_course_object
    
    # Act
    result = get_course(course_id)
    
    # Assert
    assert result == mock_course_object
    mock_course_class.query.filter_by.assert_called_once_with(course_id=course_id)


@patch('models.course.Course')
def test_get_course_returns_none_when_not_found(mock_course_class):
    """Test that get_course returns None when course doesn't exist"""
    # Arrange
    course_id = 999
    mock_course_class.query.filter_by.return_value.first.return_value = None
    
    # Act
    result = get_course(course_id)
    
    # Assert
    assert result is None


# ============================================================================
# TEST: get_course_use_tas(course_id)
# ============================================================================

@patch('models.course.Course')
def test_get_course_use_tas_returns_true_when_course_uses_tas(mock_course_class):
    """Test that get_course_use_tas returns True when course uses TAs"""
    # Arrange
    course_id = 1
    mock_course = Mock()
    mock_course.use_tas = True
    mock_course_class.query.filter_by.return_value.first.return_value = mock_course
    
    # Act
    result = get_course_use_tas(course_id)
    
    # Assert
    assert result is True


@patch('models.course.Course')
def test_get_course_use_tas_returns_false_when_course_doesnt_use_tas(mock_course_class):
    """Test that get_course_use_tas returns False when course doesn't use TAs"""
    # Arrange
    course_id = 2
    mock_course = Mock()
    mock_course.use_tas = False
    mock_course_class.query.filter_by.return_value.first.return_value = mock_course
    
    # Act
    result = get_course_use_tas(course_id)
    
    # Assert
    assert result is False


@patch('models.course.Course')
def test_get_course_use_tas_returns_none_when_course_not_found(mock_course_class):
    """Test that get_course_use_tas returns None when course doesn't exist"""
    # Arrange
    course_id = 999
    mock_course_class.query.filter_by.return_value.first.return_value = None
    
    # Act
    result = get_course_use_tas(course_id)
    
    # Assert
    assert result is None


# ============================================================================
# TEST: get_courses_by_admin_id(admin_id)
# ============================================================================

@patch('models.course.Course')
def test_get_courses_by_admin_id_returns_admin_courses(mock_course_class):
    """Test that get_courses_by_admin_id returns all courses for an admin"""
    # Arrange
    admin_id = 2
    mock_courses = [Mock(), Mock()]
    mock_course_class.query.filter_by.return_value.all.return_value = mock_courses
    
    # Act
    result = get_courses_by_admin_id(admin_id)
    
    # Assert
    assert result == mock_courses
    mock_course_class.query.filter_by.assert_called_once_with(admin_id=admin_id)


@patch('models.course.Course')
def test_get_courses_by_admin_id_returns_empty_when_admin_has_no_courses(mock_course_class):
    """Test that get_courses_by_admin_id returns empty list when admin has no courses"""
    # Arrange
    admin_id = 999
    mock_course_class.query.filter_by.return_value.all.return_value = []
    
    # Act
    result = get_courses_by_admin_id(admin_id)
    
    # Assert
    assert result == []


# ============================================================================
# TEST: create_course(course_data)
# ============================================================================

@patch('models.course.Course')
def test_create_course_creates_and_returns_course(mock_course_class, mock_db_session, sample_course_data):
    """Test that create_course successfully creates a new course"""
    # Arrange
    mock_instance = Mock()
    mock_course_class.return_value = mock_instance
    
    # Act
    result = create_course(sample_course_data)
    
    # Assert
    mock_course_class.assert_called_once_with(
        course_number=sample_course_data["course_number"],
        course_name=sample_course_data["course_name"],
        year=sample_course_data["year"],
        term=sample_course_data["term"],
        active=sample_course_data["active"],
        admin_id=sample_course_data["admin_id"],
        use_tas=sample_course_data["use_tas"],
        use_fixed_teams=sample_course_data["use_fixed_teams"]
    )
    mock_db_session.add.assert_called_once_with(mock_instance)
    mock_db_session.commit.assert_called_once()
    assert result == mock_instance


@patch('models.course.Course')
def test_create_course_with_minimal_data(mock_course_class, mock_db_session):
    """Test that create_course works with minimal required data"""
    # Arrange
    minimal_data = {
        "course_number": "CS101",
        "course_name": "Intro to CS",
        "year": 2025,
        "term": "Fall",
        "active": False,
        "admin_id": 1,
        "use_tas": False,
        "use_fixed_teams": False
    }
    mock_instance = Mock()
    mock_course_class.return_value = mock_instance
    
    # Act
    result = create_course(minimal_data)
    
    # Assert
    assert result == mock_instance
    mock_db_session.commit.assert_called_once()


# ============================================================================
# TEST: replace_course(course_data, course_id)
# ============================================================================

@patch('models.course.Course')
def test_replace_course_updates_existing_course(mock_course_class, mock_db_session, sample_course_data):
    """Test that replace_course successfully updates an existing course"""
    # Arrange
    course_id = 1
    mock_existing_course = Mock()
    mock_course_class.query.filter_by.return_value.first.return_value = mock_existing_course
    
    # Act
    result = replace_course(sample_course_data, course_id)
    
    # Assert
    assert result == mock_existing_course
    assert mock_existing_course.course_number == sample_course_data["course_number"]
    assert mock_existing_course.course_name == sample_course_data["course_name"]
    assert mock_existing_course.year == sample_course_data["year"]
    assert mock_existing_course.term == sample_course_data["term"]
    assert mock_existing_course.active == sample_course_data["active"]
    assert mock_existing_course.admin_id == sample_course_data["admin_id"]
    assert mock_existing_course.use_tas == sample_course_data["use_tas"]
    assert mock_existing_course.use_fixed_teams == sample_course_data["use_fixed_teams"]
    mock_db_session.commit.assert_called_once()


@patch('models.course.Course')
def test_replace_course_returns_error_when_course_not_found(mock_course_class, sample_course_data):
    """Test that replace_course returns error when course doesn't exist"""
    # Arrange
    course_id = 99
    mock_course_class.query.filter_by.return_value.first.return_value = None
    
    # Act & Assert
    with pytest.raises(InvalidCourseID) as exc_info:
        replace_course(sample_course_data, course_id)

    assert str(exc_info.value) == f"Invalid course_id: {course_id}."


# ============================================================================
# TEST: delete_course(course_id)
# ============================================================================

@patch('models.course.Course')
def test_delete_course_deletes_existing_course(mock_course_class, mock_db_session):
    """Test that delete_course successfully deletes an existing course"""
    # Arrange
    course_id = 1
    mock_existing_course = Mock()
    mock_course_class.query.filter_by.return_value.first.return_value = mock_existing_course
    mock_course_class.query.filter_by.return_value.delete.return_value = None
    
    # Act
    delete_course(course_id)
    
    # Assert
    # Verify filter_by was called twice (once for first(), once for delete())
    assert mock_course_class.query.filter_by.call_count == 2
    mock_course_class.query.filter_by.return_value.delete.assert_called_once()
    mock_db_session.commit.assert_called_once()


@patch('models.course.Course')
def test_delete_course_raises_exception_when_course_not_found(mock_course_class):
    """Test that delete_course raises InvalidCourseID when course doesn't exist"""
    # Arrange
    course_id = 999
    mock_course_class.query.filter_by.return_value.first.return_value = None
    
    # Act & Assert
    with pytest.raises(InvalidCourseID) as exc_info:
        delete_course(course_id)
    
    assert str(exc_info.value) == f"Invalid course_id: {course_id}."


# ============================================================================
# TEST: InvalidCourseID Exception
# ============================================================================

def test_invalid_course_id_exception_message():
    """Test that InvalidCourseID exception has correct message format"""
    # Arrange
    course_id = 123
    
    # Act
    exception = InvalidCourseID(course_id)
    
    # Assert
    assert str(exception) == f"Invalid course_id: {course_id}."
    assert exception.message == f"Invalid course_id: {course_id}."


# ============================================================================
# INTEGRATION TESTS (Optional - require test database)
# ============================================================================

# These would be run against a test database
# Uncomment and configure when you have a test DB setup

# @pytest.mark.integration
# def test_create_and_retrieve_course_integration(test_db):
#     """Integration test: Create a course and retrieve it"""
#     course_data = {
#         "course_number": "CS3523",
#         "course_name": "Operating Systems",
#         "year": 2025,
#         "term": "Spring",
#         "active": True,
#         "admin_id": 2,
#         "use_tas": True,
#         "use_fixed_teams": True
#     }
#     
#     # Create course
#     created_course = create_course(course_data)
#     assert created_course.course_id is not None
#     
#     # Retrieve course
#     retrieved_course = get_course(created_course.course_id)
#     assert retrieved_course.course_number == course_data["course_number"]
#     assert retrieved_course.course_name == course_data["course_name"]
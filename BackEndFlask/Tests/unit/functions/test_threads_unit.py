import pytest
from unittest.mock import patch, MagicMock, call
from datetime import datetime, timedelta
from Functions.threads import spawn_thread


class TestGetPendingEmailsData:
    """Unit tests for _get_pending_emails_data helper method"""
    
    @pytest.fixture
    def mock_app_context(self):
        """Mock Flask app context"""
        mock_app = MagicMock()
        mock_context = MagicMock()
        mock_app.app_context.return_value = mock_context
        mock_context.__enter__ = MagicMock(return_value=mock_context)
        mock_context.__exit__ = MagicMock(return_value=False)
        return mock_app
    
    @pytest.fixture
    def processor(self, mock_app_context):
        """Create processor instance"""
        from Functions.threads import EmailValidationProcessor
        return EmailValidationProcessor(mock_app_context)
    
    @patch("models.user.get_user")
    def test_extracts_oldest_timestamp(
        self,
        mock_get_user,
        processor,
        mock_app_context
    ):
        """Test that oldest timestamp is correctly identified"""
        # Arrange
        oldest_date = datetime(2024, 1, 1, 10, 0, 0)
        newer_date = datetime(2024, 1, 5, 10, 0, 0)
        
        mock_user1 = MagicMock()
        mock_user1.last_update = oldest_date
        mock_user1.owner_id = 100
        mock_user1.email = "student1@example.com"
        
        mock_user2 = MagicMock()
        mock_user2.last_update = newer_date
        mock_user2.owner_id = 101
        mock_user2.email = "student2@example.com"
        
        mock_email1 = MagicMock()
        mock_email1.user = mock_user1
        mock_email2 = MagicMock()
        mock_email2.user = mock_user2
        
        mock_owner = MagicMock()
        mock_owner.email = "teacher@example.com"
        mock_get_user.return_value = mock_owner
        
        # Act
        with mock_app_context.app_context():
            oldest_time, emails, mapping = processor._get_pending_emails_data(
                [mock_email1, mock_email2]
            )
        
        # Assert
        assert oldest_time == oldest_date
        assert len(emails) == 2
        assert "student1@example.com" in emails
        assert "student2@example.com" in emails
    
    @patch("models.user.get_user")
    def test_track_oldest_update(
        self,
        mock_get_user,
        processor,
        mock_app_context
    ):
        """Test that oldest timestamp is correctly identified"""
        # Arrange
        oldest_date = datetime(2024, 1, 1, 10, 0, 0)
        newer_date = datetime(2024, 1, 5, 10, 0, 0)
        
        mock_user1 = MagicMock()
        mock_user1.last_update = newer_date
        mock_user1.owner_id = 100
        mock_user1.email = "student1@example.com"
        
        mock_user2 = MagicMock()
        mock_user2.last_update = oldest_date
        mock_user2.owner_id = 101
        mock_user2.email = "student2@example.com"
        
        mock_email1 = MagicMock()
        mock_email1.user = mock_user1
        mock_email2 = MagicMock()
        mock_email2.user = mock_user2
        
        mock_owner = MagicMock()
        mock_owner.email = "teacher@example.com"
        mock_get_user.return_value = mock_owner
        
        # Act
        with mock_app_context.app_context():
            oldest_time, emails, mapping = processor._get_pending_emails_data(
                [mock_email1, mock_email2]
            )
        
        # Assert
        assert oldest_time == oldest_date
        assert len(emails) == 2
        assert "student1@example.com" in emails
        assert "student2@example.com" in emails


    @patch("models.user.get_user")
    def test_creates_correct_email_to_owner_mapping(
        self,
        mock_get_user,
        processor,
        mock_app_context
    ):
        """Test that email to owner mapping is correct"""
        # Arrange
        mock_user = MagicMock()
        mock_user.last_update = datetime.now()
        mock_user.owner_id = 100
        mock_user.email = "student@example.com"
        
        mock_email = MagicMock()
        mock_email.user = mock_user
        
        mock_owner = MagicMock()
        mock_owner.email = "teacher@example.com"
        mock_get_user.return_value = mock_owner
        
        # Act
        with mock_app_context.app_context():
            _, emails, mapping = processor._get_pending_emails_data([mock_email])
        
        # Assert
        assert mapping["student@example.com"] == "teacher@example.com"
        assert emails == ["student@example.com"]
    
    @patch("models.user.get_user")
    def test_skips_emails_with_missing_owners(
        self,
        mock_get_user,
        processor,
        mock_app_context
    ):
        """Test that emails with missing owners are skipped"""
        # Arrange
        mock_user1 = MagicMock()
        mock_user1.last_update = datetime.now()
        mock_user1.owner_id = 100
        mock_user1.email = "student1@example.com"
        
        mock_user2 = MagicMock()
        mock_user2.last_update = datetime.now()
        mock_user2.owner_id = 101
        mock_user2.email = "student2@example.com"
        
        mock_email1 = MagicMock()
        mock_email1.user = mock_user1
        mock_email2 = MagicMock()
        mock_email2.user = mock_user2
        
        mock_owner = MagicMock()
        mock_owner.email = "teacher@example.com"
        
        # First owner exists, second is None
        mock_get_user.side_effect = [mock_owner, None]
        
        # Act
        with mock_app_context.app_context():
            _, emails, mapping = processor._get_pending_emails_data(
                [mock_email1, mock_email2]
            )
        
        # Assert
        assert len(emails) == 1
        assert "student1@example.com" in emails
        assert "student2@example.com" not in emails
        assert "student1@example.com" in mapping
        assert "student2@example.com" not in mapping


def test_spawn_thread_starts_daemon_thread():
    with patch("threading.Thread") as mock_thread_cls:
        mock_thread = MagicMock()
        mock_thread_cls.return_value = mock_thread  # Thread() returns mock instance
        
        # Function to run
        def dummy_func(x, y): 
            pass
        
        spawn_thread(dummy_func, 1, y=2)
        
        # Assert the Thread() constructor was called correctly
        mock_thread_cls.assert_called_once_with(
            target=dummy_func,
            args=(1,),
            kwargs={"y": 2},
            daemon=True
        )

        mock_thread.start.assert_called_once()

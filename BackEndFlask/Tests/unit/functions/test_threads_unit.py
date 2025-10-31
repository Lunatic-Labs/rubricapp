import pytest
from unittest.mock import patch, MagicMock, call
from datetime import datetime, timedelta
from Functions import threads


class TestEmailValidationProcessor:
    """Unit tests for EmailValidationProcessor class - business logic only"""
    
    def setup_method(self):
        # Reset the global processor before each test
        threads._email_processor = None

    def teardown_method(self):
        if threads._email_processor:
            threads._email_processor.stop()
            threads._email_processor = None

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
        """Create a processor instance with mocked app"""
        from Functions.threads import EmailValidationProcessor
        return EmailValidationProcessor(mock_app_context)
    
    @pytest.fixture
    def sample_email_objects(self):
        """Create sample email validation objects for testing"""
        mock_user1 = MagicMock()
        mock_user1.last_update = datetime(2024, 1, 1, 12, 0, 0)
        mock_user1.owner_id = 100
        mock_user1.email = "student1@example.com"
        
        mock_user2 = MagicMock()
        mock_user2.last_update = datetime(2024, 1, 3, 12, 0, 0)
        mock_user2.owner_id = 101
        mock_user2.email = "student2@example.com"
        
        mock_email1 = MagicMock()
        mock_email1.user = mock_user1
        
        mock_email2 = MagicMock()
        mock_email2.user = mock_user2
        
        return [mock_email1, mock_email2]
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    @patch("Functions.threads.mark_emails_as_checked")
    @patch("models.user.get_user")
    @patch("Functions.threads.get_emails_need_checking")
    def test_process_pending_emails_once_success(
        self,
        mock_get_emails,
        mock_get_user,
        mock_mark_checked,
        mock_check_bounced,
        mock_send_notification,
        processor,
        sample_email_objects,
        mock_app_context
    ):
        """Test successful processing of pending emails with bounces"""
        # Arrange
        mock_get_emails.return_value = sample_email_objects
        
        mock_owner1 = MagicMock()
        mock_owner1.email = "teacher1@example.com"
        mock_owner2 = MagicMock()
        mock_owner2.email = "teacher2@example.com"
        mock_get_user.side_effect = [mock_owner1, mock_owner2]
        
        mock_check_bounced.return_value = [
            {
                "to": "student1@example.com",
                "msg": "550 Mailbox not found",
                "main_failure": "Invalid recipient"
            }
        ]
        
        # Act
        with mock_app_context.app_context():
            result = processor.process_pending_emails_once()
        
        # Assert
        assert result == 2
        mock_get_emails.assert_called_once()
        mock_get_user.assert_has_calls([call(100), call(101)])
        mock_mark_checked.assert_called_once_with([
            "student1@example.com",
            "student2@example.com"
        ])
        mock_check_bounced.assert_called_once()
        mock_send_notification.assert_called_once_with(
            "teacher1@example.com",
            "550 Mailbox not found",
            "Invalid recipient"
        )
    
    @patch("Functions.threads.get_emails_need_checking")
    def test_process_pending_emails_once_no_pending_emails(
        self,
        mock_get_emails,
        processor,
        mock_app_context
    ):
        """Test behavior when no pending emails exist"""
        # Arrange
        mock_get_emails.return_value = []
        
        # Act
        with mock_app_context.app_context():
            result = processor.process_pending_emails_once()
        
        # Assert
        assert result == 0
        mock_get_emails.assert_called_once()
    
    @patch("Functions.threads.get_emails_need_checking")
    def test_process_pending_emails_once_handles_exception(
        self,
        mock_get_emails,
        processor,
        mock_app_context
    ):
        """Test exception handling in process_pending_emails_once"""
        # Arrange
        mock_get_emails.side_effect = Exception("Database connection error")
        
        # Act
        with mock_app_context.app_context():
            result = processor.process_pending_emails_once()
        
        # Assert
        assert result is None
        mock_get_emails.assert_called_once()
    
    @patch("Functions.threads.mark_emails_as_checked")
    @patch("models.user.get_user")
    @patch("Functions.threads.get_emails_need_checking")
    def test_process_pending_emails_once_missing_owner(
        self,
        mock_get_emails,
        mock_get_user,
        mock_mark_checked,
        processor,
        sample_email_objects,
        mock_app_context
    ):
        """Test handling when owner user does not exist"""
        # Arrange
        mock_get_emails.return_value = [sample_email_objects[0]]
        mock_get_user.return_value = None  # Owner not found
        
        # Act
        with mock_app_context.app_context():
            result = processor.process_pending_emails_once()
        
        # Assert
        assert result == 0
        # Email should still be marked as checked even without owner
        mock_mark_checked.assert_called_once_with([])
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    @patch("Functions.threads.mark_emails_as_checked")
    @patch("models.user.get_user")
    @patch("Functions.threads.get_emails_need_checking")
    def test_process_pending_emails_once_no_bounces(
        self,
        mock_get_emails,
        mock_get_user,
        mock_mark_checked,
        mock_check_bounced,
        mock_send_notification,
        processor,
        sample_email_objects,
        mock_app_context
    ):
        """Test processing when no bounces are found"""
        # Arrange
        mock_get_emails.return_value = sample_email_objects
        
        mock_owner = MagicMock()
        mock_owner.email = "teacher@example.com"
        mock_get_user.return_value = mock_owner
        
        mock_check_bounced.return_value = []  # No bounces
        
        # Act
        with mock_app_context.app_context():
            result = processor.process_pending_emails_once()
        
        # Assert
        assert result == 2
        mock_mark_checked.assert_called_once()
        mock_send_notification.assert_not_called()
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    @patch("Functions.threads.mark_emails_as_checked")
    @patch("models.user.get_user")
    @patch("Functions.threads.get_emails_need_checking")
    def test_process_pending_emails_once_check_bounced_returns_none(
        self,
        mock_get_emails,
        mock_get_user,
        mock_mark_checked,
        mock_check_bounced,
        mock_send_notification,
        processor,
        sample_email_objects,
        mock_app_context
    ):
        """Test when check_bounced_emails returns None"""
        # Arrange
        mock_get_emails.return_value = sample_email_objects
        
        mock_owner = MagicMock()
        mock_owner.email = "teacher@example.com"
        mock_get_user.return_value = mock_owner
        
        mock_check_bounced.return_value = None
        
        # Act
        with mock_app_context.app_context():
            result = processor.process_pending_emails_once()
        
        # Assert
        assert result == 2
        mock_mark_checked.assert_called_once()
        mock_send_notification.assert_not_called()


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
        mock_user1.last_update = older_date = oldest_date
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


class TestProcessBouncedEmails:
    """Unit tests for _process_bounced_emails helper method"""
    
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
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    def test_sends_notifications_for_bounced_emails(
        self,
        mock_check_bounced,
        mock_send_notification,
        processor,
        mock_app_context
    ):
        """Test successful bounce notification sending"""
        # Arrange
        oldest_time = datetime(2024, 1, 1, 12, 0, 0)
        email_to_owner_map = {
            "student1@example.com": "teacher1@example.com",
            "student2@example.com": "teacher2@example.com"
        }
        
        mock_check_bounced.return_value = [
            {
                "to": "student1@example.com",
                "msg": "Mailbox unavailable",
                "main_failure": "User unknown"
            }
        ]
        
        # Act
        with mock_app_context.app_context():
            count = processor._process_bounced_emails(oldest_time, email_to_owner_map)
        
        # Assert
        assert count == 1
        mock_check_bounced.assert_called_once_with(int(oldest_time.timestamp()))
        mock_send_notification.assert_called_once_with(
            "teacher1@example.com",
            "Mailbox unavailable",
            "User unknown"
        )
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    def test_handles_multiple_bounced_emails(
        self,
        mock_check_bounced,
        mock_send_notification,
        processor,
        mock_app_context
    ):
        """Test processing multiple bounced emails"""
        # Arrange
        oldest_time = datetime(2024, 1, 1, 12, 0, 0)
        email_to_owner_map = {
            "student1@example.com": "teacher1@example.com",
            "student2@example.com": "teacher2@example.com"
        }
        
        mock_check_bounced.return_value = [
            {"to": "student1@example.com", "msg": "Error 1", "main_failure": "Fail 1"},
            {"to": "student2@example.com", "msg": "Error 2", "main_failure": "Fail 2"}
        ]
        
        # Act
        with mock_app_context.app_context():
            count = processor._process_bounced_emails(oldest_time, email_to_owner_map)
        
        # Assert
        assert count == 2
        assert mock_send_notification.call_count == 2
    
    @patch("models.utility.check_bounced_emails")
    def test_returns_zero_when_check_bounced_returns_none(
        self,
        mock_check_bounced,
        processor,
        mock_app_context
    ):
        """Test behavior when check_bounced_emails returns None"""
        # Arrange
        oldest_time = datetime(2024, 1, 1, 12, 0, 0)
        email_to_owner_map = {"student@example.com": "teacher@example.com"}
        
        mock_check_bounced.return_value = None
        
        # Act
        with mock_app_context.app_context():
            count = processor._process_bounced_emails(oldest_time, email_to_owner_map)
        
        # Assert
        assert count == 0
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    def test_skips_bounces_with_missing_to_field(
        self,
        mock_check_bounced,
        mock_send_notification,
        processor,
        mock_app_context
    ):
        """Test that bounces without 'to' field are skipped"""
        # Arrange
        oldest_time = datetime(2024, 1, 1, 12, 0, 0)
        email_to_owner_map = {"student@example.com": "teacher@example.com"}
        
        mock_check_bounced.return_value = [
            {"msg": "Error", "main_failure": "Fail"}  # Missing 'to' field
        ]
        
        # Act
        with mock_app_context.app_context():
            count = processor._process_bounced_emails(oldest_time, email_to_owner_map)
        
        # Assert
        assert count == 0
        mock_send_notification.assert_not_called()
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    def test_skips_bounces_for_unknown_recipients(
        self,
        mock_check_bounced,
        mock_send_notification,
        processor,
        mock_app_context
    ):
        """Test that bounces for unknown recipients are skipped"""
        # Arrange
        oldest_time = datetime(2024, 1, 1, 12, 0, 0)
        email_to_owner_map = {"student@example.com": "teacher@example.com"}
        
        mock_check_bounced.return_value = [
            {
                "to": "unknown@example.com",  # Not in mapping
                "msg": "Error",
                "main_failure": "Fail"
            }
        ]
        
        # Act
        with mock_app_context.app_context():
            count = processor._process_bounced_emails(oldest_time, email_to_owner_map)
        
        # Assert
        assert count == 0
        mock_send_notification.assert_not_called()
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    def test_continues_processing_after_notification_failure(
        self,
        mock_check_bounced,
        mock_send_notification,
        processor,
        mock_app_context
    ):
        """Test that processing continues if one notification fails"""
        # Arrange
        oldest_time = datetime(2024, 1, 1, 12, 0, 0)
        email_to_owner_map = {
            "student1@example.com": "teacher1@example.com",
            "student2@example.com": "teacher2@example.com"
        }
        
        mock_check_bounced.return_value = [
            {"to": "student1@example.com", "msg": "Error 1", "main_failure": "Fail 1"},
            {"to": "student2@example.com", "msg": "Error 2", "main_failure": "Fail 2"}
        ]
        
        # First notification fails, second succeeds
        mock_send_notification.side_effect = [Exception("SMTP error"), None]
        
        # Act
        with mock_app_context.app_context():
            count = processor._process_bounced_emails(oldest_time, email_to_owner_map)
        
        # Assert
        assert count == 1  # Only second succeeded
        assert mock_send_notification.call_count == 2


class TestProcessorControlMethods:
    """Unit tests for processor control methods"""
    
    def test_stop_method_sets_flag(self):
        """Test that stop() sets the _should_stop flag"""
        # Arrange
        from Functions.threads import EmailValidationProcessor
        mock_app = MagicMock()
        processor = EmailValidationProcessor(mock_app)
        
        # Act
        assert processor._should_stop is False
        processor.stop()
        
        # Assert
        assert processor._should_stop is True
    
    @patch("Functions.threads.time.sleep")
    @patch("Functions.threads.get_emails_need_checking")
    def test_run_continuous_uses_initial_delay(
        self,
        mock_get_emails,
        mock_sleep
    ):
        """Test that run_continuous respects initial_delay parameter"""
        # Arrange
        from Functions.threads import EmailValidationProcessor
        mock_app = MagicMock()
        mock_app.app_context.return_value.__enter__ = MagicMock()
        mock_app.app_context.return_value.__exit__ = MagicMock()
        
        processor = EmailValidationProcessor(mock_app)
        mock_get_emails.return_value = []
        
        call_count = 0
        def sleep_side_effect(duration):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                assert duration == 15  # initial_delay
                processor.stop()
        
        mock_sleep.side_effect = sleep_side_effect
        
        # Act
        processor.run_continuous(sleep_interval=30, initial_delay=15)
        
        # Assert
        assert call_count >= 1
    
    @patch("Functions.threads.time.sleep")
    @patch("Functions.threads.get_emails_need_checking")
    def test_run_continuous_uses_sleep_interval(
        self,
        mock_get_emails,
        mock_sleep
    ):
        """Test that run_continuous respects sleep_interval parameter"""
        # Arrange
        from Functions.threads import EmailValidationProcessor
        mock_app = MagicMock()
        mock_app.app_context.return_value.__enter__ = MagicMock()
        mock_app.app_context.return_value.__exit__ = MagicMock()
        
        processor = EmailValidationProcessor(mock_app)
        mock_get_emails.return_value = []
        
        call_count = 0
        def sleep_side_effect(duration):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                pass  # initial_delay
            elif call_count == 2:
                assert duration == 45  # sleep_interval
                processor.stop()
        
        mock_sleep.side_effect = sleep_side_effect
        
        # Act
        processor.run_continuous(sleep_interval=45, initial_delay=0)
        
        # Assert
        assert call_count >= 2


class TestStandaloneFunctions:
    """Unit tests for standalone helper functions"""
    
    @patch("models.utility.send_bounced_email_notification")
    @patch("models.utility.check_bounced_emails")
    @patch("Functions.threads.mark_emails_as_checked")
    @patch("models.user.get_user")
    @patch("Functions.threads.get_emails_need_checking")
    def test_process_pending_emails_once_function(
        self,
        mock_get_emails,
        mock_get_user,
        mock_mark_checked,
        mock_check_bounced,
        mock_send_notification
    ):
        """Test the standalone process_pending_emails_once function"""
        # Arrange
        from Functions.threads import process_pending_emails_once
        
        mock_user = MagicMock()
        mock_user.last_update = datetime.now()
        mock_user.owner_id = 100
        mock_user.email = "student@example.com"
        
        mock_email = MagicMock()
        mock_email.user = mock_user
        mock_get_emails.return_value = [mock_email]
        
        mock_owner = MagicMock()
        mock_owner.email = "teacher@example.com"
        mock_get_user.return_value = mock_owner
        
        mock_check_bounced.return_value = []
        
        # Act
        result = process_pending_emails_once()
        
        # Assert
        assert result == 1
        mock_get_emails.assert_called_once()
        mock_mark_checked.assert_called_once()
    
    @patch("Functions.threads.threading.Thread")
    def test_spawn_thread_creates_daemon_thread(self, mock_thread_class):
        """Test that spawn_thread creates a daemon thread"""
        # Arrange
        from Functions.threads import spawn_thread
        
        mock_thread_instance = MagicMock()
        mock_thread_class.return_value = mock_thread_instance
        
        def dummy_func(arg1, arg2, kwarg1=None):
            pass
        
        # Act
        spawn_thread(dummy_func, "value1", "value2", kwarg1="kwvalue")
        
        # Assert
        mock_thread_class.assert_called_once_with(
            target=dummy_func,
            args=("value1", "value2"),
            kwargs={"kwarg1": "kwvalue"},
            daemon=True
        )
        mock_thread_instance.start.assert_called_once()
    
    @patch("Functions.threads.time.sleep")
    @patch("Functions.threads.get_emails_need_checking")
    def test_validate_pending_emails_can_be_stopped(
        self,
        mock_get_emails,
        mock_sleep
    ):
        """Test that validate_pending_emails can be stopped gracefully"""
        # Arrange
        from Functions.threads import validate_pending_emails, stop_email_validation
        
        mock_get_emails.return_value = []
        
        call_count = 0
        def sleep_side_effect(duration):
            nonlocal call_count
            call_count += 1
            if call_count >= 2:
                stop_email_validation()
        
        mock_sleep.side_effect = sleep_side_effect
        
        # Act
        validate_pending_emails(sleep_interval=0, initial_delay=0)
        
        # Assert
        assert call_count >= 2

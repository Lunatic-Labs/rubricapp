import pytest
from unittest.mock import patch, MagicMock, call
from models.utility import *
from controller.Routes.RouteExceptions import *
import string
from time import time


class TestGenerateRandomPassword:
    """Unit tests for generate_random_password function"""
    
    def test_generates_correct_length(self):
        """Test that password has the correct length"""
        
        # Test various lengths
        for length in [8, 12, 16, 20]:
            password = generate_random_password(length)
            assert len(password) == length
    
    def test_contains_only_valid_characters(self):
        """Test that password contains only letters and digits"""
        
        valid_chars = set(string.ascii_letters + string.digits)
        password = generate_random_password(20)
        
        for char in password:
            assert char in valid_chars
    
    def test_generates_different_passwords(self):
        """Test that multiple calls generate different passwords"""
        
        passwords = [generate_random_password(16) for _ in range(10)]
        
        # All passwords should be unique (extremely high probability)
        assert len(set(passwords)) == len(passwords)
    
    def test_generates_password_with_minimum_length(self):
        """Test generating password with length 1"""
        
        password = generate_random_password(1)
        assert len(password) == 1
    
    def test_generates_long_password(self):
        """Test generating a very long password"""
        
        password = generate_random_password(100)
        assert len(password) == 100


class TestErrorLogDecorator:
    """Unit tests for error_log decorator"""
    
    def test_decorator_allows_successful_function_execution(self):
        """Test that decorator doesn't interfere with normal execution"""
        
        @error_log
        def successful_function(x, y):
            return x + y
        
        result = successful_function(2, 3)
        assert result == 5
    
    def test_decorator_logs_and_reraises_exception(self):
        """Test that decorator logs errors and re-raises them"""
        
        @error_log
        def failing_function():
            raise ValueError("Test error")
        
        with patch('models.utility.logger.error') as mock_logger:
            with pytest.raises(ValueError, match="Test error"):
                failing_function()
            
            # Verify logger was called
            assert mock_logger.called
            # Check that error message contains relevant info
            call_args = mock_logger.call_args[0][0]
            assert "ValueError" in call_args
            assert "Test error" in call_args
    
    def test_decorator_logs_different_exception_types(self):
        """Test decorator handles different exception types"""
        
        @error_log
        def type_error_function():
            raise TypeError("Type error message")
        
        @error_log
        def runtime_error_function():
            raise RuntimeError("Runtime error message")
        
        with patch('models.utility.logger.error'):
            with pytest.raises(TypeError):
                type_error_function()
            
            with pytest.raises(RuntimeError):
                runtime_error_function()
    
    def test_decorator_preserves_function_arguments(self):
        """Test that decorator preserves function arguments"""
        
        @error_log
        def function_with_args(a, b, c=None):
            return (a, b, c)
        
        result = function_with_args(1, 2, c=3)
        assert result == (1, 2, 3)


class TestCheckBouncedEmails:
    """Unit tests for check_bounced_emails function - mocked SendGrid"""
    
    @patch('models.utility.config')
    def test_returns_none_when_running_locally(self, mock_config):
        """Test that function returns None when running locally"""
        
        mock_config.rubricapp_running_locally = True
        
        result = check_bounced_emails()
        
        assert result is None
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.config')
    @patch('models.utility.time.time', return_value=1000000)
    def test_uses_default_lookback_when_no_timestamp(
        self,
        mock_time,
        mock_config,
        mock_sendgrid
    ):
        """Test default 30-day lookback when no timestamp provided"""
        
        mock_config.rubricapp_running_locally = False
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.body = []
        mock_sendgrid.client.suppression.bounces.get.return_value = mock_response
        
        check_bounced_emails()
        
        # Verify the start_time parameter
        call_kwargs = mock_sendgrid.client.suppression.bounces.get.call_args[1]
        expected_timestamp = 1000000 - (30 * 86400)
        print("Actual:", call_kwargs['query_params']['start_time'])
        print("Expected:", expected_timestamp)

        assert call_kwargs['query_params']['start_time'] == expected_timestamp
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.config')
    def test_uses_provided_timestamp(self, mock_config, mock_sendgrid):
        """Test that provided timestamp is used"""
        
        mock_config.rubricapp_running_locally = False
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.body = []
        mock_sendgrid.client.suppression.bounces.get.return_value = mock_response
        
        custom_timestamp = 1234567890
        check_bounced_emails(from_timestamp=custom_timestamp)
        
        call_kwargs = mock_sendgrid.client.suppression.bounces.get.call_args[1]
        assert call_kwargs['query_params']['start_time'] == custom_timestamp
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.config')
    def test_returns_formatted_bounced_emails(self, mock_config, mock_sendgrid):
        """Test that bounced emails are correctly formatted"""
        
        mock_config.rubricapp_running_locally = False
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.body = [
            {
                'created': 1234567890,
                'email': 'bounced@example.com',
                'status': '550 User not found',
                'reason': 'Invalid recipient'
            }
        ]
        mock_sendgrid.client.suppression.bounces.get.return_value = mock_response
        
        result = check_bounced_emails()
        
        assert len(result) == 1
        assert result[0]['id'] == 1234567890
        assert result[0]['to'] == 'bounced@example.com'
        assert result[0]['msg'] == '550 User not found'
        assert result[0]['main_failure'] == 'Invalid recipient'
        assert 'sender' in result[0]
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.config')
    def test_returns_none_when_no_bounces(self, mock_config, mock_sendgrid):
        """Test that None is returned when no bounced emails"""
        
        mock_config.rubricapp_running_locally = False
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.body = []
        mock_sendgrid.client.suppression.bounces.get.return_value = mock_response
        
        result = check_bounced_emails()
        
        assert result is None
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.config')
    def test_respects_max_fetched_emails_limit(self, mock_config, mock_sendgrid):
        """Test that MAX_FETCHED_EMAILS limit is applied"""
        
        mock_config.rubricapp_running_locally = False
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.body = []
        mock_sendgrid.client.suppression.bounces.get.return_value = mock_response
        
        check_bounced_emails()
        
        call_kwargs = mock_sendgrid.client.suppression.bounces.get.call_args[1]
        assert call_kwargs['query_params']['limit'] == 32
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.config')
    def test_raises_email_failure_exception_on_error(
        self,
        mock_config,
        mock_sendgrid
    ):
        """Test that EmailFailureException is raised on error"""
        
        mock_config.rubricapp_running_locally = False
        mock_config.logger = MagicMock()
        mock_sendgrid.client.suppression.bounces.get.side_effect = Exception("API Error")
        
        with pytest.raises(EmailFailureException):
            check_bounced_emails()
        
        assert mock_config.logger.error.called


class TestSendEmail:
    """Unit tests for send_email function"""
    
    @patch('models.utility.config')
    def test_returns_none_when_running_locally(self, mock_config):
        """Test that function returns early when running locally"""
        
        mock_config.rubricapp_running_locally = True
        
        result = send_email(
            "test@example.com",
            "Subject",
            "Content",
            EmailContentType.PLAIN_TEXT_CONTENT
        )
        
        assert result is None
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.Mail')
    @patch('models.utility.config')
    def test_creates_mail_with_correct_parameters(
        self,
        mock_config,
        mock_mail_class,
        mock_sendgrid
    ):
        """Test that Mail object is created with correct parameters"""
        
        mock_config.rubricapp_running_locally = False
        mock_mail_instance = MagicMock()
        mock_mail_class.return_value = mock_mail_instance
        
        send_email(
            "recipient@example.com",
            "Test Subject",
            "Test Content",
            EmailContentType.PLAIN_TEXT_CONTENT
        )
        
        # Verify Mail was called with correct kwargs
        call_kwargs = mock_mail_class.call_args[1]
        assert call_kwargs['to_emails'] == "recipient@example.com"
        assert call_kwargs['subject'] == "Test Subject"
        assert 'from_email' in call_kwargs
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.Mail')
    @patch('models.utility.config')
    def test_sends_email_via_sendgrid(
        self,
        mock_config,
        mock_mail_class,
        mock_sendgrid
    ):
        """Test that email is sent via SendGrid client"""
        
        mock_config.rubricapp_running_locally = False
        mock_mail_instance = MagicMock()
        mock_mail_class.return_value = mock_mail_instance
        
        send_email(
            "test@example.com",
            "Subject",
            "Content",
            EmailContentType.PLAIN_TEXT_CONTENT
        )
        
        mock_sendgrid.send.assert_called_once_with(mock_mail_instance)
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.Mail')
    @patch('models.utility.config')
    def test_raises_email_failure_exception_on_error(
        self,
        mock_config,
        mock_mail_class,
        mock_sendgrid
    ):
        """Test that EmailFailureException is raised on send error"""
        
        mock_config.rubricapp_running_locally = False
        mock_config.logger = MagicMock()
        mock_sendgrid.send.side_effect = Exception("SendGrid error")
        
        with pytest.raises(EmailFailureException):
            send_email(
                "test@example.com",
                "Subject",
                "Content",
                EmailContentType.PLAIN_TEXT_CONTENT
            )
        
        assert mock_config.logger.error.called
    
    @patch('models.utility.sendgrid_client')
    @patch('models.utility.Mail')
    @patch('models.utility.config')
    def test_handles_html_content_type(
        self,
        mock_config,
        mock_mail_class,
        mock_sendgrid
    ):
        """Test sending HTML email"""
        
        mock_config.rubricapp_running_locally = False
        
        html_content = "<html><body>Test</body></html>"
        send_email(
            "test@example.com",
            "Subject",
            html_content,
            EmailContentType.HTML_CONTENT
        )
        
        call_kwargs = mock_mail_class.call_args[1]
        assert EmailContentType.HTML_CONTENT.value in call_kwargs


class TestSendBouncedEmailNotification:
    """Unit tests for send_bounced_email_notification function"""
    
    @patch('models.utility.send_email')
    def test_sends_email_with_correct_parameters(self, mock_send_email):
        """Test that notification email is sent with correct parameters"""
        
        send_bounced_email_notification(
            "teacher@example.com",
            "Mailbox not found",
            "User does not exist"
        )
        
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args[0]
        
        assert call_args[0] == "teacher@example.com"
        assert "failed to send" in call_args[1]
        assert "Mailbox not found" in call_args[2]
        assert "User does not exist" in call_args[2]
    
    @patch('models.utility.send_email')
    def test_includes_error_details_in_message(self, mock_send_email):
        """Test that error details are included in message body"""
        
        msg = "550 Rejected"
        failure = "Spam detected"
        
        send_bounced_email_notification("admin@example.com", msg, failure)
        
        message_body = mock_send_email.call_args[0][2]
        assert msg in message_body
        assert failure in message_body


class TestSendEmailForUpdatedEmail:
    """Unit tests for send_email_for_updated_email function"""
    
    @patch('models.utility.send_email')
    def test_sends_update_notification(self, mock_send_email):
        """Test that update notification is sent"""
        
        new_email = "newemail@example.com"
        send_email_for_updated_email(new_email)
        
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args[0]
        
        assert call_args[0] == new_email
        assert "updated" in call_args[1].lower()
        assert new_email in call_args[2]
        assert "skill-builder.net" in call_args[2]


class TestSendNewUserEmail:
    """Unit tests for send_new_user_email function"""
    
    @patch('models.utility.send_email')
    def test_sends_welcome_email_with_credentials(self, mock_send_email):
        """Test that welcome email contains username and password"""
        
        email = "newuser@example.com"
        password = "TempPass123"
        
        send_new_user_email(email, password)
        
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args[0]
        
        assert call_args[0] == email
        assert "Welcome" in call_args[1]
        
        message = call_args[2]
        assert email in message
        assert password in message
        assert "skill-builder.net" in message
        assert "change your password" in message.lower()


class TestSendResetCodeEmail:
    """Unit tests for send_reset_code_email function"""
    
    @patch('models.utility.send_email')
    def test_sends_reset_code_email(self, mock_send_email):
        """Test that reset code email is sent with HTML content"""
        
        email = "user@example.com"
        code = "ABC123"
        
        send_reset_code_email(email, code)
        
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args[0]
        
        assert call_args[0] == email
        assert "Reset" in call_args[1] or "reset" in call_args[1]
        assert code in call_args[2]
        assert call_args[3] == EmailContentType.HTML_CONTENT
    
    @patch('models.utility.send_email')
    def test_reset_code_email_contains_html(self, mock_send_email):
        """Test that reset code email contains HTML tags"""
        
        send_reset_code_email("user@example.com", "XYZ789")
        
        message = mock_send_email.call_args[0][2]
        assert "<html>" in message or "<!DOCTYPE html>" in message
        assert "<b>XYZ789</b>" in message


class TestEmailStudentsFeedbackIsReadyToView:
    """Unit tests for email_students_feedback_is_ready_to_view function"""
    
    @patch('models.utility.send_email')
    def test_sends_email_to_each_student(self, mock_send_email):
        """Test that email is sent to each student in the list"""
        
        # Create mock students
        student1 = MagicMock()
        student1.first_name = "John"
        student1.last_name = "Doe"
        student1.email = "john@example.com"
        
        student2 = MagicMock()
        student2.first_name = "Jane"
        student2.last_name = "Smith"
        student2.email = "jane@example.com"
        
        students = [student1, student2]
        notification_msg = "Please review your feedback"
        
        email_students_feedback_is_ready_to_view(students, notification_msg)
        
        assert mock_send_email.call_count == 2
    
    @patch('models.utility.send_email')
    def test_includes_student_name_and_notification_message(self, mock_send_email):
        """Test that email includes student name and custom message"""
        
        student = MagicMock()
        student.first_name = "Alice"
        student.last_name = "Johnson"
        student.email = "alice@example.com"
        
        custom_message = "Great work this semester!"
        
        email_students_feedback_is_ready_to_view([student], custom_message)
        
        call_args = mock_send_email.call_args[0]
        message_body = call_args[2]
        
        assert "Alice" in message_body
        assert "Johnson" in message_body
        assert custom_message in message_body
    
    @patch('models.utility.send_email')
    def test_handles_empty_student_list(self, mock_send_email):
        """Test behavior with empty student list"""
        
        email_students_feedback_is_ready_to_view([], "Test message")
        
        mock_send_email.assert_not_called()



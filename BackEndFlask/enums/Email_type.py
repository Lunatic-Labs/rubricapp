import enum

class EmailContentType(enum):
    """Represents the type of the email content."""

    PLAIN_TEXT_CONTENT = 'plain_text_content'
    HTML_CONTENT       = 'html_content'
    AMP_HTML_CONTENT   = 'amp_html_content'
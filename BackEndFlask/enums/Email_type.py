#---------------------------------------------------
# Contains system-wide email enums.
#---------------------------------------------------

from enum import Enum

class EmailContentType(Enum):
    """Represents the type of the email content."""

    PLAIN_TEXT_CONTENT = 'plain_text_content'
    HTML_CONTENT       = 'html_content'
    AMP_HTML_CONTENT   = 'amp_html_content'
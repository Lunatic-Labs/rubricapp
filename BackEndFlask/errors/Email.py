"""
Custom exceptions for email-related failures.

This module is the home for errors raised by email lookups and handling.
Define a new exception here instead of raising a bare ``ValueError`` or
``Exception`` inline, so callers can catch the specific failure.

Conventions:
    - Subclass ``Exception`` (or a more specific built-in when it fits).
    - Build the user-facing message in ``__init__`` and expose it through
      ``self.message`` and ``__str__``.
    - Keep messages safe to show to a client: describe what was wrong with
      the input, and never include query text, schema details or stack
      information.
"""


class NoUserForEmail(Exception):
    """
    Raised when no user corresponds to an email.

    Args:
        email (str): The email address in question.

    Attributes:
        message (str): Description with the email that failed the lookup.
    """

    def __init__(self, email):
        self.message = f"No user was found with email: {email}."

    def __str__(self):
        return self.message


class UnacceptableEmail(Exception):
    """
    Raised when an email cannot be used for a requested operation.

    Args:
        email (str): The rejected email address.

    Attributes:
        message (str): Description of the failure.
    """

    def __init__(self, email):
        self.message = f"Email cannot perform the operation: {email}"

    def __str__(self):
        return self.message

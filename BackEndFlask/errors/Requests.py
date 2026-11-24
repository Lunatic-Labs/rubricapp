"""
Custom exceptions for malformed or invalid client requests.

This module is the home for errors raised when a request body or its
parameters are the wrong shape, for example a missing JSON body or a field
of the wrong type. Define a new exception here instead of raising a builtin
such as ``ValueError`` or ``AttributeError`` for request problems, so routes
can catch exactly these failures and nothing else.

Conventions:
    - Subclass ``Exception`` (or a more specific class defined here).
    - Build the client-facing message in ``__init__`` and expose it through
      ``self.message`` and ``__str__``.
    - Keep messages safe to show to a client: describe what was wrong with
      the input, and never include query text, schema details or stack
      information.
    - Routes should map these exceptions to a 400 response.
"""


class InvalidRequestBody(Exception):
    """
    Raised when the request body is not shaped as the route expects it.

    Args:
        message (str): Client-safe description of what was wrong with the request.

    Attributes:
        message (str): Client-safe description of what was wrong with the request.
    """

    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message

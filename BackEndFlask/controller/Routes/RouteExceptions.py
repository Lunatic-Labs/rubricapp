"""
Custom exceptions used throughout the Routes directory.
"""

"""
Description:
Given an array of string elements, the
exception returns the string of `Missing`
plus the array of string elements
seperated by ` or `.

Parameters:
arr: The list of string elements to append
to the class exception message.
"""
class MissingException(Exception):
    def __init__(self, arr: list) -> None:
        message = "Missing"

        for index, var in enumerate(arr):
            message += f" {var}"

            if index != (len(arr) - 1):
                message += " or"

        self.message = message

    def __str__(self) -> str:
        return self.message


"""
Description:
Returns the exception with the message of
`Invalid Credentials`.

Parameters:
None
"""
class InvalidCredentialsException(Exception):
    def __init__(self) -> None:
        self.message = "Invalid Credentials"
    
    def __str__(self) -> str:
        return self.message
    
"""
Description:
Returns the exception with the message of
`Email failure`.

Parameters:
None
"""
class EmailFailureException(Exception):
    def __init__(self) -> None:
        self.message = "Email failure"
    
    def __str__(self) -> str:
        return self.message
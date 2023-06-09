"""
Custom exceptions used throughout the Functions directory
"""

class FileNotFoundError(Exception):
    error = "File not found or does not exist!"

class WrongExtension(Exception):
    error = "Raised when the submitted file is not a csv"

class TooManyColumns(Exception):
    error = "Raised when the submitted file has more columns than excepted"

class NotEnoughColumns(Exception):
    error = "Raised when the submitted file has less columns than expected"

class SuspectedMisformatting(Exception):
    error = "Raised when the submitted file has an unexpected value, type, or format for a column other than the header"

class UserDoesNotExist(Exception):
    error = "Raised when the submitted file has one email not associated to an existing user"

class UsersDoNotExist(Exception):
    error = "Raised when the submitted file has more than one email not associated to an existing user"

class TANotYetAddedToCourse(Exception):
    error = "Raised when the submitted file has an existing TA who has not been assigned to the course"

class StudentNotEnrolledInThisCourse(Exception):
    error = "Raised when the submitted file has a student email associated to an existing student who is not enrolled in the course"

class InconsistentObserverID(Exception):
    error = "Raised when more than one observer is being assigned to a team"

class NoTAsListed(Exception):
    error = "Raised when the course uses TAs, but no TAs were assigned to the course"

class NoStudentsInCourse(Exception):
    error = "Raised when the course has no assigned students"

class OwnerIDDidNotCreateTheCourse(Exception):
    error = "Raised when the specified owner did not create the corresponding course"
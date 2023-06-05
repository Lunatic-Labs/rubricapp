"""
This file contains some custom error handling instatiating
for exceptions that are called throughout the functions in this directory.
"""


class WrongExtension(Exception):
    "Raised when a file that does not have a .csv extension is submitted"
    pass

class TooManyColumns(Exception):
    "Raised when there are more than the excepted columns in the file submitted"
    pass

class NotEnoughColumns(Exception):
    "Raised when there are fewer than the expected columns in the file submitted"
    pass

class SuspectedMisformatting(Exception):
    "Raised when a column other than the header contains an unexpected value type or format"
    pass

class UserDoesNotExist(Exception):
    "Raised when an email in the file is not associated with an existing user"
    pass

class UsersDoNotExist(Exception):
    "Raised when at least one email in the file is not associated with an existing user"
    pass

class TANotYetAddedToCourse(Exception):
    "Raised when a TA in the file exists, but is not yet added to this course"
    pass

class StudentNotEnrolledInThisCourse(Exception):
    "Raised when a student email in the file is associated with a student user who is not enrolled in this course"
    pass

class InconsistentObserverID(Exception):
    "Raised when an attempt is made to assign more than one observer to a team"
    pass

class NoTAsListed(Exception):
    "Raised when course is listed as using TAs, but there are no TAs associated with the course_id"
    pass

class NoStudentsInCourse(Exception):
    "Raise when no students associated with the course_id are found"
    pass
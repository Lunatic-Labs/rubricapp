"""
Custom exceptions used throughout the Functions directory
"""

from yagmail import message


class FileNotFound(Exception):
    def __init__(self):
        self.message = "File not found or does not exist!"
    def __str__(self):
        return self.message

class WrongExtension(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file is not a csv or xlsx"
    def __str__(self):
        return self.message

class TooManyColumns(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has more columns than excepted"
    def __str__(self):
        return self.message

class NotEnoughColumns(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has less columns than expected"
    def __str__(self):
        return self.message

class SuspectedMisformatting(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has an unexpected value, type, or format for a column other than the header"
    def __str__(self):
        return self.message

class UserDoesNotExist(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has one email not associated to an existing user"
    def __str__(self):
        return self.message

class UsersDoNotExist(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has more than one email not associated to an existing user"
    def __str__(self):
        return self.message

class TANotYetAddedToCourse(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has an existing TA who has not been assigned to the course"
    def __str__(self):
        return self.message

class StudentNotEnrolledInThisCourse(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has a student email associated to an existing student who is not enrolled in the course"
    def __str__(self):
        return self.message

class InconsistentObserverID(Exception):
    def __init__(self):
        self.message = "Raised when more than one observer is being assigned to a team"
    def __str__(self):
        return self.message

class NoTAsListed(Exception):
    def __init__(self):
        self.message = "Raised when the course uses TAs, but no TAs were assigned to the course"
    def __str__(self):
        return self.message

class NoStudentsInCourse(Exception):
    def __init__(self):
        self.message = "Raised when the course has no assigned students"
    def __str__(self):
        return self.message

class InvalidLMSID(Exception):
    def __init__(self):
        self.message = "Raise when an expected lms_id is not an integer"
    def __str__(self):
        return self.message

class OwnerIDDidNotCreateTheCourse(Exception):
    def __init__(self):
        self.message = "Raised when the specified owner did not create the corresponding course"
    def __str__(self):
        return self.message

class CourseDoesNotExist(Exception):
    def __init__(self):
        self.message = "Raised when course id passed is not a valid course id"
    def __str__(self):
        return self.message

class UserCourseDoesNotExist(Exception):
    def __init__(self):
        self.message = "Raised when user id and course id passed is not a valid user course id"
    def __str__(self):
        return self.message

# For use in teamBulkUpload.py
class EmptyTeamMembers(Exception):
    def __init__(self):
        self.message = "Raised when a team is created with no members"
    def __str__(self):
        return self.message

class EmptyTeamName(Exception):
    def __init__(self):
        self.message = "Raised when a team is created with no name"
    def __str__(self):
        return self.message

class EmptyTAEmail(Exception):
    def __init__(self):
        self.message = "Raised when a team is created with no TA email"
    def __str__(self):
        return self.message

class EmptyStudentFName(Exception):
    def __init__(self):
        self.message = "Raised when a student is created with no first name"
    def __str__(self):
        return self.message

class EmptyStudentLName(Exception):
    def __init__(self):
        self.message = "Raised when a student is created with no last name"
    def __str__(self):
        return self.message

class EmptyStudentEmail(Exception):
    def __init__(self):
        self.message = "Raised when a student is created with no email"
    def __str__(self):
        return self.message


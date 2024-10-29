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
    def __init__(self, row_num: int, expected: int, found: int):
        self.row_num = row_num
        self.expected = expected
        self.found = found
        self.message = f"Row {row_num} has {found} columns, expected maximum of {expected}"
    def __str__(self):
        return self.message

class NotEnoughColumns(Exception):
    def __init__(self, row_num: int, expected: int, found: int):
        self.row_num = row_num
        self.expected = expected
        self.found = found
        self.message = f"Row {row_num} has {found} columns, expected minimum of {expected}"
    def __str__(self):
        return self.message

class SuspectedMisformatting(Exception):
    def __init__(self):
        self.message = "Raised when the submitted file has an unexpected value, type, or format for a column other than the header"
    def __str__(self):
        return self.message

class UserDoesNotExist(Exception):
    def __init__(self, email):
        self.message = f"No user found with email: {email}"
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
    def __init__(self, row_num, lms_id):
        self.message = f"Row {row_num}: LMS ID '{lms_id}' must be a positive integer"
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


class InvalidNameFormat(Exception):
    def __init__(self, row_num, name):
        self.message = f"Row {row_num}: Name '{name}' is not in format 'Last Name, First Name'"
    def __str__(self):
        return self.message

class InvalidEmail(Exception):
    def __init__(self, row_num, email):
        self.message = f"Row {row_num}: Invalid email format '{email}'"
    def __str__(self):
        return self.message

class DuplicateEmail(Exception):
    def __init__(self, email, row_nums):
        self.message = f"Email '{email}' appears multiple times in rows: {row_nums}"
    def __str__(self):
        return self.message

class DuplicateLMSID(Exception):
    def __init__(self, lms_id, row_nums):
        self.message = f"LMS ID '{lms_id}' appears multiple times in rows: {row_nums}"
    def __str__(self):
        return self.message

class InvalidRole(Exception):
    def __init__(self, row_num, role, valid_roles):
        self.message = f"Row {row_num}: '{role}' is not a valid role. Valid roles are: {', '.join(valid_roles)}"
    def __str__(self):
        return self.message

class UsersDoNotExist(Exception):
    def __init__(self, emails):
        self.message = f"Multiple users not found with emails: {', '.join(emails)}"
    def __str__(self):
        return self.message

class TANotYetAddedToCourse(Exception):
    def __init__(self, email):
        self.message = f"TA with email {email} exists but is not assigned to this course"
    def __str__(self):
        return self.message

class StudentNotEnrolledInThisCourse(Exception):
    def __init__(self, email):
        self.message = f"Student with email {email} exists but is not enrolled in this course"
    def __str__(self):
        return self.message

class CourseDoesNotExist(Exception):
    def __init__(self, course_id):
        self.message = f"No course found with ID: {course_id}"
    def __str__(self):
        return self.message

class OwnerIDDidNotCreateTheCourse(Exception):
    def __init__(self, owner_id, course_id):
        self.message = f"User {owner_id} is not the owner of course {course_id}"
    def __str__(self):
        return self.message

class HeaderMisformat(Exception):
    def __init__(self, expected: list[str], found: list[str]):
        self.message = f"Invalid header format. Expected: {expected}, Found: {found}"
    def __str__(self):
        return self.message
#-------------------------------------------------------------------------
# The purpose of this file is useful email testing functions and classes.
#
# Date Updated: Tue 08 Apr 2025 01:43:42 PM CDT
#-------------------------------------------------------------------------

class EmailConsts:
    CORRECT_SCOPES = [
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.readonly",
    ]
    CORRECT_PATH_TO_TOKEN = "/home/ubuntu/private/token.json"
    MOCKED_CREDS = "Mocked_Creds_Yo"
    MOCKED_REFRESH = "MOCKED_REFRESH"
    FAKE_STUDENT = "SCOOBY DOO"
    FAKE_EMAIL = "FAKE_EMAIL_slfjsdljklkjl@gmail.com"
    FAKED_RESET_CODE = "789"
    FIRST_NAME = "SCOOBY"
    LAST_NAME = "DOO"
    FAKE_MSG = "HELLO, THIS IS A FAKE MSG."

EmailConsts.MOCK_JSON = {
    "first_name": EmailConsts.FIRST_NAME,
    "last_name": EmailConsts.LAST_NAME,
    "email": EmailConsts.FAKE_EMAIL,
    "lms_id": None,  # Use 'None' instead of 'null'
    "consent": None,
    "owner_id": None,
    "role_id": 5,
    "user_id": 2,
    "email_consts": EmailConsts.FAKE_EMAIL
}

class MockUtil:
    """This class just formats information passed to it for debugging purposes."""
    @staticmethod
    def dynamic_msg(i, j, symbol:str, expected):
        """This is used for the other static methods and only requires the symbol to be a string."""
        msg = f"\nAssertion failed:\n  {i} {symbol} {j}"
        if expected is not None:
            msg += f"\n  Expected: {expected}"
        return msg
    
    @staticmethod
    def equal(i, j, expected = None):
        """Assertion test for equality."""
        assert i == j, MockUtil.dynamic_msg(i, j, "==" ,expected)
    
    @staticmethod
    def nequal(i, j, expected = None):
        """Assertion test for not equal."""
        assert i != j, MockUtil.dynamic_msg(i, j, "!=" ,expected)

    @staticmethod
    def singleton_comparision(i, j, expected = None):
        """Assertion test for Boolean and None singleton."""
        assert i is j, MockUtil.dynamic_msg(i, j, "is", expected)

    @staticmethod
    def neg_singleton_comparision(i, j, expected = None):
        """Assertion test for not Boolean ors None singleton."""
        assert i is not j, MockUtil.dynamic_msg(i, j, "is", expected)

    @staticmethod
    def instance_comparision(i, j, expected=None):
        """Assertion test for comparing class instances."""
        assert isinstance(i, j) is True, MockUtil.dynamic_msg(i, j, "isinstance()", expected)

    @staticmethod
    def list_comparision(list_a, list_b, func, none_comparison=False, expected = ""):
        """Usage: give it two lists and a MockUtil function to compare things faster.
            It is possible to give it one list and an empty list if none_comparision is true.
        """
        assert len(list_a) == len(list_b) or none_comparison, MockUtil.dynamic_msg("size of first", "size of second", "==", "lists must be the same size")
        for i in range (0, len(list_a)):
            func(list_a[i], list_b[i], expected + f"\nIndex {i} has an error") if not none_comparison else func(list_a[i], None ,expected + f"\nIndex {i} has an error")

    @staticmethod
    def is_fake_user_added() -> bool:
        """
        Description:
            Confirms if the fake user is present in the database.
        Return:
            <class'bool'>; True on confirmation its in the database.
        """
        from models.user import get_user_user_id_by_email
        query_answer = None
        try:
            query_answer = get_user_user_id_by_email(EmailConsts.FAKE_EMAIL)
        except Exception as e:
            print(e)
        return True if query_answer else False

    @staticmethod
    def manually_add_fake_user() -> None:
        """
        Description:
            Adds the fake user directly. Auto email validation insertion is off.
        """
        from models.user import create_user
        create_user(EmailConsts.MOCK_JSON, False)

    @staticmethod
    def manually_remove_fake_user(db, casscade=False) -> None:
        """
        Description:
            Removes the fake user directly. Auto email validation insertion is off.
        Inputs:
            db: Database instance provided from the flask_mock_app.
            casscade: Used if a removal from the EmailValidation table is needed as well.
        """
        from models.user import get_user_user_id_by_email, delete_user_by_user_id
        from models.email_validation import EmailValidation
        user_id = get_user_user_id_by_email(EmailConsts.FAKE_EMAIL)
        if casscade:
            db.session.query(EmailValidation).filter_by(user_id=user_id).delete()
            db.session.commit()
        delete_user_by_user_id(user_id)

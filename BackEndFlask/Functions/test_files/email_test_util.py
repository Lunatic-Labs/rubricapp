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
    MOCKED_CREDS = "Mocked Creds Yo"
    MOCKED_REFRESH = "MOCKED REFRESH"


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
    def list_comparision(list_a, list_b, func, none_comparison=False, expected = None):
        """Usage: give it two lists and a MockUtil function to compare things faster.
            It is possible to give it one list and an empty list if none_comparision is true.
        """
        assert len(list_a) == len(list_b) or none_comparison, MockUtil.dynamic_msg("size of first", "size of second", "==", "lists must be the same size")
        for i in range (0, len(list_a)):
            func(list_a[i], list_b[i], expected + f"\nIndex {i} has an error") if not none_comparison else func(list_a[i], None ,expected + f"\nIndex {i} has an error")

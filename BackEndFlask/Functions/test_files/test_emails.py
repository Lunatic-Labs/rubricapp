from core import config
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
        """Assertion test for equality."""

        assert i != j, MockUtil.dynamic_msg(i, j, "!=" ,expected)
    

def test_we_are_mock_mode():
    MockUtil.nequal(config.rubricapp_running_locally, True, "rubricapp_running_locally needs to be false.")



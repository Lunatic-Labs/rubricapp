import unittest
from signUpDriver import signUp

class TestSignUp(unittest.TestCase):
    
    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed
        
        testSignUp = signUp()
        print("\n\nTesting SignUp\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser_SignUp@mail.com", "abcdefgh")  
        (urlCurrent, alertInfo) = testSignUp.Driver_SignUp(username, password)
        
        testSignUp.Close()
        
        IsSignUpSuccess = urlCurrent == "http://localhost:5000/login"
        IsSignUpFailed = urlCurrent == "http://localhost:5000/signup"
        IsAlertInfo = alertInfo == "Warning !!! The email has been used"
        
        self.assertTrue(IsSignUpSuccess or (IsSignUpFailed and IsAlertInfo))
        
        
        
if __name__ == '__main__':
    unittest.main()
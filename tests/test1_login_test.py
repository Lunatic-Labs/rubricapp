import unittest
from signUpDriver import signUp
from loginDriver import logIn

class TestLogin(unittest.TestCase):

    
    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed
        
        testSignUp = signUp()
        print("\n\nTesting SignUp\n\n") #only print out when error happens
        
        (username, password) = ("sampleuser_Login@mail.com", "abcdefgh")  
        (urlCurrent, alertInfo) = testSignUp.Driver_SignUp(username, password)
        
        testSignUp.Close()
        
        IsSignUpSuccess = urlCurrent == "http://localhost:5000/login"
        IsSignUpFailed = urlCurrent == "http://localhost:5000/signup"
        IsAlertInfo = alertInfo == "Warning !!! The email has been used"
        
        self.assertTrue(IsSignUpSuccess or (IsSignUpFailed and IsAlertInfo))
        
    def test_2_0_LoginSuccess(self):
        #successfully login - with correct username and password
        print("\n\nTesting LoginSuccess\n\n")
        
        logInPage = logIn()     # constuctor
        (username, password) = ("sampleuser_Login@mail.com", "abcdefgh")  
        currentUrl = logInPage.LoginAttempt(username, password)
        logInPage.Close()
        
        
        IsLoginSuccess = (currentUrl == "http://localhost:5000/instructor_project")
        
        self.assertTrue(IsLoginSuccess)   
       
    def test_2_1_LoginFailure_by_user_not_exist(self):
        #failed login due to "user doesn't exist"

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        logInPage = logIn()
        (username, password) = ("Wronginput@gmail.com","abcdefgh") 
        currentUrl = logInPage.LoginAttempt(username, password)
        alertInfo = logInPage.getUserExistAlert()  # no need for self -- passed already through logInPage
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "user doesn't exist"
        
        self.assertTrue(IsUrlTrue and IsAlert)
        
    
    def test_2_2_LoginFailure_by_invalid_password(self):
        #failed login due to password too short or too long(should be between 8 - 80)

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        logInPage = logIn()
        (username, password) = ("sampleuser_Login@mail.com","a"*7) 
        currentUrl = logInPage.LoginAttempt(username, password)
        alertInfo = logInPage.getPasswordAlert()  # no need for self -- passed already through logInPage
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "Field must be between 8 and 80 characters long."
        
        self.assertTrue(IsUrlTrue and IsAlert)
    
    def test_2_3_LoginFailure_by_invalid_email(self):
        #failed login due to invalid email (no @), along with password too short 

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        logInPage = logIn()
        (username, password) = ("Wronginput.gmail.com","a"*7) 
        currentUrl = logInPage.LoginAttempt(username, password)
        (alert1, alert2) = logInPage.getInvalidEmailAlert()
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert1 = alert1 == "Invalid email"
        IsAlert2 = alert2 == "Field must be between 8 and 80 characters long."
            
        self.assertTrue(IsUrlTrue and IsAlert1 and IsAlert2)    
    
    def test_2_4_LoginFailure_by_incorrect_password(self):
        #failed login due to incorrect password 

        print("\n\nTesting LoginFailure1 - due to 'password not correct'\n\n")
        
        logInPage = logIn()
        (username, password) = ("sampleuser_Login@mail.com","a"*8) 
        currentUrl = logInPage.LoginAttempt(username, password)
        alertInfo = logInPage.getIncorrectPasswordAlert()
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "password not correct"
        
        self.assertTrue(IsUrlTrue and IsAlert)
        
      
    
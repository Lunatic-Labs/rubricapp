import unittest
import time
from signUpDriver import signUp
from createProjectDriver import createProject
from evaluationDriver import evaluation

class TestEvalution(unittest.TestCase):
    
    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed
        
        testSignUp = signUp()
        print("\n\nTesting SignUp\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")  
        (urlCurrent, alertInfo) = testSignUp.Driver_SignUp(username, password)
        
        testSignUp.Close()
        
        IsSignUpSuccess = urlCurrent == "http://localhost:5000/login"
        IsSignUpFailed = urlCurrent == "http://localhost:5000/signup"
        IsAlertInfo = alertInfo == "Warning !!! The email has been used"
        
    def test_3_CreateProject(self):
        #if first time run, this test will create a project; if not the first time, there won't be duplicate projects created
        
        # The rubric file (.json) must be first downloaded
        
        print("\n\nTesting createProject\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")          
        (projectname, projectpassword) = ("Informational Processing", "A sample project using an ELPISSrubric for Informational Processing")        
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectpassword, studentFile, jsonFile)
        
        createP.Close()
        
        IsProjectCreated = urlCurrent == "http://localhost:5000/instructor_project"
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlertInfo = alertInfo == "The project name has been used before"
        
        msg = alertInfo
        
        self.assertTrue(IsProjectCreated or (IsProjectNotCreated and IsAlertInfo), msg)    
    
    
    def test_Evaluations(self):
        # This evaluation will test for either successfully creating evaluation or fail due to existed evaluation name
        
        (username, password) = ("sampleuser_CreateEvaluation@mail.com", "abcdefgh") 
        (projectName, evaluationName) = ("Informational Processing", "Week 4")
        createE = evaluation()
        
        (projectURL, alertInfo) = createE.driver_createEvaluation_attempt(username, password, projectName, evaluationName)
        createE.Close()
        
        IsAtEvalCreatePage = projectURL == "http://localhost:5000/load_project/" + username + username + projectName + "full/noAlert"
        #sample url: "http://localhost:5000/load_project/sampleuser_CreateEvaluation@mail.comsampleuser_CreateEvaluation@mail.comInformational%20Processingfull/noAlert"
        # only test for staying at evaluation page, because when successfully create evaluation, the next page url will be very wield.
        
        IsAlertInfo = alertInfo == "The evaluation_name has been used before"
        IsNoError = alertInfo == "no error"
        
        msg = alertInfo
        
        self.assertTrue((not IsAtEvalCreatePage and IsNoError) or (IsAtEvalCreatePage and IsAlertInfo, msg))
    
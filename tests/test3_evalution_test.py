import unittest
import time
from signUpDriver import signUp
from createProjectDriver import createProject
from evaluationDriver import evaluation

class configure:
    def configure_test_1_successOrExisted():
        (username, password) = ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")  
        return (username, password)
        
    def configure_test_3_CreateProject_Success():
        #both xlsx and json files have to be downloaded previously
        (username, password) = ("sampleuser_CreateEvaluation@mail.com", "abcdefgh") 
        (projectname, projectdescription) =("Teamwork1", "A sample project using an ELPISSrubric for Teamwork") 
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")       
        return (username, password, projectname, projectdescription, studentFile, jsonFile)

    def configure_test_Evaluations():
        (username, password) = ("sampleuser_CreateEvaluation@mail.com", "abcdefgh") 
        (projectName, evaluationName) = ("Informational Processing", "Week 1")
        return (username, password, projectName, evaluationName)

class TestEvalution(unittest.TestCase):
    
    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed
        
        testSignUp = signUp()
        print("\n\nTesting SignUp\n\n") 
        
        (username, password) = configure.configure_test_1_successOrExisted() 
        (urlCurrent, alertInfo) = testSignUp.Driver_SignUp(username, password)
        
        testSignUp.Close()
        
      
    
      
    def test_3_CreateProject_Success(self):
        #if first time run, this test will create a project; if not the first time, there won't be duplicate projects created
        
        print("\n\nTesting createProject\n\n")  #somehow this is not printed
        

        (username, password, projectname, projectdescription, studentFile, jsonFile) = configure.configure_test_3_CreateProject_Success()
        createP = createProject()
        
        (urlCurrent, alertInfo)= createP.createProject_attempt(username, password, projectname, projectdescription, studentFile, jsonFile)
        
        createP.Close()
        
    
    def test_Evaluations(self):
        # This evaluation will test for either successfully creating evaluation or fail due to existed evaluation name

        (username, password, projectName, evaluationName) = configure.configure_test_Evaluations()
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
    
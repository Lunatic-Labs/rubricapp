import unittest
import time
from signUpDriver import signUp
from createProjectDriver import createProject
from evaluationDriver import evaluation
from ratingDriver import rating

class TestRating(unittest.TestCase):
    
    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed
        
        testSignUp = signUp()
        print("\n\nTesting SignUp\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")  
        (urlCurrent, alertInfo) = testSignUp.Driver_SignUp(username, password)
        
        testSignUp.Close()
        
        IsSignUpSuccess = urlCurrent == "http://localhost:5000/login"
        IsSignUpFailed = urlCurrent == "http://localhost:5000/signup"
        IsAlertInfo = alertInfo == "Warning !!! The email has been used"
        
    def test_3_CreateProject(self):
        #if first time run, this test will create a project; if not the first time, there won't be duplicate projects created
        
        # The rubric file (.json) must be first downloaded
        
        print("\n\nTesting createProject\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")          
        (projectname, projectpassword) = ("Teamwork1", "A sample project using an ELPISSrubric for Teamwork1")        
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
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh") 
        (projectName, evaluationName) = ("Teamwork1", "Week 1")
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
    
    


    def test_Rating(self):
        # Here is only my hardcoding work
        # due to Out-Of-Index problem, I created a new rubric called "Teamwork1" with one evalution as "Week 1"
        # in addition, almost all the elements on the page is associated with my userid and the time of the creation of the evaluation
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
        (projectName, evaluationName) = ("Teamwork1", "Week 1")
        
        createR = rating()        
        (projectURL, metaGroupURL, secondGroupURL, status) = createR.driver_Rating_attempt(username, password, projectName, evaluationName)
        createR.Close()
        
        IsProject = projectURL == "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/noAlert"
        
        IsMetaGroup = metaGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/***None***/noAlert"
        
        IsSecondGroup = secondGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/O/Connected%20to%20groupO"
        
        self.assertTrue(IsProject and IsMetaGroup and IsSecondGroup and status)
        

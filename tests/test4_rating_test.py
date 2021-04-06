import unittest
import time
from signUpDriver import signUp
from createProjectDriver import createProject
from evaluationDriver import evaluation
from ratingDriver import rating

class configure:
    def configure_test_1_successOrExisted():
        (username, password) = ("sampleuser13@mail.com", "abcdefgh")  
        return (username, password)
        
    def configure_test_3_CreateProject_Success():
        #both xlsx and json files have to be downloaded previously
        (username, password) = ("sampleuser13@mail.com", "abcdefgh") 
        (projectname, projectdescription) =("Teamwork1", "A sample project using an ELPISSrubric for Teamwork1")  
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")       
        return (username, password, projectname, projectdescription, studentFile, jsonFile)

    def configure_test_Evaluations():
        (username, password) = ("sampleuser13@mail.com", "abcdefgh") 
        (projectName, evaluationName) = ("Teamwork1", "Week 1")
        return (username, password, projectName, evaluationName)
    
    def configure_test_Rating():
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
        (projectName, evaluationName) = ("Teamwork1", "Week 1")
        (level, checkbox1, checkbox2, checkbox3) = ("Sporadically", True,True,False)
        return (username, password, projectName, evaluationName,level, checkbox1, checkbox2, checkbox3)


    def configure_test_Rating_Another_Group():
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
        (projectName, evaluationName) = ("Teamwork1", "Week 1")
        switchGroup = "O"
        (level, checkbox1, checkbox2, checkbox3) = ("Frequently", False, False, True) 
        return (username, password, projectName, evaluationName, switchGroup, level, checkbox1, checkbox2, checkbox3)

class TestRating(unittest.TestCase):
    
    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed
        
        testSignUp = signUp()
        print("\n\nTesting SignUp\n\n") 
        
        (username, password) = configure.configure_test_1_successOrExisted() 
        (urlCurrent, alertInfo) = testSignUp.Driver_SignUp(username, password)
        
        testSignUp.Close()
        
        IsSignUpSuccess = urlCurrent == "http://localhost:5000/login"
        IsSignUpFailed = urlCurrent == "http://localhost:5000/signup"
        IsAlertInfo = alertInfo == "Warning !!! The email has been used"
      
    
      
    def test_3_CreateProject_Success(self):
        #if first time run, this test will create a project; if not the first time, there won't be duplicate projects created
        
        print("\n\nTesting createProject\n\n")  #somehow this is not printed
        

        (username, password, projectname, projectdescription, studentFile, jsonFile) = configure.configure_test_3_CreateProject_Success()
        createP = createProject()
        
        (urlCurrent, alertInfo)= createP.createProject_attempt(username, password, projectname, projectdescription, studentFile, jsonFile)
        
        createP.Close()
        
        IsProjectCreated = urlCurrent == "http://localhost:5000/instructor_project"
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlertInfo = alertInfo == "The project name has been used before"
        
        msg = alertInfo
        
        self.assertTrue(IsProjectCreated or (IsProjectNotCreated and IsAlertInfo), msg)
    
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
    
    


    def test_Rating_One_Group(self):
        # Here is only my hardcoding work
        # due to Out-Of-Index problem, I created a new rubric called "Teamwork1" with one evalution as "Week 1"
        # in addition, almost all the elements on the page is associated with my userid and the time of the creation of the evaluation
        

        (username, password, projectName, evaluationName,level, checkbox1, checkbox2, checkbox3) = configure.configure_test_Rating()
        
        createR = rating()        
        (projectURL, metaGroupURL, statusA, statusB, statusC) = createR.driver_Rating_One_Group(username, password, projectName, evaluationName,level, checkbox1, checkbox2, checkbox3)
        createR.Close()
        
        IsProject = projectURL == "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/noAlert"
        
        IsMetaGroup = metaGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/***None***/noAlert"
 
        self.assertTrue(IsProject and IsMetaGroup)
        if checkbox1: self.assertTrue(statusA)
        if checkbox2: self.assertTrue(statusB)
        if checkbox3: self.assertTrue(statusC)
        
    
      
    
    def test_Rating_Another_Group(self):
        # Here is only my hardcoding work
        # due to Out-Of-Index problem, I created a new rubric called "Teamwork1" with one evalution as "Week 1"
        # in addition, almost all the elements on the page is associated with my userid and the time of the creation of the evaluation
        

        (username, password, projectName, evaluationName, switchGroup, level, checkbox1, checkbox2, checkbox3) = configure.configure_test_Rating_Another_Group()
        
        createR = rating()        
        (projectURL, metaGroupURL, secondGroupURL, statusA, statusB, statusC) = createR.driver_Switch_and_Rate_Another_Group(username, password, projectName, evaluationName, switchGroup, level, checkbox1, checkbox2, checkbox3)
        createR.Close()
        
        IsProject = projectURL == "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/noAlert"
        
        IsMetaGroup = metaGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/***None***/noAlert"
        
        IsSecondGroup = secondGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/O/Connected%20to%20groupO"
        
        self.assertTrue(IsProject and IsMetaGroup and IsSecondGroup)
        self.assertTrue(statusC)
    
    
    
 
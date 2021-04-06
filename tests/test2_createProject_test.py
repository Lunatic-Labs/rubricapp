import unittest
from signUpDriver import signUp
from createProjectDriver import createProject

class configure:
    def configure_test_1_successOrExisted():
        (username, password) = ("sampleuser_CreateProject@mail.com", "abcdefgh")  
        return (username, password)
        
    def configure_test_3_CreateProject_Success():
        #both xlsx and json files have to be downloaded previously
        (username, password) = ("sampleuser_CreateProject@mail.com", "abcdefgh") 
        (projectname, projectdescription) =("Teamwork", "A sample project using an ELPISSrubric for Teamwork") 
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")       
        return (username, password, projectname, projectdescription, studentFile, jsonFile)
    
    def configure_test_3_1_CreateProject_InvalidProjectNameAndDescription():
        (username, password) = ("sampleuser_CreateProject@mail.com", "abcdefgh")
        (projectname, projectdescription) =("12", "1"*256)  
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json") 
        return (username, password, projectname, projectdescription, studentFile, jsonFile)
    
    def configure_test_3_2_CreateProject_InvalidFileFormat():
        (username, password) = ("sampleuser_CreateProject@mail.com", "abcdefgh") 
        (projectname, projectdescription) = ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/teamwork_scale3.json","C:/Users/Wangj/Downloads/sample_roster.xlsx")
        return (username, password, projectname, projectdescription, studentFile, jsonFile)
    

class TestCreateProject(unittest.TestCase):
    
    
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
    
    def test_3_0_Rubric_file_teamwork(self):
        #test the rubric file location
        (username, password) = configure.configure_test_1_successOrExisted()    
        createP = createProject()
        
        url = createP.testRubricFile_teamwork(username, password)
        createP.Close()
        IsUrlTrue = url == "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json"
        self.assertTrue(IsUrlTrue)
    
     
    def test_3_0_Rubric_file_infoProcess(self):
        #test the rubric file location
        (username, password) = configure.configure_test_1_successOrExisted()      
        createP = createProject()
        
        url = createP.testRubricFile_infoProcess(username, password)
        createP.Close()
        IsUrlTrue = url == "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/information_processing/information_processing.json"
        self.assertTrue(IsUrlTrue)
    
    def test_3_0_Rubric_file_communication(self):
        #test the rubric file location
        (username, password) = configure.configure_test_1_successOrExisted()      
        createP = createProject()
        
        url = createP.testRubricFile_communication(username, password)
        createP.Close()
        IsUrlTrue = url == "https://github.com/sotl-technology/rubricapp/tree/master/sample_file/rubrics/interpersonal_communication"
        self.assertTrue(IsUrlTrue, url)
    
    
    
    
    def test_3_1_CreateProject_InvalidProjectNameAndDescription(self):
        #invalid project name and description 
       
        (username, password, projectname, projectdescription, studentFile, jsonFile) = configure.configure_test_3_1_CreateProject_InvalidProjectNameAndDescription()
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectdescription,studentFile, jsonFile)
        (alert1, alert2) = createP.getProjectNameAndDescriptionAlert()
        createP.Close()
        
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "Field must be between 3 and 150 characters long."
        IsAlert2 = alert2 == "Field must be between 0 and 255 characters long."
        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)
    
     
    def test_3_2_CreateProject_InvalidFileFormat(self):
        #incorrect format of files uploaded for Roster and Rubric
        
        (username, password, projectname, projectdescription, studentFile, jsonFile) = configure.configure_test_3_2_CreateProject_InvalidFileFormat()
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectdescription,studentFile, jsonFile)
        (alert1, alert2) = createP.getInvalidFileAlert()
        createP.Close()

        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "File is not a zip file"
        IsAlert2 = alert2 == "'charmap' codec can't decode byte 0x81 in position 22: character maps to <undefined>"

        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)
    
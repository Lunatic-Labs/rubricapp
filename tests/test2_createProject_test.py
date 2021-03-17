import unittest

from createProjectDriver import createProject

class TestCreateProject(unittest.TestCase):

    def test_3_CreateProject(self):
        #if first time run, this test will create a project; if not the first time, there won't be duplicate projects created
        
        # The rubric file (.json) must be first downloaded
        
        print("\n\nTesting createProject\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")          
        (projectname, projectpassword) = ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")        
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectpassword, studentFile, jsonFile)
        
        createP.Close()
        
        IsProjectCreated = urlCurrent == "http://localhost:5000/instructor_project"
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlertInfo = alertInfo == "The project name has been used before"
        
        msg = alertInfo
        
        self.assertTrue(IsProjectCreated or (IsProjectNotCreated and IsAlertInfo), msg)
    
    
    def test_3_0_Rubric_file(self):
        #test the rubric file location
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")     
        createP = createProject()
        
        url = createP.testRubricFile(username, password)
        createP.Close()
        IsUrlTrue = url == "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json"
        self.assertTrue(IsUrlTrue)
        
    
    def test_3_1_CreateProject_InvalidProjectNameAndDescription(self):
        #invalid project name and description 
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")         
        (projectname, projectpassword) = ("12", "1"*256)        
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectpassword,studentFile, jsonFile)
        (alert1, alert2) = createP.getProjectNameAndDescriptionAlert()
        createP.Close()
        
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "Field must be between 3 and 150 characters long."
        IsAlert2 = alert2 == "Field must be between 0 and 255 characters long."
        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)
    
    
    def test_3_2_CreateProject_InvalidFileFormat(self):
        #incorrect format of files uploaded for Roster and Rubric
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")        
        (projectname, projectpassword) = ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/teamwork_scale3.json","C:/Users/Wangj/Downloads/sample_roster.xlsx")
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectpassword,studentFile, jsonFile)
        (alert1, alert2) = createP.getInvalidFileAlert()
        createP.Close()

        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "File is not a zip file"
        IsAlert2 = alert2 == "'charmap' codec can't decode byte 0x81 in position 22: character maps to <undefined>"

        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)
        
import unittest
from evaluationDriver import evaluation

class TestEvalution(unittest.TestCase):
    def test_Evaluations(self):
        # This evaluation will test for either successfully creating evaluation or fail due to existed evaluation name
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh") 
        (projectName, evaluationName) = ("Teamwork", "Week 222")
        createE = evaluation()
        
        (projectURL, alertInfo) = createE.driver_createEvaluation_attempt(username, password, projectName, evaluationName)
        createE.Close()
        
        IsAtEvalCreatePage = projectURL == "http://localhost:5000/load_project/" + username + username + projectName + "full/noAlert"
        #"http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamworkfull/noAlert"
        
        IsAlertInfo = alertInfo == "The evaluation_name has been used before"
        IsNoError = alertInfo == "no error"
        
        msg = alertInfo
        
        self.assertTrue((not IsAtEvalCreatePage and IsNoError) or (IsAtEvalCreatePage and IsAlertInfo, msg))
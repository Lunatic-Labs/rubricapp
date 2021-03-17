import unittest
from ratingDriver import rating

class TestRating(unittest.TestCase):
    def test_Rating(self):
        # Here is only my hardcoding work
        # due to Out-Of-Index problem, I created a new rubric called "Teamwork1" with one evalution as "Week 1"
        # in addition, almost all the elements on the page is associated with my userid and the time of the creation of the evaluation
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
        (projectName, evaluationName) = ("Teamwork1", "Week 1")
        
        createR = rating()        
        (projectURL, metaGroupURL, secondGroupURL, status, timeCreation,css) = createR.driver_Rating_attempt(username, password, projectName, evaluationName)
        createR.Close()
        
        IsProject = projectURL == "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/noAlert"
        
        IsMetaGroup = metaGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/***None***/noAlert"
        
        IsSecondGroup = secondGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/O/Connected%20to%20groupO"
        
        self.assertTrue(IsProject and IsMetaGroup and IsSecondGroup and status)
        
        self.assertTrue(timeCreation == "2021-03-09_00-15-17", timeCreation)
        self.assertTrue(css == "#sampleuser13\@mailinator\.com", css)
        
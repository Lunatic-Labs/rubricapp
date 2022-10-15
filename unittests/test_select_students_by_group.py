
import sys
sys.path.append('..')
import unittest
from app import create_app, select_students_by_group
from openpyxl import load_workbook
import random
from createTestProject import *


class TestSelectStudentsByGroup(unittest.TestCase):

    @classmethod
    def setUpClass(cls):

        base_directory = os.getcwd()+"/users"
        if not os.path.exists(base_directory+"/test@gmail.com"):
            os.mkdir(base_directory+"/test@gmail.com")

        flask_app = create_app()
        with flask_app.app_context():
            cls.projectName = "Test pName" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12))
            create_test_project("test@gmail.com", cls.projectName)

        path_to_load_project = "{}/{}/{}".format(base_directory, "test@gmail.com", cls.projectName)

        path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
        eva_workbook = load_workbook(path_to_evaluation_file)
        cls.group_worksheet = eva_workbook['group']

    @classmethod
    def tearDownClass(cls):
        delete_project("test@gmail.com", cls.projectName)



    def test_ssbg_h(self):
        rowresult = select_students_by_group("H", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i) + "@mailinator.com")

    def test_ssbg_he(self):
        rowresult = select_students_by_group("He", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+4) + "@mailinator.com")

    def test_ssbg_li(self):
        rowresult = select_students_by_group("Li", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+8) + "@mailinator.com")

    def test_ssbg_be(self):
        rowresult = select_students_by_group("Be", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+12) + "@mailinator.com")

    def test_ssbg_b(self):
        rowresult = select_students_by_group("B", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+16) + "@mailinator.com")

    def test_ssbg_c(self):
        rowresult = select_students_by_group("C", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+20) + "@mailinator.com")

    def test_ssbg_n(self):
        rowresult = select_students_by_group("N", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+24) + "@mailinator.com")

    def test_ssbg_o(self):
        rowresult = select_students_by_group("O", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+28) + "@mailinator.com")

    def test_ssbg_f(self):
        rowresult = select_students_by_group("F", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+32) + "@mailinator.com")

    def test_ssbg_ne(self):
        rowresult = select_students_by_group("Ne", self.group_worksheet)
        self.assertEqual(4, len(rowresult))
        for i in range(4):
            self.assertEqual(rowresult[i], "rubricapp-c" + str(i+36) + "@mailinator.com")


if __name__ == '__main__':
    unittest.main()
from app import *
import os
import openpyxl
import shutil
from flask import Flask
import random
import testProject
import unittest

class select_by_col_name_Test(unittest.TestCase):
    def test_print_student_col(self):
        path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name)
        path_to_student_file_stored = "{}/student.xlsx".format(path_to_current_user_project)
        student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
        student_file_worksheet = student_file_workbook['Sheet1']
        self.assertEqual(select_by_col_name("Student",student_file_worksheet),['Mccray, Maja', 'Guerrero, Fateh', 'Mcphee, Pearce', 'Michael, Olivia', 'Austin, Saarah', 'Velasquez, Rex', 'Coles, Rivka', 'Moody, Lyla', 'Morales, Conah', 'Cotton, Libbie', 'Ahmad, Rocky', 'Gardner, Shakira', 'Lopez, Cecilia', 'Aguilar, Sumayyah', 'Almond, Shae', 'Patton, Naima', "O'Moore, Kitty", 'Bowes, Aryan', 'Kirkpatrick, Arwen', 'Kendall, Jakob', 'Dowling, Safiyyah', 'Hull, Ciaran', 'Goddard, Rafael', 'Whittington, Aden', 'Mosley, Korban', 'Meyer, Sienna', 'Boyce, Bradlee', 'Patterson, Lilly', 'Wickens, Hebe', 'England, Kenzo', 'Parry, Sulayman', 'Baldwin, Ismail', 'Werner, Lillia', 'Emerson, Hiba', 'Casey, Gabriela', 'Johnston, Moshe', 'Thorpe, Shana', 'Lowry, Om', 'Lawson, Nikhil', 'Haney, Mara'])
    
    def test_print_email_col(self):
        path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name)
        path_to_student_file_stored = "{}/student.xlsx".format(path_to_current_user_project)
        student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
        student_file_worksheet = student_file_workbook['Sheet1']
        self.assertEqual(select_by_col_name("Email",student_file_worksheet),['rubricapp-c0@mailinator.com', 'rubricapp-c1@mailinator.com', 'rubricapp-c2@mailinator.com', 'rubricapp-c3@mailinator.com', 'rubricapp-c4@mailinator.com', 'rubricapp-c5@mailinator.com', 'rubricapp-c6@mailinator.com', 'rubricapp-c7@mailinator.com', 'rubricapp-c8@mailinator.com', 'rubricapp-c9@mailinator.com', 'rubricapp-c10@mailinator.com', 'rubricapp-c11@mailinator.com', 'rubricapp-c12@mailinator.com', 'rubricapp-c13@mailinator.com', 'rubricapp-c14@mailinator.com', 'rubricapp-c15@mailinator.com', 'rubricapp-c16@mailinator.com', 'rubricapp-c17@mailinator.com', 'rubricapp-c18@mailinator.com', 'rubricapp-c19@mailinator.com', 'rubricapp-c20@mailinator.com', 'rubricapp-c21@mailinator.com', 'rubricapp-c22@mailinator.com', 'rubricapp-c23@mailinator.com', 'rubricapp-c24@mailinator.com', 'rubricapp-c25@mailinator.com', 'rubricapp-c26@mailinator.com', 'rubricapp-c27@mailinator.com', 'rubricapp-c28@mailinator.com', 'rubricapp-c29@mailinator.com', 'rubricapp-c30@mailinator.com', 'rubricapp-c31@mailinator.com', 'rubricapp-c32@mailinator.com', 'rubricapp-c33@mailinator.com', 'rubricapp-c34@mailinator.com', 'rubricapp-c35@mailinator.com', 'rubricapp-c36@mailinator.com', 'rubricapp-c37@mailinator.com', 'rubricapp-c38@mailinator.com', 'rubricapp-c39@mailinator.com'])
        #print(select_by_col_name("Email",student_file_worksheet))
    
    def test_print_group_col(self):
        path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name)
        path_to_student_file_stored = "{}/student.xlsx".format(path_to_current_user_project)
        student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
        student_file_worksheet = student_file_workbook['Sheet1']
        self.assertEqual(select_by_col_name("group",student_file_worksheet),['H', 'H', 'H', 'H', 'He', 'He', 'He', 'He', 'Li', 'Li', 'Li', 'Li', 'Be', 'Be', 'Be', 'Be', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'C', 'N', 'N', 'N', 'N', 'O', 'O', 'O', 'O', 'F', 'F', 'F', 'F', 'Ne', 'Ne', 'Ne', 'Ne'])
        #print(select_by_col_name("meta",student_file_worksheet))
    
    def test_print_meta_col(self):
        path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name)
        path_to_student_file_stored = "{}/student.xlsx".format(path_to_current_user_project)
        student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
        student_file_worksheet = student_file_workbook['Sheet1']
        self.assertEqual(select_by_col_name("meta",student_file_worksheet),['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'c', 'c', 'c', 'c'])




if __name__ == '__main__':
    
    flaskapp = create_app()
    email = "testing@gmail.com"
    project_name = "Project " + str(random.randint(0,1000))+ str(random.randint(0,1000))
    description_name = "Description" + str(random.randint(0,1000))
    with flaskapp.app_context():
        testProject.create_test_project(email,project_name,description_name)
        unittest.main(argv=['first-arg-is-ignored'], exit=False)

    
        #s = select_by_col_name_Test(email,project_name)
        #s.print_col()
        
import sys
sys.path.append('..')
from app import *
import os
import openpyxl
import shutil
from flask import Flask
import random
from createTestProject import *
import unittest
import collections


email = "testing@gmail.com"
project_name.insert(4,"Project " + str(random.randint(0,1000))+ str(random.randint(0,1000)))

def setup():
    path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name[4])
    path_to_student_file_stored = "{}/evaluation.xlsx".format(path_to_current_user_project)
    student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
    return student_file_workbook['eva']


class select_index_by_group_eva_Tests(unittest.TestCase):
    def test_H_index2_group_ijij(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(2),"H","Guest",student_file_worksheet),[2])
    
    def test_H_index3_group_ijij(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(3),"H","Guest",student_file_worksheet),[3])
    
    def test_H_index4_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(4),"H","Guest",student_file_worksheet),[4])

    def test_H_index5_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(5),"H","Guest",student_file_worksheet),[5])

    def test_He_index6_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(6),"He","Guest",student_file_worksheet),[6])

    def test_He_index7_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(7),"He","Guest",student_file_worksheet),[7])

    def test_He_index8_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(8),"He","Guest",student_file_worksheet),[8])

    def test_He_index9_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(9),"He","Guest",student_file_worksheet),[9])

    def test_Li_index10_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(10),"Li","Guest",student_file_worksheet),[10])

    def test_Li_index11_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(11),"Li","Guest",student_file_worksheet),[11])

    def test_Li_index12_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(12),"Li","Guest",student_file_worksheet),[12])

    def test_Li_index13_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(13),"Li","Guest",student_file_worksheet),[13])

    def test_Be_index14_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(14),"Be","Guest",student_file_worksheet),[14])

    def test_Be_index15_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(15),"Be","Guest",student_file_worksheet),[15])

    def test_Be_index16_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(16),"Be","Guest",student_file_worksheet),[16])

    def test_Be_index17_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(17),"Be","Guest",student_file_worksheet),[17])

    def test_B_index18_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(18),"B","Guest",student_file_worksheet),[18])

    def test_B_index19_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(19),"B","Guest",student_file_worksheet),[19])

    def test_B_index20_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(20),"B","Guest",student_file_worksheet),[20])

    def test_B_index21_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(21),"B","Guest",student_file_worksheet),[21])

    def test_C_index22_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(22),"C","Guest",student_file_worksheet),[22])

    def test_C_index23_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(23),"C","Guest",student_file_worksheet),[23])

    def test_C_index24_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(24),"C","Guest",student_file_worksheet),[24])

    def test_C_index25_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(25),"C","Guest",student_file_worksheet),[25])
    
    def test_N_index26_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(26),"N","Guest",student_file_worksheet),[26])

    def test_N_index27_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(27),"N","Guest",student_file_worksheet),[27])

    def test_N_index28_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(28),"N","Guest",student_file_worksheet),[28])

    def test_N_index29_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(29),"N","Guest",student_file_worksheet),[29])
        
    def test_O_index30_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(30),"O","Guest",student_file_worksheet),[30])

    def test_O_index31_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(31),"O","Guest",student_file_worksheet),[31])

    def test_O_index32_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(32),"O","Guest",student_file_worksheet),[32])

    def test_O_index33_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(33),"O","Guest",student_file_worksheet),[33])

    def test_F_index34_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(34),"F","Guest",student_file_worksheet),[34])

    def test_F_index35_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(35),"F","Guest",student_file_worksheet),[35])

    def test_F_index36_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(36),"F","Guest",student_file_worksheet),[36])

    def test_F_index37_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(37),"F","Guest",student_file_worksheet),[37])
    
    def test_Ne_index38_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(38),"Ne","Guest",student_file_worksheet),[38])

    def test_Ne_index39_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(39),"Ne","Guest",student_file_worksheet),[39])

    def test_Ne_index40_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(40),"Ne","Guest",student_file_worksheet),[40])

    def test_Ne_index41_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva_owner("EvalName"+str(41),"Ne","Guest",student_file_worksheet),[41])




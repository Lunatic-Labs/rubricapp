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
project_name.insert(0,"Project " + str(random.randint(0,1000))+ str(random.randint(0,1000)))


def setup():
    path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name[0])
    path_to_student_file_stored = "{}/evaluation.xlsx".format(path_to_current_user_project)
    student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
    return student_file_workbook['eva']


class select_index_by_group_eva_Tests(unittest.TestCase):
    def test_H_index2_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(2),"H",student_file_worksheet),[2])
    
    def test_H_index3_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(3),"H",student_file_worksheet),[3])
    
    def test_H_index4_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(4),"H",student_file_worksheet),[4])

    def test_H_index5_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(5),"H",student_file_worksheet),[5])

    def test_He_index6_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(6),"He",student_file_worksheet),[6])

    def test_He_index7_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(7),"He",student_file_worksheet),[7])

    def test_He_index8_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(8),"He",student_file_worksheet),[8])

    def test_He_index9_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(9),"He",student_file_worksheet),[9])

    def test_Li_index10_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(10),"Li",student_file_worksheet),[10])

    def test_Li_index11_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(11),"Li",student_file_worksheet),[11])

    def test_Li_index12_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(12),"Li",student_file_worksheet),[12])

    def test_Li_index13_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(13),"Li",student_file_worksheet),[13])

    def test_Be_index14_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(14),"Be",student_file_worksheet),[14])

    def test_Be_index15_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(15),"Be",student_file_worksheet),[15])

    def test_Be_index16_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(16),"Be",student_file_worksheet),[16])

    def test_Be_index17_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(17),"Be",student_file_worksheet),[17])

    def test_B_index18_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(18),"B",student_file_worksheet),[18])

    def test_B_index19_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(19),"B",student_file_worksheet),[19])

    def test_B_index20_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(20),"B",student_file_worksheet),[20])

    def test_B_index21_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(21),"B",student_file_worksheet),[21])

    def test_C_index22_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(22),"C",student_file_worksheet),[22])

    def test_C_index23_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(23),"C",student_file_worksheet),[23])

    def test_C_index24_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(24),"C",student_file_worksheet),[24])

    def test_C_index25_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(25),"C",student_file_worksheet),[25])
    
    def test_N_index26_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(26),"N",student_file_worksheet),[26])

    def test_N_index27_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(27),"N",student_file_worksheet),[27])

    def test_N_index28_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(28),"N",student_file_worksheet),[28])

    def test_N_index29_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(29),"N",student_file_worksheet),[29])
        
    def test_O_index30_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(30),"O",student_file_worksheet),[30])

    def test_O_index31_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(31),"O",student_file_worksheet),[31])

    def test_O_index32_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(32),"O",student_file_worksheet),[32])

    def test_O_index33_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(33),"O",student_file_worksheet),[33])

    def test_F_index34_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(34),"F",student_file_worksheet),[34])

    def test_F_index35_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(35),"F",student_file_worksheet),[35])

    def test_F_index36_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(36),"F",student_file_worksheet),[36])

    def test_F_index37_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(37),"F",student_file_worksheet),[37])
    
    def test_Ne_index38_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(38),"Ne",student_file_worksheet),[38])

    def test_Ne_index39_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(39),"Ne",student_file_worksheet),[39])

    def test_Ne_index40_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(40),"Ne",student_file_worksheet),[40])

    def test_Ne_index41_group(self):
        student_file_worksheet = setup()
        self.assertEqual(select_index_by_group_eva("EvalName"+str(41),"Ne",student_file_worksheet),[41])


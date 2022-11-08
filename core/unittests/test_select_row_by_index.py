import sys
sys.path.append('..')
import unittest
from functions import select_row_by_index
from core import app
from openpyxl import load_workbook
import random
from createTestProject import *


class TestSelectRowByIndex(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        basedirectoryAndmkuser()

        flask_app = app
        with flask_app.app_context():
            cls.projectName = "Test pName" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12))
            create_test_project("test@gmail.com", cls.projectName)

        path_to_load_project = "{}/{}/{}".format(base_directory, "test@gmail.com", cls.projectName)
        path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
        eva_workbook = load_workbook(path_to_evaluation_file)

        cls.group_worksheet = eva_workbook['group']
        cls.group_table = [
            ["groupid", "student1"                    , "student2"                    , "student3"                    , "student4"                    ],
            ["H"      , "rubricapp-c0@mailinator.com" , "rubricapp-c1@mailinator.com" , "rubricapp-c2@mailinator.com" , "rubricapp-c3@mailinator.com" ],
            ["He"     , "rubricapp-c4@mailinator.com" , "rubricapp-c5@mailinator.com" , "rubricapp-c6@mailinator.com" , "rubricapp-c7@mailinator.com" ],
            ["Li"     , "rubricapp-c8@mailinator.com" , "rubricapp-c9@mailinator.com" , "rubricapp-c10@mailinator.com", "rubricapp-c11@mailinator.com"],
            ["Be"     , "rubricapp-c12@mailinator.com", "rubricapp-c13@mailinator.com", "rubricapp-c14@mailinator.com", "rubricapp-c15@mailinator.com"],
            ["B"      , "rubricapp-c16@mailinator.com", "rubricapp-c17@mailinator.com", "rubricapp-c18@mailinator.com", "rubricapp-c19@mailinator.com"],
            ["C"      , "rubricapp-c20@mailinator.com", "rubricapp-c21@mailinator.com", "rubricapp-c22@mailinator.com", "rubricapp-c23@mailinator.com"],
            ["N"      , "rubricapp-c24@mailinator.com", "rubricapp-c25@mailinator.com", "rubricapp-c26@mailinator.com", "rubricapp-c27@mailinator.com"],
            ["O"      , "rubricapp-c28@mailinator.com", "rubricapp-c29@mailinator.com", "rubricapp-c30@mailinator.com", "rubricapp-c31@mailinator.com"],
            ["F"      , "rubricapp-c32@mailinator.com", "rubricapp-c33@mailinator.com", "rubricapp-c34@mailinator.com", "rubricapp-c35@mailinator.com"],
            ["Ne"     , "rubricapp-c36@mailinator.com", "rubricapp-c37@mailinator.com", "rubricapp-c38@mailinator.com", "rubricapp-c39@mailinator.com"]
        ]

        cls.student_worksheet = eva_workbook['students']
        cls.student_table = [
            ["Student"            ,"Email"                        ,"group","meta"],
            ["Mccray, Maja"       ,"rubricapp-c0@mailinator.com"  ,  "H"  , "a"  ],
            ["Guerrero, Fateh"    ,"rubricapp-c1@mailinator.com"  ,  "H"  , "a"  ],
            ["Mcphee, Pearce"     ,"rubricapp-c2@mailinator.com"  ,  "H"  , "a"  ],
            ["Michael, Olivia"    ,"rubricapp-c3@mailinator.com"  ,  "H"  , "a"  ],
            ["Austin, Saarah"     ,"rubricapp-c4@mailinator.com"  ,  "He" , "a"  ],
            ["Velasquez, Rex"     ,"rubricapp-c5@mailinator.com"  ,  "He" , "a"  ],
            ["Coles, Rivka"       ,"rubricapp-c6@mailinator.com"  ,  "He" , "a"  ],
            ["Moody, Lyla"        ,"rubricapp-c7@mailinator.com"  ,  "He" , "a"  ],
            ["Morales, Conah"     ,"rubricapp-c8@mailinator.com"  ,  "Li" , "a"  ],
            ["Cotton, Libbie"     ,"rubricapp-c9@mailinator.com"  ,  "Li" , "a"  ],
            ["Ahmad, Rocky"       ,"rubricapp-c10@mailinator.com" ,  "Li" , "a"  ],
            ["Gardner, Shakira"   ,"rubricapp-c11@mailinator.com" ,  "Li" , "a"  ],
            ["Lopez, Cecilia"     ,"rubricapp-c12@mailinator.com" ,  "Be" , "a"  ],
            ["Aguilar, Sumayyah"  ,"rubricapp-c13@mailinator.com" ,  "Be" , "a"  ],
            ["Almond, Shae"       ,"rubricapp-c14@mailinator.com" ,  "Be" , "a"  ],
            ["Patton, Naima"      ,"rubricapp-c15@mailinator.com" ,  "Be" , "a"  ],
            ["O'Moore, Kitty"     ,"rubricapp-c16@mailinator.com" ,  "B"  , "a"  ],
            ["Bowes, Aryan"       ,"rubricapp-c17@mailinator.com" ,  "B"  , "a"  ],
            ["Kirkpatrick, Arwen" ,"rubricapp-c18@mailinator.com" ,  "B"  , "a"  ],
            ["Kendall, Jakob"     ,"rubricapp-c19@mailinator.com" ,  "B"  , "a"  ],
            ["Dowling, Safiyyah"  ,"rubricapp-c20@mailinator.com" ,  "C"  , "b"  ],
            ["Hull, Ciaran"       ,"rubricapp-c21@mailinator.com" ,  "C"  , "b"  ],
            ["Goddard, Rafael"    ,"rubricapp-c22@mailinator.com" ,  "C"  , "b"  ],
            ["Whittington, Aden"  ,"rubricapp-c23@mailinator.com" ,  "C"  , "b"  ],
            ["Mosley, Korban"     ,"rubricapp-c24@mailinator.com" ,  "N"  , "b"  ],
            ["Meyer, Sienna"      ,"rubricapp-c25@mailinator.com" ,  "N"  , "b"  ],
            ["Boyce, Bradlee"     ,"rubricapp-c26@mailinator.com" ,  "N"  , "b"  ],
            ["Patterson, Lilly"   ,"rubricapp-c27@mailinator.com" ,  "N"  , "b"  ],
            ["Wickens, Hebe"      ,"rubricapp-c28@mailinator.com" ,  "O"  , "b"  ],
            ["England, Kenzo"     ,"rubricapp-c29@mailinator.com" ,  "O"  , "b"  ],
            ["Parry, Sulayman"    ,"rubricapp-c30@mailinator.com" ,  "O"  , "b"  ],
            ["Baldwin, Ismail"    ,"rubricapp-c31@mailinator.com" ,  "O"  , "b"  ],
            ["Werner, Lillia"     ,"rubricapp-c32@mailinator.com" ,  "F"  , "b"  ],
            ["Emerson, Hiba"      ,"rubricapp-c33@mailinator.com" ,  "F"  , "b"  ],
            ["Casey, Gabriela"    ,"rubricapp-c34@mailinator.com" ,  "F"  , "b"  ],
            ["Johnston, Moshe"    ,"rubricapp-c35@mailinator.com" ,  "F"  , "b"  ],
            ["Thorpe, Shana"      ,"rubricapp-c36@mailinator.com" ,  "Ne" , "c"  ],
            ["Lowry, Om"          ,"rubricapp-c37@mailinator.com" ,  "Ne" , "c"  ],
            ["Lawson, Nikhil"     ,"rubricapp-c38@mailinator.com" ,  "Ne" , "c"  ],
            ["Haney, Mara"        ,"rubricapp-c39@mailinator.com" ,  "Ne" , "c"  ]
        ]

    @classmethod
    def tearDownClass(cls):    
        delete_project("test@gmail.com", cls.projectName)


    def test_returns_group_row_0(self):
        n = 0
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_1(self):
        n = 1
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_2(self):
        n = 2
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_3(self):
        n = 3
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_4(self):
        n = 4
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_5(self):
        n = 5
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_6(self):
        n = 6
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_7(self):
        n = 7
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_8(self):
        n = 8
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_9(self):
        n = 9
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])
    
    def test_returns_group_row_10(self):
        n = 10
        answer = select_row_by_index(n+1, self.group_worksheet)
        self.assertEqual(answer, self.group_table[n])



# ------------ Testing students table from here on out ---------------

    def test_returns_student_row_0(self):
        n = 0
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_1(self):
        n = 1
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_2(self):
        n = 2
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_3(self):
        n = 3
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_4(self):
        n = 4
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_5(self):
        n = 5
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_6(self):
        n = 6
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_7(self):
        n = 7
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_8(self):
        n = 8
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_9(self):
        n = 9
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_10(self):
        n = 10
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_11(self):
        n = 11
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_12(self):
        n = 12
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_13(self):
        n = 13
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_14(self):
        n = 14
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_15(self):
        n = 15
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_16(self):
        n = 16
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_17(self):
        n = 17
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_18(self):
        n = 18
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_19(self):
        n = 19
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_20(self):
        n = 20
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_21(self):
        n = 21
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_22(self):
        n = 22
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_23(self):
        n = 23
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_24(self):
        n = 24
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_25(self):
        n = 25
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_26(self):
        n = 26
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_27(self):
        n = 27
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_28(self):
        n = 28
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_29(self):
        n = 29
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_30(self):
        n = 30
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_31(self):
        n = 31
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_32(self):
        n = 32
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_33(self):
        n = 33
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_34(self):
        n = 34
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_35(self):
        n = 35
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_36(self):
        n = 36
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_37(self):
        n = 37
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_38(self):
        n = 38
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_39(self):
        n = 39
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

    def test_returns_student_row_40(self):
        n = 40
        answer = select_row_by_index(n+1, self.student_worksheet)
        self.assertEqual(answer, self.student_table[n])

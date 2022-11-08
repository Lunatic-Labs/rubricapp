import sys
sys.path.append('..')
import unittest
from functions import select_row_by_group_id
from core import app
from openpyxl import load_workbook
import random
from createTestProject import *
from enum import Enum

# gets sample_roster.xlsx from sample_file folder
# keep in mind when DRIing up

def checkStudent(self, name):
        temp_stud = select_row_by_group_id("Student", name, self.student_worksheet)
        self.assertEqual(temp_stud[0], self.stud_table[name])

class TestSelectRowByGroupId(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        home_directory = os.getcwd()
        basedirectoryAndmkuser()

        flask_app = app
        with flask_app.app_context():
            cls.projectName = "Test pName" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12))
            create_test_project("test@gmail.com", cls.projectName)

        path_to_sample_roster = "{}/{}".format(home_directory, "sample_file/rosters/sample_roster.xlsx")

        student_workbook = load_workbook(path_to_sample_roster)
        cls.student_worksheet = student_workbook['Sheet1']
        list_of_stud = select_by_col_name('Student', cls.student_worksheet)
        cls.set_of_stud = set(list_of_stud)

        cls.stud_table = {
            "Mccray, Maja"       : {"Student": "Mccray, Maja"       ,"Email": "rubricapp-c0@mailinator.com"  ,"group": "H"  ,"meta": "a"},
            "Guerrero, Fateh"    : {"Student": "Guerrero, Fateh"    ,"Email": "rubricapp-c1@mailinator.com"  ,"group": "H"  ,"meta": "a"},
            "Mcphee, Pearce"     : {"Student": "Mcphee, Pearce"     ,"Email": "rubricapp-c2@mailinator.com"  ,"group": "H"  ,"meta": "a"},
            "Michael, Olivia"    : {"Student": "Michael, Olivia"    ,"Email": "rubricapp-c3@mailinator.com"  ,"group": "H"  ,"meta": "a"},
            "Austin, Saarah"     : {"Student": "Austin, Saarah"     ,"Email": "rubricapp-c4@mailinator.com"  ,"group": "He" ,"meta": "a"},
            "Velasquez, Rex"     : {"Student": "Velasquez, Rex"     ,"Email": "rubricapp-c5@mailinator.com"  ,"group": "He" ,"meta": "a"},
            "Coles, Rivka"       : {"Student": "Coles, Rivka"       ,"Email": "rubricapp-c6@mailinator.com"  ,"group": "He" ,"meta": "a"},
            "Moody, Lyla"        : {"Student": "Moody, Lyla"        ,"Email": "rubricapp-c7@mailinator.com"  ,"group": "He" ,"meta": "a"},
            "Morales, Conah"     : {"Student": "Morales, Conah"     ,"Email": "rubricapp-c8@mailinator.com"  ,"group": "Li" ,"meta": "a"},
            "Cotton, Libbie"     : {"Student": "Cotton, Libbie"     ,"Email": "rubricapp-c9@mailinator.com"  ,"group": "Li" ,"meta": "a"},
            "Ahmad, Rocky"       : {"Student": "Ahmad, Rocky"       ,"Email": "rubricapp-c10@mailinator.com" ,"group": "Li" ,"meta": "a"},
            "Gardner, Shakira"   : {"Student": "Gardner, Shakira"   ,"Email": "rubricapp-c11@mailinator.com" ,"group": "Li" ,"meta": "a"},
            "Lopez, Cecilia"     : {"Student": "Lopez, Cecilia"     ,"Email": "rubricapp-c12@mailinator.com" ,"group": "Be" ,"meta": "a"},
            "Aguilar, Sumayyah"  : {"Student": "Aguilar, Sumayyah"  ,"Email": "rubricapp-c13@mailinator.com" ,"group": "Be" ,"meta": "a"},
            "Almond, Shae"       : {"Student": "Almond, Shae"       ,"Email": "rubricapp-c14@mailinator.com" ,"group": "Be" ,"meta": "a"},
            "Patton, Naima"      : {"Student": "Patton, Naima"      ,"Email": "rubricapp-c15@mailinator.com" ,"group": "Be" ,"meta": "a"},
            "O'Moore, Kitty"     : {"Student": "O'Moore, Kitty"     ,"Email": "rubricapp-c16@mailinator.com" ,"group": "B"  ,"meta": "a"},
            "Bowes, Aryan"       : {"Student": "Bowes, Aryan"       ,"Email": "rubricapp-c17@mailinator.com" ,"group": "B"  ,"meta": "a"},
            "Kirkpatrick, Arwen" : {"Student": "Kirkpatrick, Arwen" ,"Email": "rubricapp-c18@mailinator.com" ,"group": "B"  ,"meta": "a"},
            "Kendall, Jakob"     : {"Student": "Kendall, Jakob"     ,"Email": "rubricapp-c19@mailinator.com" ,"group": "B"  ,"meta": "a"},
            "Dowling, Safiyyah"  : {"Student": "Dowling, Safiyyah"  ,"Email": "rubricapp-c20@mailinator.com" ,"group": "C"  ,"meta": "b"},
            "Hull, Ciaran"       : {"Student": "Hull, Ciaran"       ,"Email": "rubricapp-c21@mailinator.com" ,"group": "C"  ,"meta": "b"},
            "Goddard, Rafael"    : {"Student": "Goddard, Rafael"    ,"Email": "rubricapp-c22@mailinator.com" ,"group": "C"  ,"meta": "b"},
            "Whittington, Aden"  : {"Student": "Whittington, Aden"  ,"Email": "rubricapp-c23@mailinator.com" ,"group": "C"  ,"meta": "b"},
            "Mosley, Korban"     : {"Student": "Mosley, Korban"     ,"Email": "rubricapp-c24@mailinator.com" ,"group": "N"  ,"meta": "b"},
            "Meyer, Sienna"      : {"Student": "Meyer, Sienna"      ,"Email": "rubricapp-c25@mailinator.com" ,"group": "N"  ,"meta": "b"},
            "Boyce, Bradlee"     : {"Student": "Boyce, Bradlee"     ,"Email": "rubricapp-c26@mailinator.com" ,"group": "N"  ,"meta": "b"},
            "Patterson, Lilly"   : {"Student": "Patterson, Lilly"   ,"Email": "rubricapp-c27@mailinator.com" ,"group": "N"  ,"meta": "b"},
            "Wickens, Hebe"      : {"Student": "Wickens, Hebe"      ,"Email": "rubricapp-c28@mailinator.com" ,"group": "O"  ,"meta": "b"},
            "England, Kenzo"     : {"Student": "England, Kenzo"     ,"Email": "rubricapp-c29@mailinator.com" ,"group": "O"  ,"meta": "b"},
            "Parry, Sulayman"    : {"Student": "Parry, Sulayman"    ,"Email": "rubricapp-c30@mailinator.com" ,"group": "O"  ,"meta": "b"},
            "Baldwin, Ismail"    : {"Student": "Baldwin, Ismail"    ,"Email": "rubricapp-c31@mailinator.com" ,"group": "O"  ,"meta": "b"},
            "Werner, Lillia"     : {"Student": "Werner, Lillia"     ,"Email": "rubricapp-c32@mailinator.com" ,"group": "F"  ,"meta": "b"},
            "Emerson, Hiba"      : {"Student": "Emerson, Hiba"      ,"Email": "rubricapp-c33@mailinator.com" ,"group": "F"  ,"meta": "b"},
            "Casey, Gabriela"    : {"Student": "Casey, Gabriela"    ,"Email": "rubricapp-c34@mailinator.com" ,"group": "F"  ,"meta": "b"},
            "Johnston, Moshe"    : {"Student": "Johnston, Moshe"    ,"Email": "rubricapp-c35@mailinator.com" ,"group": "F"  ,"meta": "b"},
            "Thorpe, Shana"      : {"Student": "Thorpe, Shana"      ,"Email": "rubricapp-c36@mailinator.com" ,"group": "Ne" ,"meta": "c"},
            "Lowry, Om"          : {"Student": "Lowry, Om"          ,"Email": "rubricapp-c37@mailinator.com" ,"group": "Ne" ,"meta": "c"},
            "Lawson, Nikhil"     : {"Student": "Lawson, Nikhil"     ,"Email": "rubricapp-c38@mailinator.com" ,"group": "Ne" ,"meta": "c"},
            "Haney, Mara"        : {"Student": "Haney, Mara"        ,"Email": "rubricapp-c39@mailinator.com" ,"group": "Ne" ,"meta": "c"}    
        }

    @classmethod
    def tearDownClass(cls):
        delete_project("test@gmail.com", cls.projectName)



    def test_MccrayMaja(self):
        checkStudent(self, "Mccray, Maja")

    def test_GuerreroFateh(self):
        checkStudent(self, "Guerrero, Fateh")

    def test_McpheePearce(self):
        checkStudent(self, "Mcphee, Pearce")

    def test_MichaelOlivia(self):
        checkStudent(self, "Michael, Olivia")

    def test_AustinSaarah(self):
        checkStudent(self, "Austin, Saarah"  )

    def test_VelasquezRex(self):
        checkStudent(self, "Velasquez, Rex")

    def test_ColesRivka(self):
        checkStudent(self, "Coles, Rivka")

    def test_MoodyLyla(self):
        checkStudent(self, "Moody, Lyla")

    def test_MoralesConah(self):
        checkStudent(self, "Morales, Conah")

    def test_CottonLibbie(self):
        checkStudent(self, "Cotton, Libbie")

    def test_AhmadRocky(self):
        checkStudent(self, "Ahmad, Rocky")

    def test_GardnerShakira(self):
        checkStudent(self, "Gardner, Shakira")

    def test_LopezCecilia(self):
        checkStudent(self, "Lopez, Cecilia")

    def test_AguilarSumayyah(self):
        checkStudent(self, "Aguilar, Sumayyah")

    def test_AlmondShae(self):
        checkStudent(self, "Almond, Shae")

    def test_PattonNaima(self):
        checkStudent(self, "Patton, Naima")

    def test_OMooreKitty(self):
        checkStudent(self, "O'Moore, Kitty")

    def test_BowesAryan(self):
        checkStudent(self, "Bowes, Aryan")

    def test_KirkpatrickArwen(self):
        checkStudent(self, "Kirkpatrick, Arwen")

    def test_KendallJakob(self):
        checkStudent(self, "Kendall, Jakob")

    def test_DowlingSafiyyah(self):
        checkStudent(self, "Dowling, Safiyyah")

    def test_HullCiaran(self):
        checkStudent(self, "Hull, Ciaran")

    def test_GoddardRafael(self):
        checkStudent(self, "Goddard, Rafael")

    def test_WhittingtonAden(self):
        checkStudent(self, "Whittington, Aden")

    def test_MosleyKorban(self):
        checkStudent(self, "Mosley, Korban")

    def test_MeyerSienna(self):
        checkStudent(self, "Meyer, Sienna")

    def test_BoyceBradlee(self):
        checkStudent(self, "Boyce, Bradlee")

    def test_PattersonLilly(self):
        checkStudent(self, "Patterson, Lilly")

    def test_WickensHebe(self):
        checkStudent(self, "Wickens, Hebe")

    def test_EnglandKenzo(self):
        checkStudent(self, "England, Kenzo")

    def test_ParrySulayman(self):
        checkStudent(self, "Parry, Sulayman")

    def test_BaldwinIsmail(self):
        checkStudent(self, "Baldwin, Ismail")

    def test_WernerLillia(self):
        checkStudent(self, "Werner, Lillia")

    def test_EmersonHiba(self):
        checkStudent(self, "Emerson, Hiba")

    def test_CaseyGabriela(self):
        checkStudent(self, "Casey, Gabriela")

    def test_JohnstonMoshe(self):
        checkStudent(self, "Johnston, Moshe")

    def test_ThorpeShana(self):
        checkStudent(self, "Thorpe, Shana")

    def test_LowryOm(self):
        checkStudent(self, "Lowry, Om")

    def test_LawsonNikhil(self):
        checkStudent(self, "Lawson, Nikhil")

    def test_HaneyMara(self):
        checkStudent(self, "Haney, Mara")
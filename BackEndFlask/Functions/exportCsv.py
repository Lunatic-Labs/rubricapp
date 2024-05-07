#----------------------------------------------------------------------------------------------------
# Developer: Aldo Vera-Espinoza
# Date: 6 May, 2024
# File Purpose: 
#   This file contains functions that retrives data from the database
# and returns to a csv file to a customer.
#
# NOTE:
#   the current way to write out things is as follows:
# AT_name, RN(AT_type, AT_completor), TeamName, IndividualName, CompDate, Category, datapoint
#            /             \                                                            |
#        unitofasess...     roleid                                                     rating,oc,sfi
#----------------------------------------------------------------------------------------------------
import csv
from core import app
from models.queries import *
from enum import Enum

class CSVloc(Enum):
    AT_NAME = 0
    AT_TYPE = 1
    AT_COMPLETER = 2
    TEAM_NAME = 3
    FIRST_NAME = 4
    LAST_NAME = 5
    COMP_DATE = 6
    JSON = 7


#testing needs to be intergrated
#init for security has preverse structure
def create_csv():
    """
    Description:
        Creates the csv file pertinent.csv and dumps info to it.
    Return: None
    """
    with app.app_context():
        with open('pertinent.csv', 'w', newline='') as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)
            allAssessmentData = get_csv_data_by_at_name("Critical Thinking Assessment")
            for entry in allAssessmentData:
                at_type = ["Team"] if entry[CSVloc.AT_TYPE.value] else ["Individual"]
                for i in ["Analyzing", "Evaluating", "Forming Arguments (Structure)",
                          "Forming Arguments (Validity)", "Identifying the Goal",
                          "Synthesizing"]:
                    writer.writerow([entry[CSVloc.AT_NAME.value]] + at_type
                                    + [entry[CSVloc.AT_COMPLETER.value]]
                                    + [entry[CSVloc.TEAM_NAME.value]]
                                    + [entry[CSVloc.FIRST_NAME.value]]
                                    + [entry[CSVloc.LAST_NAME.value]]
                                    + [entry[CSVloc.COMP_DATE.value].strftime("%m/%d/%Y")]
                                    + [i]
                                    + [entry[CSVloc.JSON.value][i]["rating"]]
                                    )
"""
{"Analyzing": {"comments": "ASDFASDFASDFASDFASDF", "description": 
"Interpreted information to determine meaning and to extract relevant evidence", 
"observable_characteristics":
 "101", "rating": 3, "rating_json": {"0": "No evidence", "1": "Inaccurately", "2": "", "3":
   "With some errors", "4": "", "5": "Accurately"}, "suggestions": "00100"}, "Evaluating": 
   {"comments": "ASDFJKL;", "description": "Determined the relevance and reliability of information 
   that might be used to support the conclusion or argument", "observable_characteristics": "111", 
   "rating": 1, "rating_json": {"0": "No evidence", "1": "Minimally", "2": "", "3": "Partially", "4": 
   "", "5": "Extensively"}, "suggestions": "00000"}, "Forming Arguments (Structure)": {"comments": "", 
   "description": "Made an argument that includes a claim (a position), supporting information, and 
   reasoning.", "observable_characteristics": "0100", "rating": 5, "rating_json": {"0": "No evidence", 
   "1": "Minimally", "2": "", "3": "Partially", "4": "", "5": "Completely"}, "suggestions": "1111111"}, 
   "Forming Arguments (Validity)": {"comments": "", "description": "The claim, evidence, and reasoning 
   were logical and consistent with broadly accepted principles.", "observable_characteristics": "10110", 
   "rating": 4, "rating_json": {"0": "No evidence", "1": "Minimally", "2": "", "3": "Partially", "4": "", 
   "5": "Fully"}, "suggestions": "11111"}, "Identifying the Goal": {"comments": "", "description": 
   "Determined the purpose/context of the argument or conclusion that needed to be made", 
   "observable_characteristics": "110", "rating": 2, "rating_json": {"0": "No evidence", "1": 
   "Minimally", "2": "", "3": "Partially", "4": "", "5": "Completely"}, "suggestions": "1010"}, 
   "Synthesizing": {"comments": "", "description": "Connected or integrated information to support an 
   argument or reach a conclusion", "observable_characteristics": "101", "rating": 2, "rating_json": 
   {"0": "No evidence", "1": "Inaccurately", "2": "", "3": "With some errors", "4": "", "5": "Accurately"}
   , "suggestions": "10001"}, "comments": "", "done": true}
"""

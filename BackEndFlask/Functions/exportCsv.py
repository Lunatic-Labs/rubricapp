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
import random

class Csv_locations(Enum):
    """
    Description:
    Locations assocated to where they are in the json file.
    This enum should be modified if the json names change in the future.

    Parameters:
    NONE THIS IS A CLASS ENUM
    """
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
def create_csv(at_name:str, file_name:str):
    """
    Description:
    Creates the csv file and dumps info in to it.
    File name follows the convention: [0-9]*.csv

    Parameters:
    at_name: str(assessment task name)
    file_name: str(csv file to write to)

    Return: 
    None
    """
    with app.app_context():
        with open("./Functions/" + file_name, 'w', newline='') as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)
            completed_assessment_data = get_csv_data_by_at_name(at_name)
            #print(completed_assessment_data[0][Csv_locations.JSON.value]["Analyzing"])
            print(len(find_csv_categories(1)[1]))
    """ with app.app_context():
        with open("./Functions/" + file_name, 'w', newline='') as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)
            allAssessmentData = get_csv_data_by_at_name(at_name)
            for entry in allAssessmentData:
                at_type = ["Team"] if entry[Csv_locations.AT_TYPE.value] else ["Individual"]
                for i in ["Analyzing", "Evaluating", "Forming Arguments (Structure)",
                          "Forming Arguments (Validity)", "Identifying the Goal",
                          "Synthesizing"]:
                    oc = entry[Csv_locations.JSON.value][i]["observable_characteristics"]
                    for j in oc:
                        writer.writerow([entry[Csv_locations.AT_NAME.value]] 
                                    + at_type
                                    + [entry[Csv_locations.AT_COMPLETER.value]]
                                    + [entry[Csv_locations.TEAM_NAME.value]]
                                    + [entry[Csv_locations.FIRST_NAME.value]]
                                    + [entry[Csv_locations.LAST_NAME.value]]
                                    + [entry[Csv_locations.COMP_DATE.value].strftime("%m/%d/%Y")]
                                    + [i]
                                    )
                    sfi = entry[Csv_locations.JSON.value][i]["suggestions"]
                    for j in sfi:
                        writer.writerow([entry[Csv_locations.AT_NAME.value]] 
                                    + at_type
                                    + [entry[Csv_locations.AT_COMPLETER.value]]
                                    + [entry[Csv_locations.TEAM_NAME.value]]
                                    + [entry[Csv_locations.FIRST_NAME.value]]
                                    + [entry[Csv_locations.LAST_NAME.value]]
                                    + [entry[Csv_locations.COMP_DATE.value].strftime("%m/%d/%Y")]
                                    + [i]
                                    )
 """

"""
{"Analyzing": {"comments": "ASDFASDFASDFASDFASDF", "description": 
"Interpreted information to determine meaning and to extract relevant evidence", 
"observable_characteristics":
 "101", "rating": 3, "rating_json": {"0": "No evidence", "1": "Inaccurately", "2": "", "3":
   "With some errors", "4": "", "5": "Accurately"}, "suggestions": "00100"},
    
     
      
       
        
         
          
 "Evaluating": 
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

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
    RUBRIC_ID = 7
    JSON = 8


class Catagories_csv(Enum):
    """
    Description:
    Pertinent categories for a csv dump.

    Parameters:
    NONE THIS IS A CLASS ENUM
    """
    __order__ = " ANALYZE EVAL STRUCTURE VALIDITY GOAL_ID SYNTH "
    ANALYZE = "Analyzing"
    EVAL = "Evaluating"
    STRUCTURE = "Forming Arguments (Structure)"
    VALIDITY = "Forming Arguments (Validity)"
    GOAL_ID = "Identifying the Goal"
    SYNTH = "Synthesizing"

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
            for entry in completed_assessment_data:
                at_type = ["Team"] if entry[Csv_locations.AT_TYPE.value] else ["Individual"]
                sfi_oc_data = get_csv_categories(entry[Csv_locations.RUBRIC_ID.value])
                for i in Catagories_csv:
                    oc = entry[Csv_locations.JSON.value][i.value]["observable_characteristics"]
                    for j in range (0, len(oc)):
                        if(oc[j] == '0'):
                            continue
                        writer.writerow([entry[Csv_locations.AT_NAME.value]] 
                                    + at_type
                                    + [entry[Csv_locations.AT_COMPLETER.value]]
                                    + [entry[Csv_locations.TEAM_NAME.value]]
                                    + [entry[Csv_locations.FIRST_NAME.value]]
                                    + [entry[Csv_locations.LAST_NAME.value]]
                                    + [entry[Csv_locations.COMP_DATE.value].strftime("%m/%d/%Y")]
                                    + [i.value]
                                    + [entry[Csv_locations.JSON.value][i.value]["rating"]]
                                    + [sfi_oc_data[1][j][1]]
                                    + ["OC"]
                                    )
                for i in Catagories_csv:
                    sfi = entry[Csv_locations.JSON.value][i.value]["suggestions"]
                    for j in range (0, len(sfi)):
                        if(sfi[j] == '0'):
                            continue
                        writer.writerow([entry[Csv_locations.AT_NAME.value]] 
                                    + at_type
                                    + [entry[Csv_locations.AT_COMPLETER.value]]
                                    + [entry[Csv_locations.TEAM_NAME.value]]
                                    + [entry[Csv_locations.FIRST_NAME.value]]
                                    + [entry[Csv_locations.LAST_NAME.value]]
                                    + [entry[Csv_locations.COMP_DATE.value].strftime("%m/%d/%Y")]
                                    + [i.value]
                                    + [entry[Csv_locations.JSON.value][i.value]["rating"]]
                                    + [sfi_oc_data[0][j][1]]
                                    + ["SFI"]
                                    )
                        

#----------------------------------------------------------------------------------------------------
# File Purpose: 
#   This file contains functions that retrieves data from the database
# and returns to a csv file to a customer.
#
# NOTE:
#   the current way to write out things is as follows:
# AT_name, RN(AT_type, AT_completer), TeamName, IndividualName, CompDate, Category, datapoint
#            /             \                                                            |
#        unitofasess...     roleid                                                     rating,oc,sfi
#----------------------------------------------------------------------------------------------------
import csv
import io
import contextlib
from core import app
from models.queries import *
from enum import Enum
from datetime import datetime
from collections import deque

def rounded_hours_difference(completed: datetime, seen: datetime) -> int:
    """
    Description:
    Returns the hour difference between seen
    and completed rounded to the nearest
    full hour.

    Parameters:
    Completed: datetime (The day the completed assessment was saved)
    seen: datetime (The day the student saw the completed assessment)

    Return:
    Result: int (The lag_time between completed and seen)

    Exception:
    TypeError: Both arguements must be datetimes.
    """

    if not isinstance(seen, datetime): raise TypeError(f"Expected: {datetime}, got {type(seen)} for seen.")
    if not isinstance (completed, datetime): raise TypeError(f"Expected: {datetime}, got {type(completed)} for completed.")

    time_delta = seen - completed

    hours_remainder = divmod( divmod( time_delta.total_seconds(), 60 )[0], 60)

    return int(hours_remainder[0]) if hours_remainder[1] < 30.0 else int(hours_remainder[0]) + 1


class Csv_data(Enum):
    """
    Description:
    Locations associated to where they are in the json file.
    This enum should be modified if the json names change in the future.

    Parameters:
    NONE (THIS IS AN ENUM!)
    """
    AT_NAME = 0

    AT_TYPE = 1

    RUBRIC_ID = 2

    RUBRIC_NAME = 3

    AT_COMPLETER = 4

    TEAM_NAME = 5

    FIRST_NAME = 6

    LAST_NAME = 7

    COMP_DATE = 8

    LAG_TIME = 9
    
    NOTIFICATION = 10

    JSON = 11

def create_csv_new(at_id: int) -> str:
    """
    Description:
    Creates the csv file and dumps info into it.
    File name follows the convention: [0-9]*.csv

    Parameters:
    at_id: int (The id of an assessment task)

    Return:
    str
    """
    # Assessment_task_name, Completion_date, Rubric_name, AT_type (Team/individual), AT_completer_role (Admin, TA/Instructor, Student), Notification_date    

    # Setting app context and initing the writer.
    with app.app_context():
        with io.StringIO() as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)

            writer.writerow(
                ["Assessment_task_name"] +
                ["Completion_date"]+
                ["Rubric_name"]+
                ["AT_type (Team/individual)"] +
                ["AT_completer_role (Admin[TA/Instructor] / Student)"] +
                ["Notification_data"]
            )

           # List of dicts: Each list is another individual in the AT and the dict is there related data. 
            completed_assessment_data = get_csv_data_by_at_id(at_id)
            if len(completed_assessment_data) == 0:
                return csvFile.getvalue()
            
            fixed_retrive = lambda location: completed_assessment_data[0][location]
            
            # Populates the next line in the csv file as per the last write.
            # Use fixed_retrive since the first user will always exist by this point.
            writer.writerow(
                [fixed_retrive(Csv_data.AT_NAME.value)]      +
                [fixed_retrive(Csv_data.COMP_DATE.value)]    + # Ask if client wants something more generic.
                [fixed_retrive(Csv_data.RUBRIC_NAME.value)]  +
                ["Team" if fixed_retrive(Csv_data.AT_TYPE.value) else "Individual"] +
                [fixed_retrive(Csv_data.AT_COMPLETER.value)] +
                [fixed_retrive(Csv_data.NOTIFICATION.value)]
            )

            writer.writerow(
                ["Team name"]  +
                ["First name"] +
                ["last name"]  +
                ["Category"]   +
                ["Rating"]     +
                ["Observable Characteristics"]  +
                ["Suggestions for Improvement"] +
                ["Feedback time lag"]
            )

            # Going through each individuals information.
            for individual in completed_assessment_data:
                sfi_oc_data = get_csv_categories(individual[Csv_data.RUBRIC_ID.value])

                lag = ""
                try:
                    # Possible that a particular individual has not yet seen so its a Nonetype in the backend.
                    lag = rounded_hours_difference(individual[Csv_data.COMP_DATE.value], individual[Csv_data.LAG_TIME.value])
                except TypeError:
                    pass
                
                #V2
                #notedNames = False

                # This section deals with formating and outputting the data.
                for category in individual[Csv_data.JSON.value]:
                    if category == "done" or category == "comments": # Yes those two are "categories" at least from how the data is pulled.
                        continue
                    
                    ocs = individual[Csv_data.JSON.value][category]["observable_characteristics"]
                    sfis = individual[Csv_data.JSON.value][category]["suggestions"]

                    # Little queue buffer to help organize the final output.
                    ocs_queue = deque()
                    sfis_queue = deque()

                    largest_Size = lambda x, y: max(len(x), len(y))

                    for i in range(0, largest_Size(ocs, sfis)):
                        if i < len(ocs) and ocs[i] == '1':
                            ocs_queue.append("ocs")
                        if i < len(sfis) and sfis[i] == '1':
                            sfis_queue.append("sfis")

                    write_out_oc = ""
                    write_out_sfi = ""

                    # Write out is dependent on if there are any ocs or sfis to write.
                    for i in range(0, largest_Size(ocs_queue, sfis_queue)):

                        write_out_oc = "" if len(ocs_queue) == 0 else ocs_queue.popleft()
                        write_out_sfi = "" if len(sfis_queue) == 0 else sfis_queue.popleft()
                        
                        #V1
                        writer.writerow(
                            [individual[Csv_data.TEAM_NAME.value]]  +
                            [individual[Csv_data.FIRST_NAME.value]] +
                            [individual[Csv_data.LAST_NAME.value]]  +
                            [category] +
                            [individual[Csv_data.JSON.value][category]["rating"]] +
                            [write_out_oc] +
                            [write_out_sfi] +
                            [lag]
                        )

                        #V2
                        #if(i == 0 and not notedNames):
                        #    writer.writerow(
                        #    [individual[Csv_data.TEAM_NAME.value]]  +
                        #    [individual[Csv_data.FIRST_NAME.value]] +
                        #    [individual[Csv_data.LAST_NAME.value]]  +
                        #    [category] +
                        #    [individual[Csv_data.JSON.value][category]["rating"]] +
                        #    [write_out_oc] +
                        #    [write_out_sfi] +
                        #    [lag])
                        #    notedNames = True
                        #elif(i == 0 and notedNames):
                        #    writer.writerow(
                        #    ['']  +
                        #    [''] +
                        #    ['']  +
                        #    [category] +
                        #    [individual[Csv_data.JSON.value][category]["rating"]] +
                        #    [write_out_oc] +
                        #    [write_out_sfi] +
                        #    [''])
                        #else:
                        #    writer.writerow(
                        #        ['']+
                        #        ['']+
                        #        ['']+
                        #        ['']+
                        #        ['']+
                        #        [write_out_oc]  +
                        #        [write_out_sfi] +
                        #        ['']
                        #    )

            return csvFile.getvalue()

def create_csv(at_id: int) -> str:
    """
    Description:
    Creates the csv file and dumps info in to it.
    File name is decided by the caller.

    Parameters:
    at_id: int (The id of an assessment task)

    Return:
    str
    """
    # Assessment_task_name, Completion_date, Rubric_name, AT_type (Team/individual), AT_completer_role (Admin, TA/Instructor, Student), Notification_date
    with app.app_context():
        with io.StringIO() as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)

            # Next line is the header line and its values.
            writer.writerow(
                ["Assessment_task_name"] +
                ["Completion_date"]+
                ["Rubric_name"]+
                ["AT_type (Team/individual)"] +
                ["AT_completer_role (Admin[TA/Instructor] / Student)"] +
                ["Notification_data"]
            )
            
            completed_assessment_data = get_csv_data_by_at_id(at_id)#WARNING: check with the clients to see if they want a certain order.

            if len(completed_assessment_data) == 0: #ERROR:make it /= since the list will always be 1 large houseing a dict of data
                return csvFile.getvalue()           #WARNING:this make defrefrencing it to zero useless; note python inherently makes a alias

            writer.writerow(
                [completed_assessment_data[0][Csv_data.AT_NAME.value]]      +
                [completed_assessment_data[0][Csv_data.COMP_DATE.value]]    +
                [completed_assessment_data[0][Csv_data.RUBRIC_NAME.value]]  +
                ["Team" if completed_assessment_data[0][Csv_data.AT_TYPE.value] else "Individual"] +
                [completed_assessment_data[0][Csv_data.AT_COMPLETER.value]] +
                [completed_assessment_data[0][Csv_data.NOTIFICATION.value]]
            )

            # The block generates data lines.
            writer.writerow(
                ["Team_name"]  +
                ["First name"] +
                ["last name"]  +
                ["Category"]   +
                ["Rating"]     +
                ["Observable Characteristics"]  +
                ["Suggestions for Improvement"] +
                ["feedback time lag"]
            )
                            
            for entry in completed_assessment_data: #WARNING: entry here is essentialy an alias for the only dict in completed assement; yes this loop run only once
                with open('output.txt', 'w') as f:
                    with contextlib.redirect_stdout(f):
                        print(entry[Csv_data.JSON.value])
                sfi_oc_data = get_csv_categories(entry[Csv_data.RUBRIC_ID.value]) #ERROR: This funciton is where the error is as its not pulling the correct realted oc and sfi
                
                lag = ""

                try:
                    lag = rounded_hours_difference(entry[Csv_data.COMP_DATE.value], entry[Csv_data.LAG_TIME.value])
                except:#WARNING: better to keep watch of what exceptions are thrown as it seems that its alwasy throwing blanks.
                    pass

                for i in entry[Csv_data.JSON.value]:#WARNING: This is going throught the categories would clients want a specific order same for the names pulled.
                    if i == "comments" or i == "done": #ERROR: This needs to pass other thing like the description else more work and bugs- potentially the copy of data
                        continue
                    #WARNING:heres a small dump
                    #{'Analyzing': {'comments': 'ASDFASDFASDFASDFASDF', 'description': 'Interpreted information to determine meaning and to extract relevant evidence', 'observable_characteristics': '101', 'rating': 3, 'rating_json': {'0': 'No evidence', '1': 'Inaccurately', '2': '', '3': 'With some errors', '4': '', '5': 'Accurately'}, 'suggestions': '00100'}, 
                    # 'Evaluating': {'comments': 'ASDFJKL;', 'description': 'Determined the relevance and reliability of information that might be used to support the conclusion or argument', 'observable_characteristics': '111', 'rating': 1, 'rating_json': {'0': 'No evidence', '1': 'Minimally', '2': '', '3': 'Partially', '4': '', '5': 'Extensively'}, 'suggestions': '00000'}, 
                    # 'Forming Arguments (Structure)': {'comments': '', 'description': 'Made an argument that includes a claim (a position), supporting information, and reasoning.', 'observable_characteristics': '0100', 'rating': 5, 'rating_json': {'0': 'No evidence', '1': 'Minimally', '2': '', '3': 'Partially', '4': '', '5': 'Completely'}, 'suggestions': '1111111'}, 
                    # 'Forming Arguments (Validity)': {'comments': '', 'description': 'The claim, evidence, and reasoning were logical and consistent with broadly accepted principles.', 'observable_characteristics': '10110', 'rating': 4, 'rating_json': {'0': 'No evidence', '1': 'Minimally', '2': '', '3': 'Partially', '4': '', '5': 'Fully'}, 'suggestions': '11111'}, 
                    # 'Identifying the Goal': {'comments': '', 'description': 'Determined the purpose/context of the argument or conclusion that needed to be made', 'observable_characteristics': '110', 'rating': 2, 'rating_json': {'0': 'No evidence', '1': 'Minimally', '2': '', '3': 'Partially', '4': '', '5': 'Completely'}, 'suggestions': '1010'}, 
                    # 'Synthesizing': {'comments': '', 'description': 'Connected or integrated information to support an argument or reach a conclusion', 'observable_characteristics': '101', 'rating': 2, 'rating_json': {'0': 'No evidence', '1': 'Inaccurately', '2': '', '3': 'With some errors', '4': '', '5': 'Accurately'}, 'suggestions': '10001'}, 'comments': '', 'done': True}
                    oc = entry[Csv_data.JSON.value][i]["observable_characteristics"]#WARNING; dumps a string of 1s and 0s that represetns what the client has chosen

                    for j in range (0, len(oc)):#
                        if(oc[j] == '0'):
                            continue

                        writer.writerow(
                            [entry[Csv_data.TEAM_NAME.value]]  +
                            [entry[Csv_data.FIRST_NAME.value]] +
                            [entry[Csv_data.LAST_NAME.value]]  +
                            [i] +
                            [entry[Csv_data.JSON.value][i]["rating"]] +
                            [sfi_oc_data[1][j][1]] +
                            [""] +
                            [lag]
                        )

                for i in entry[Csv_data.JSON.value]:
                    if i == "comments" or i == "done":
                        continue

                    sfi = entry[Csv_data.JSON.value][i]["suggestions"]

                    for j in range (0, len(sfi)):
                        if(sfi[j] == '0'):
                            continue

                        writer.writerow(
                            [entry[Csv_data.TEAM_NAME.value]]  +
                            [entry[Csv_data.FIRST_NAME.value]] +
                            [entry[Csv_data.LAST_NAME.value]]  +
                            [i] +
                            [entry[Csv_data.JSON.value][i]["rating"]] +
                            [""] +
                            [sfi_oc_data[0][j][1]]  +
                            [lag]
                        )

            return csvFile.getvalue()

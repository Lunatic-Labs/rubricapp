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

    TEAM_ID = 5

    TEAM_NAME = 6

    USER_ID = 7

    FIRST_NAME = 8

    LAST_NAME = 9

    COMP_DATE = 10

    LAG_TIME = 11
    
    NOTIFICATION = 12

    JSON = 13

def create_csv(at_id: int) -> str:
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
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL, delimiter=' ')

            writer.writerow(["Course_Name"])
            writer.writerow([get_course_name_by_at_id(at_id)])

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

                    # Fetch related oc and sfi data then populate queues
                    oc_sfi_data = get_csv_categories(individual[Csv_data.RUBRIC_ID.value], individual[Csv_data.USER_ID.value], individual[Csv_data.TEAM_ID.value], at_id, category)

                    with open('output.txt', 'w') as f:
                            with contextlib.redirect_stdout(f):
                                print(oc_sfi_data)

                    largest_Size = lambda x, y: max(len(x), len(y))

                    fixed_oc_sfi_retrive = lambda oc_or_sfi, location: oc_sfi_data[oc_or_sfi][location][0]

                    for i in range(0, largest_Size(ocs, sfis)):
                        if i < len(ocs) and ocs[i] == '1':
                            ocs_queue.append(fixed_oc_sfi_retrive(0, i))
                        if i < len(sfis) and sfis[i] == '1':
                            sfis_queue.append(fixed_oc_sfi_retrive(1, i))

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
        

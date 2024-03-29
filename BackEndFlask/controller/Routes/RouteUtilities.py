"""
Custom utilities used throughout the Routes directory.
"""


"""
Desciption:
Given an array of string elements, returns true
if any string element is None, an empty string,
or the string undefined. Returns false otherwise.

Parameters:
arr: The list of string elements to check if missing.
"""
def is_any_variable_in_array_missing(arr: list) -> bool:
    for var in arr:
        if var is None or var == "" or var == "undefined":
            return True

    return False
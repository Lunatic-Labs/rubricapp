from models.logger import Logger
import requests

def find_version_num(package:str)-> str:
    """
    Usage: [Package_name]: str
    Description:
        This will return the most current version number for a particular python package.
    Returns:
        <class 'str'> : returns a str containing the latest version number.
    Exceptions:
        On any failure will return "FAILURE" so that nothing matches.
    """
    try:
        url = "https://pypi.org/pypi/" + package + "/json"
        response = requests.get(url)
        latest_version = response.json()["info"]["version"]
    except:
        return "FAILURE"

    return latest_version

def dependency_check():
    """
    Usage: dependency_check()
    Description:
        This will go through our requirements.txt checking current version of libs to ensure that we
        are aware of any big changes.
    Returns:
        None
    Exceptions:
        Nothing is reported back upon failure.
    """
    try:
        log = Logger("Dependancy checks")
        file = open("requirements.txt", 'r')
        for line in file:
            clean_line = line.strip()
            if clean_line and not clean_line.startswith("#"):
                words = line.split()
                latest_ver_num = find_version_num(words[0])
                if words[2] != latest_ver_num:
                    log.warning("The package {" + words[0] + "} is now at version number " + latest_ver_num + " while we are at " + words[2]) 
        file.close()
        log.info("Dependency Check finished.")
    except:
        file.close()
    return
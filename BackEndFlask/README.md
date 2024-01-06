# RubricApp

RubricApp is a web application for evaluating students' professional skills, such as teamwork and communication. With RubricApp, instructors can assess teams of students in real-time using [research-based rubrics](http://elipss.com/) or custom rubrics. Instructors can email students their results, as well as download the data for analysis. RubricApp is the software behind ELIPSS SkillBuilder.

#### MySQL Setup 

First, install MySQL-Server 

```
sudo apt install mysql-server
```

Second, you need to set the MySQL password. To do this, first run the command: 
```
sudo mysql -u root
```

This will place you in the MySQL terminal. Use these commands to create an account named skillbuilder and set the passowrd to "WasPogil1#" (this should be changed for deployment)

```
CREATE USER 'skillbuilder'@'localhost' IDENTIFIED BY 'WasPogil1#';
GRANT ALL PRIVILEGES ON *.* TO 'skillbuilder'@'localhost';
FLUSH PRIVILEGES;
exit; 
```

Once this is done, you use `setupEnv.py` as normal to create the database. If any reason you want to access the database directly, run `mysql -u skillbuilder -p` and then type the password.


## Setting up the BackEnd environment

Requires python3 and pip3. If you do not have these installed, install python3 and pip3.
*Note*: Simply Googling how to install python3 and pip3 should get you the correct commands for installing python3 and pip3.

In order to setup the environment for the first time, you need to be in the BackEndFlask directory
and run the following command:

```
python3 setupEnv.py
```

This command will install all the requirements from requirements.txt, setup your database, and run the BackEnd server.
The command will also print out some logging information, including a localhost URL (probably http://127.0.0.1:5000/).

*Note*: If for some reason python3 is not found, try using the 'python' command. This may vary per local machine.

## Running the application after setup

Use the following command for running the application during regular use:

```
python3 run.py
```

This command will allow you to skip past installing/updating all the requirements.

#### Adding redis

You need to run sudo-apt install redis-server
modification to appended only service can be done looking at AOF
at: https://redis.io/docs/management/persistence/
# Downloading and running Pylint

It is also advised for you to download pylint. Pylint is a command-line/terminal tool that checks your python code and grades it based on how readable it is by other programmers.

To install pylint, you will need to use the following command:

```
pip install pylint
```

Furthermore, in order to use pylint, you must use this command: 

```
pylint [options] modules_or_packages
```

If you wish to learn more about pylint, the documation for the latest version can be found here: 

```
https://pylint.readthedocs.io/en/latest/
```
# Downloading and using Coverage.py

You are also advised to download Coverage.py. Coverage.py is a tool for measuring code coverage of Python programs. It notes which parts of the code have been executed, then analyzes the source to identify code that could have been executed but was not.

In order to install it, you must run the following command:

```
python3 -m pip install coverage
```

In order to use it, you must first run a variation of this command:

```
coverage run [files or modules]
```

Next, in order to run pytest under Coverage.py you must run this command:

```
coverage run -m pytest arg1 arg2 arg3
```

instead of running this command:

```
pytest arg1 arg2 arg3
```

Finally, use the following command to get the Coverage results:

```
coverage report
```

If you wish to learn more about Coverage.py, the documation for the latest version can be found here: 

```
https://coverage.readthedocs.io/en/latest/
```

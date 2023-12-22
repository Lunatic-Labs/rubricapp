# RubricApp

RubricApp is a web application for evaluating students' professional skills, such as teamwork and communication. With RubricApp, instructors can assess teams of students in real-time using [research-based rubrics](http://elipss.com/) or custom rubrics. Instructors can email students their results, as well as download the data for analysis. RubricApp is the software behind ELIPSS SkillBuilder.

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

#### Using a different location for the database

If for some reason you want the sqlite database file and users directory to live somewhere else, replace \`pwd\` in the above commands with the desired path. Just make sure that the paths for both commands are the same.

#### Adding redis

You need to run sudo-apt install redis-server
modification to appended only service can be done looking at AOF
at: https://redis.io/docs/management/persistence/
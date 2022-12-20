@ -1,60 +1,17 @@

# RubricApp


RubricApp is a web application for evaluating students' professional skills, such as teamwork and communication. With RubricApp, instructors can assess teams of students in real-time using [research-based rubrics](http://elipss.com/) or custom rubrics. Instructors can email students their results, as well as download the data for analysis. RubricApp is the software behind ELIPSS SkillBuilder.
requires packages

## Install requirements

Requires python 3. 
 *Note*: If running on a Linux machine, run python3/pip3 for any following commands using python/pip

All required documents are found in the requirements.txt file

To install required python packages, either:

a) pip install -r requirements.txt

OR

b) Using the method of your choice, individually install each of the python packages listed in requirements.txt.

## Running the application

### With Flask's test web server

From the base directory...

Before running the application for the first time, you need to create the database and initialize the test server.
```
python setupEnv.py .
```

The command will print out some logging information, including a localhost URL (probably http://127.0.0.1:5000/). Go there in your web browser to see the site.

#### Using a different location for the database

If for some reason you want the sqlite database file and users directory to live somewhere else, replace \`pwd\` in the above commands with the desired path. Just make sure that the paths for both commands are the same.

### With Apache

The application can run in Apache. Look up information about running WSGI apps in Apache.

# Software Studio
### What has been done
A full suite of full coverage Selenium tests is available to tests the front end of the system.
A Figma wireframe has been created with an early site redesign proposal.
### What we want to accomplish
#### A fully redesigned UI/UX
Current system front end utilizes an outdated and unnattractive design.
We are looking to update this to reflect a more modern feel and inuitive experience.
#### Adding/Fixing Functionality
The system has a few issues with currently implemented functionalities not working. This should be resolved. 
Additionally, the Kanban board has tickets related to new features. Look to implement these while also 
brainstorming any additional features that the customer may want added

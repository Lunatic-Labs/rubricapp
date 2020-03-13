# RubricApp

RubricApp is a web application developed at the University of Iowa for evaluating students' professional skills, such as teamwork and communication. With RubricApp, instructors can assess teams of students in real-time using [research-based rubrics](http://elipss.com/) or custom rubrics. Instructors can email students their results, as well as download the data for analysis.

## Install requirements with pip (for development or deployment)

From the base directory
```
./setup-with-pip.sh
```

## Running the application

### With Flask's test web server

From the base directory
```
python app.py `pwd`
```
If for some reason you want the sqlite database file and users directory to live somewhere else, replace \`pwd\` with the desired path.

The command will print out some logging information, including a localhost URL (probably http://127.0.0.1:5000/). Go there in your web browser to see the site.

### With Apache

```
TODO
```

# Contact

- For development questions or trying our test server: [brandon-d-myers@uiowa.edu](mailto:brandon-d-myers@uiowa.edu)
- For information about the rubrics: http://elipss.com/

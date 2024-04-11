# SkillBuilder

SkillBuilder is a web application for evaluating students' professional skills, such as teamwork and communication.

SkillBuilder is implemented in two parts: the front end is a React application, and the back end is a python Flask application.

## Requirements

- python3
- pip 3
- Node.js

## Setting up the BackEnd environment

In order to setup the environment for the first time, you need to be in the `/rubricapp/BackEndFlask/` directory and run the following command:

```sh
python3 setupEnv.py -irds
```

This command will install all the requirements from requirements.txt, setup your database, and run the BackEnd server.
The command will also print out some logging information, including a localhost URL (probably http://127.0.0.1:5000/).

#### **Flag Meanings:**

- i install
- r reset
- d demo
- s start

_Note_: if **python3** is not found, try using the **python** command. This may vary per local machine.

## Setting up the FrontEnd environment

In order to install the required packages you will need to be in the directory `/rubricapp/FrontEndReact/`.

Inside the FrontEndReact directory run the following command to install all the Node packages for the project:

```sh
npm install
```

_Note_: if you run npm install in the root directory, it will cause issues.

## Running the BackEnd server of the application after setup

Use the following command for running the application in the `/rubricapp/BackEndFlask/` directory during regular use:

```sh
python3 run.py
```

This command will allow you to skip past installing/updating all the requirements.

## Running the FrontEnd server of the application after setup



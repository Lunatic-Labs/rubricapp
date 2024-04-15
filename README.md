# **SkillBuilder**

SkillBuilder is a web application for evaluating students' professional skills, such as teamwork and communication. The purpose of the SkillBuilder application is to allow instructors to assess teams of students in real-time using research-based or custom rubrics. Instructors can email students their results, as well as download the data for analysis.

SkillBuilder is implemented in two parts: the front end is a React application, and the back end is a python Flask application.

## **Requirements**

- python3
- pip3
- Node.js

## **Setting up your Environment**

#### **Setting up the BackEnd environment**

In order to setup the environment for the first time, you need to be in the `/rubricapp/BackEndFlask/` directory and run the following command:

```sh
python3 setupEnv.py -irds
```

This command will install all the requirements from requirements.txt, setup your database, and run the BackEnd server. The command will also print out some logging information, including a localhost URL (probably http://127.0.0.1:5000/).

##### **Flag Meanings:**

- i install
- r reset
- d demo
- s start

_Note_: if `python3` is not found, try using the `python` command instead. This may vary per local machine.

#### **Setting up the FrontEnd environment**

In order to install the required packages you will need to be in the directory `/rubricapp/FrontEndReact/`.

Inside the FrontEndReact directory run the following command to install all the Node packages for the project:

```sh
npm install
```

_Note_: if you run `npm install` in the root directory, it will cause issues.

## **Running the Servers after setup**

_Note_: You will need to run the FrontEnd and BackEnd server in different terminal windows.

#### **Running the BackEnd server of the application**

Use the following command for running the application in the `/rubricapp/BackEndFlask/` directory during regular use:

```sh
python3 run.py
```

This command will allow you to skip past installing/updating all the requirements.

For some cases it might make more sense to run `python3 setupEnv.py` with the appropriate flags instead of using the `python3 run.py` command

#### **Running the FrontEnd server of the application**

Use the following command for running the application in the `/rubricapp/FrontEndReact/` directory:

```sh
npm start
```

This command runs the app in develpment mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

## **Running Jest tests**

For running jest tests on the application you will use the following command:

```sh
npm test
```

Launches the test runner in the interactive watch mode. Make sure the version of react is 'react-scripts@0.3.0' or higher. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

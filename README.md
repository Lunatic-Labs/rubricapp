# SkillBuilder
A web application for evaluating students' professional
skills, such as teamwork and communication. The purpose
of the SkillBuilder application is to allow instructors
to assess teams of students in real-time using
research-based or custom rubrics. Instructors can email
students their results, as well as download the data
for analysis.



## SkillBuilder is implemented in three parts: ##

- A Back End Flask server.

- A Caching Redis server.

- A Front End React server.



## REQUIREMENTS: ##

- Python 3.12 and up.

- Homebrew 4.2.18 and up.

- Redis 7.2.4 and up.

- Node.js v21.6.1 and up.

NOTE:

- You WILL encounter issues when running both the
Back End and Front End servers if you do NOT have
installed the REQUIRED versions of Python and
Node.js.

NOTE:

- Linux, Mac, and WSL Developers use `python3`.

- WINDOWS DEVELOPERS ARE NO LONGER SUPPORTED.



## Setting up the Back End environment: ##

- Follow the link for instructions on downloading Python:

  https://www.python.org/downloads/

- In order to setup the environment for the first time,
  you will need to be in the `/rubricapp/BackEndFlask/`
  directory and run the following command:

      python3 setupEnv.py -id

- This command will install all the requirements from
  requirements.txt, create a new database, and load
  the database with demo data.

Flag Meanings:

- `-i` install
- `-d` demo

NOTE:
- If you DO NOT run the above command with the
  `-i` and `-d` flags once, then the Back End server
  WILL NOT be initialized properly. If the Back End
  server is NOT initialized properly, then the Back
  End server WILL NOT run. IF the Back End server
  is NOT running, then the Front End server WILL NOT
  run properly either.

- In the case where you want to restart with a fresh
  new database, add the flag `-r` to reset the existing
  database. You WILL then have to rerun the command with
  the `-d` flag to load demo data.



## Setting up the Redis environment: ##

- Follow the link for instructions on downloading brew for
  Linux, Mac, and WSL Developers:

  https://brew.sh/

- Once installed, run the following command with Homebrew
  to install redis:

      brew install redis



## Setting up the Front End environment: ##
- Follow the link for instructions on downloading Node.js:

  https://nodejs.org/en/download
  -Follow the instructions for setting up a virtual environment:

  Step 1: 
  Ensure you are in the BackEndFlask directory by running
  the command:

      cd BackEndFlask

  Step 2:
  Create the virtual environment by running the command:
  
      python3 -m venv BackEndFlaskVenv

  Step 3:
  Activate the virtual environment by running the command:

      source BackEndFlaskVenv/bin/activate

  To Deactivate the virtual environment, run the command:

      deactivate

  To Remove the virtual environment, run the command:

      rm -r BackEndFlaskVenv
      
- In order to install the required packages you WILL need
  to be in the directory `/rubricapp/FrontEndReact/`.

- Inside the Front End React directory run the following
  command to install all the Node packages for the project:

      npm install

NOTE:
- If you run `npm install` outside of the
  `/rubricapp/FrontEndReact/` directory, it WILL cause
  issues.

- In the case where you run `npm install` outside
  of the `/rubricapp/FrontEndReact/` directory,
  simply remove the created files `package.json` and
  `package-lock.json` and the directory `node_modules`.
  Ensure that you have correctly changed the current
  working directory to `/rubricapp/FrontEndReact/`
  before attempting to run the command to install
  the Node packages.



## Running the Servers after setup: ##

NOTE:

- You WILL need to run the Back End server first,
  the Redis server second, then the Front End server
  third.

- You WILL need to run the Back End, Redis, and
  Front End servers in different terminal windows.



## Running the Back End server of the application: ##
- Use the following command for running the Back End
  server in the `/rubricapp/BackEndFlask/` directory
  during regular use:

      python3 setupEnv.py -s

Flag meaning:

- `-s` start



## Running the Redis server: ##

- Use the following command for running the Redis server:

      brew services start redis

NOTE:
- Run the following command to restart redis with
  Homebrew:

      brew services restart redis

- Run the following command to stop redis with
  Homewbrew:

      brew services stop redis



## Running the Front End server of the application: ##

- Use the following command for running the Front End
  Server in the `/rubricapp/FrontEndReact/` directory:

      npm start

- This command runs the Front End server in development mode.
  Open http://localhost:3000 or http://127.0.0.1:3000 to view
  it in your browser.

- Any changes made in the `/rubricapp/FrontEndReact/`
  directory will be caught by the running Front End
  server, thus rerendering any opened tabs in your
  browser.

- You will also be able to see any compile warnings
  and errors in the console.



## Running Pytest: ##

- For running pytests on the Back End server
  you will use the following command:

      python3 setupEnv.py -t

Flag meaning:

- `-t` test



## Running Jest tests: ##

- For running Jest tests on the Front End server
  you will use the following command:

      npm test

- This command launches the test runner in the interactive
  watch mode. Make sure the version of react is
  'react-scripts@0.3.0' or higher.

- Here is a link for learning more information about running tests:

  https://facebook.github.io/create-react-app/docs/running-tests

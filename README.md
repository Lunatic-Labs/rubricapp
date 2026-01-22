# SkillBuilder

A web application for evaluating students' professional skills in real time.

## Description

The purpose of the SkillBuilder application is to allow instructors to assess teams of students in real time using research-based or custom rubrics. Instructors are offered the ability to email their students and view basic statistics and graphs. Additionally, instructors can download the data for analysis.

## Getting Started

### Dependencies

If you choose to run the application using Docker, then Docker will be the only thing to install from the list below on your system. Otherwise, ensure the following:
* **Operating System**: Windows 10* or newer*, MacOS11+*, or any modern Linux distribution.
* **Runtime Environments**:
    * Node.js(v21.6.1 or higher) - Handles frontend logic.
    * Python(v3.12 or higher) - Handles backend server logic.
* **Database/Caching**:
    * Redis(v5.2.1) - Handles session management and rate limiting.
    * MySQL(v8.0) - Manages the application's data.
* **Package Managers**:
    * pip for Python backend.
    * npm for Node.js frontend.
* **Docker**(*recommended; skip if not using*) - simplifies setup and ensures consistency across operating systems.

*Note: Running the application on Windows locally(outside of docker or WSL) is not recommended or stable.*

*You can install the visual Docker Desktop app or just the CLI [here](https://docs.docker.com/get-started/get-docker/).*

## Installing

### Docker
1. Build the containers.
```bash
docker compose build
 ```
*This step is needed for whenever Docker files are modified.*

### Linux

#### Debian/Ubuntu (and its derivatives)

1. Perform any system upgrades.

```bash
sudo apt update -y
sudo apt upgrade -y
```

2. Install `Python3`:
```bash
sudo apt install python3
python3 --version
```

Ensure that the version is `>= 3.12`.

*Note: Debian uses the last _stable_ release of Python (which is not `3.12`), but
from testing, it seems to work just fine.*

3. Install `Redis`:

Using the following link to install:

https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

*Note: Ubuntu and Debian typically use `systemctl` as the init system, but if using
something different, the docs will not cover those.*

4. Install Node.js:

```bash
sudo apt install nodejs
node -v # Checking to make sure it is installed.
```

### MacOS

MacOS will require some kind of package manager (this document will
use `homebrew`).

You can find `homebrew` here: https://brew.sh/

1. Install `Python3`

You can find the downloads here:

https://www.python.org/downloads/macos/

2. Install `Redis`

```
brew install redis
```

3. Install `Node`

Either download prebuilt binaries directly, or use a package manager:

https://nodejs.org/en/download/package-manager

### Windows

Running this project on bare metal Windows is no longer supported.
You will need to get `WSL` (Windows Subsystem for Linux) or preferably `WSL2`.

The following shows you how to set it up:

https://learn.microsoft.com/en-us/windows/wsl/install

Once this is installed and set up, open Windows Terminal, Powershell, Command Prompt
(or whatever terminal emulator you use) and do:

```powershell
wsl
```

If this is working correctly, follow the installation instructions in the *Linux*
section of this README above.

## Executing the application

### Docker

To start up the built containers run:
```bash
docker compose up
```
The containers are up and running if none exited with an error of 1.

Use `ctrl+c` to shut down the containers(must be in terminal that started the containers or issues commands to them).

When the frontend finishes compiling, it should serve the web app at the link it notes. I will look like `http://localhost:3000`. Click on it or open it in your preferred browser.

### Not Using Docker

You can also run rubricapp without Docker, but you will need to manually run the setup yourself.

1. Create a virtual environment

```bash
python3 -m venv <environment_name>
source <environment_name>/bin/activate
```

This is where all of the Python dependencies will be stored instead of being
stored globally on your system. You will need to do the source command each time to pop into the virtual environment.

2. Start Redis

Enable the Redis service using your appropriate `init system` (`systemctl` in this example).

```bash
systemctl start redis
```

Make sure that it is running:

```bash
systemctl status redis
```

3. Launch the backend:

```bash
user@/(project root)$ cd BackendFlask
user@/(project root)/BackendFlask$ python3 ./setupEnv.py -irds
```

The setup flags are as follows:
* `-i, --install` - install all dependencies
* `-r, --reset` - reset the database
* `-d, --demo` - load demo data into the database
* `-s, --start` - start the backend server

Later iterations of using `setupEnv.py` only requires the `-s` flag
(unless new depencencies are added or if the database needs to be reset etc).

4. Launch the Frontend Server

```bash
user@/(project root)$ cd FrontendReact
user@/(project root)/FrontendReact$ npm install # only do this once
user@/(project root)/FrontendReact$ npm start
```

This will launch the server on port 3000. Access it by navigating to `http://localhost:3000` in your browser and logging in with appropriate credentials.

## Help

### Docker questions

1. So how will I be running or starting the code most of the time?

```bash
docker compose build; docker compose up
```
2. I am noticing that Docker is not building up the new continers right after modifying docker files; what can I do?
    
    * Docker does cache things like its builds. Try the following:
```bash
docker compose build --no-cache
```
3. This is all nice, but how do I get into a container to jump into the database or something live?
```bash
# The following command gets all the running containers.
docker ps
# OUTPUT:
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
# Notice the output above was empty. That is because my application is currently down. 
# NOTE: you can only go into a container when it is running.
# Fire up the application then run the command again and look at the [NAMES].
docker exec -t -i [CONTAINER_NAME] /bin/bash
# That previous command will pop you into the terminal of the container named.
```
4. What if I want to get rid of a container? 
```bash
# Note the containers must be stopped
docker ps -a # This lists all containers even if they are not running.
docker rm [CONTAINER_ID] # You get the ID from docker ps -a.
# A slightly more efficient command to remove them all is:
docker rm -v $(docker ps -aq) #-q means to only list container ids.
```
5. The containers are out of control. No matter what I do they will not stop even if I restart my machine. What can I do?
    * This is more prone to happen on machines with lower resources. The following command is tested to run on Linux and WSL2. Try to find the equivalent command online for your operating system.
```bash
# This command shuts down AppArmor on Linux.
# Without it working, opening other applications will be impossible until you restart your machine.
sudo aa-remove-unknown && docker stop $(docker ps -aq)
docker rm -v $(docker ps -aq) # Getting rid of the containers so they do not auto-start.
``` 
6. Even when I get rid of the container, things like the database are not in a clean new state. Why?
    * Why this is happening depends a little more on your system and Docker settings. It is possible that somewhere things are being cached or saved. I recommend the following command to just clear out the containers and their volumes.
```bash
docker-compose down --rmi all --volumes
```
7. How do I run the tests?
    * Go to Dockerfile.backend and change the flags from -ds to -t for the moment. Likewise change the cmd line in the fontend docker file to get the front end to run through its tests.

It is recommended to make these commands into aliases. Here is how to on [Ubuntu](https://www.hostingadvice.com/how-to/set-command-aliases-linuxubuntudebian/). You do not have to use vim; use your favorite text editor.

### Troubleshooting outside of Docker

**REDIS**
    
If it does not start correctly, there could be a multitude of reasons. I suggest
using `journalctl` to investigate it (`systemctl` will give out the full command).

But a good starting point is seeing if it is already running:

```bash
ps aux | grep redis
```

This will give the PIDs of all processes with `redis` in its name. Try killing them
with `kill <pid1> <pid2> ..., <pidN>` and then rerunning `systemctl start redis`.

_Note_: if `redis` is not considered a service, try using `redis-server` or `redis-server.service`.

**Port Conflicts**

The backend runs on port 5000 and the frontend runs on port 3000. You may already have processes running
on those ports. If this is the case, you will have conflicts and the server(s) will not run normally.

You can check what is running on those ports with:

```bash
lsof -i :5000
lsof -i :3000
```

If any output appears here, you may either want to kill them with `kill`, or run those processes on different ports.

### Other
If you are testing with adding students/TAs/admins, it may be time consuming to
manually do it via the website. There is a script that will automatically insert new
users into the database straight from the command line. It is important to note
that this script only works if the backend _is currently running inside docker_.

Run this script with:

```bash
./dbinsert.sh
```

Run this and follow the on-screen instructions.

## Testing 
### Backend
#### Local Testing (without Docker)

Before running tests locally, you need to set up your environment:
1. **MySQL Setup**: Install and configure MySQL on your local machine
2. **Database Configuration**: 
   - Create a MySQL user matching `MYSQL_USER` in `BackEndFlask/.env`
   - Set the password to match `MYSQL_PASSWORD` in `BackEndFlask/.env`
   - Create a database matching `MYSQL_DATABASE` in `BackEndFlask/.env`

3. **Run Tests**:
```bash
   cd BackEndFlask/
   
   # Run all tests
   python3 -m pytest Tests/
   
   # Run tests with verbose output
   python3 -m pytest -v Tests
   
   # Run specific test file
   python3 -m pytest -k "test_specific_file.py"

   # Run all tests with Backend coverage report
   python -m pytest Tests/ \
        --cov=models \
        --cov=functions \
        --cov=controller \
        --cov=constants \
        --cov=core \
        --cov=enums \
        --cov=env \
        --cov=logs \
        --cov=migrations \
        --cov=path \
        --cov=AWS_INFO \
        --cov-report=term-missing
    
    # Run a specific component test with a coverage report
    python -m pytest -k "models" --cov=models --cov-report=term-missing  or
    python -m pytest Tests/integration/models/ --cov=models --cov-report=term-missing
```
#### Docker Testing  

To get the backend tests going, navigate to `rubricapp/Dockerfile.backend`. 
Notice that the last line is what is starting up the back end code. It is running `setupEnv.py -ds`. 
Change
```bash
    -ds
    # To
    -t
```
Now build fresh without the cache and run `docker compose build` then `docker compose up`. 
The container will now run through the tests. Do not forget to change `-t` back to `-ds` once you are done testing.

### Frontend
To launch the frontend Jest tests, run the following:
```bash
npm test
``` 
**Note that for this to work you need to have have the backend running and serving connections.**



To get the frontend tests going, navigate to `rubricapp/Dockerfile.frontend`. Like the backend, we are only concerned with the very last line that starts the backend. The line we see is:
```bash
CMD ["npm", "start"]
```
Change it to:
```bash
CMD ["sh", "-c", "sleep 35 && npm start"]
```
Do not forget to change it back. One key difference is that there is a sleep before the command is ran. This is to allow the backend setup since Jest tests make hits to the backend. You can adjust the timer to more or less depending on how fast the backend is ready on your system.

**Note that running the Jest tests are not fast. It will look like it is frozen. It will then dump a lot of errors and warnings. Cleaning this up is still in progress.**

Because there is a lot of output from Jest tests, I recommend running:
```bash
docker compose up > jestTests.txt 2>&1
```
This will keep your termianl uncluttered and log things in the `jestTests.txt` file.

Now we will talk about how to create a backend test. Go to `BackEndFlask/Functions/test_files/test_genericImport.py`. We will be looking at `def test_should_fail_with_file_not_found`. The first thing to notice is that the function names will start with the word test followed by a brief description of what is being tested in snake case. The function needs to take the object `flask_mock_object` to be able to connect to the application. Use the same `with` line there in your function to use the applications context. If ever you want to use the database connection itself, then you can use `flask_mock_object.db`. Make sure to clean up any data that your function input to the database, so that the next test is working with a clean database.

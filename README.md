# SkillBuilder

A web application for evaluating students' professional
skills, such as teamwork and communication. The purpose
of the SkillBuilder application is to allow instructors
to assess teams of students in real-time using
research-based or custom rubrics. Instructors can email
students their results, as well as download the data
for analysis.

# Setup

The following shows how to get SkillBuilder running on your operating system.

## Requirements

The following technologies are required:
1. `Python >= 3.12`
2. `Redis`
3. `Docker/Docker Desktop`
4. `Node >= v21.6.1`

Find your operating system below and follow the instructions
on installing them.

### Linux

#### Debian/Ubuntu (and its derivatives)

1. Perform any system upgrades.

```
sudo apt update -y
sudo apt upgrade -y
```

2. Install `Python3`:
```
sudo apt install python3
python3 --version
```

Ensure that the version is `>= 3.12`.

*Note*: Debian uses the last _stable_ release of Python (which is not 3.12), but
from testing, it seems to work just fine.

3. Install `Redis`:

Using the following link to install:

https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

*Note*: Ubuntu and Debian typically use `systemctl` as the init system, but if using
something different, the docs will not cover those.

4. Install `Node`:

```
sudo apt install nodejs
node -v
```

5. Install Docker/Docker Desktop:

Use the following link for the instuctions for Ubuntu:

https://docs.docker.com/desktop/setup/install/linux/ubuntu/

Use the following link for the instuctions for Debian:

https://docs.docker.com/desktop/setup/install/linux/debian/

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

4. Install Docker/Docker Desktop

The following link will walk you through it:

https://docs.docker.com/desktop/setup/install/mac-install/

### Windows

Running this project on bare metal Windows is no longer supported.
You will need to get WSL (Windows Subsystem for Linux) or preferably WSL2.

The following shows you how to set it up:

https://learn.microsoft.com/en-us/windows/wsl/install

Once this is install and set up, open Windows Terminal, Powershell, Command Prompt
(or whatever terminal emulator you use) and do:

```
wsl
```

If this is working correctly, follow the installation instructions in the *Linux*
section of this README to get all dependencies.

## Running Rubricapp in a Docker container

1. Perform a build:

```
docker compose build
```

This step is needed for whenever Docker files are modified.

_Note_: Docker will cache during build time. If you need to rebuild without the
cache, run:

```
docker compose build --no-cache
```

2. To run the container, do:

```
docker compose up
```

_Note_: if changes are required for the database, you can reset the database with:

```
docker compose down -v
```
If ```docker compose build --no-cache``` still creates the same db despite changing how the database gets created, try 
```sudo docker-compose down --rmi all --volumes``` (and then rebuild it all). The difference is that the first one 
recreates the images, but that does not mean the volumes (location of persistent data that docker manages for the images) 
are cleaned up. The second command frees up all the resources  including volumes (yes even the downloaded packages for 
the image are gone); that way the db is forced to run through whatever code you made instead of using something old. 
The second command takes a bit since it wipes everything then you have to run ```docker compose build``` to make it all again. 


When the front end is finished compiling, it should show a link, namely: `http://localhost:3000`.
Simply open this link in your browser and use an appropriate login.

# Not using Docker

You can also run rubricapp without Docker, but you will need to manually run the setup yourself.

1. Create a virtual environment

```
python3 -m venv <environment_name>
source <environment_name>/bin/activate
```

This is where all of the Python dependencies will be stored instead of being
stored globally on your system.

2. Start Redis

Enable the Redis service using your appropriate `init system` (`systemctl` in this example).

```
systemctl start redis
```

Make sure that it is running:

```
systemctl status redis
```

3. Launch the backend:

```
user@/(project root)$ cd BackendFlask
user@/(project root)/BackendFlask$ python3 ./setupEnv.py -irds
```

The setup flags are as follows:
* `-i, --install` - install all depencencies
* `-r, --reset` - reset the database
* `-d, --demo` - load demo data into the database
* `-s, --start` - start the backend server

Later iterations of using `setupEnv.py` only requires the `-s` flag
(unless new depencencies are added or if the database needs to be reset etc).

4. Launch the Frontend Server

```
user@/(project root)$ cd FrontendReact
user@/(project root)/FrontendReact$ npm install # only do this once
user@/(project root)/FrontendReact$ npm start
```

This will launch the server on port 3000. Access it by navigating to `http://localhost:3000` in your browser and logging in with appropriate credentials.

# Other

If you are testing with adding students/TAs/admins, it may be time consuming to
manually do it via the website. There is a script that will automatically insert new
users into the database straight from the command line. It is important to note
that this script only works if the backend _is currently running inside docker_.

Run this script with:

```
./dbinsert.sh
```

Run this and follow the on-screen instructions.

# Troubleshooting

## Redis issues

If it does not start correctly, there could be a multitude of reasons. I suggest
using `journalctl` to investigate it (systemctl will give out the full command).

But a good starting point is seeing if it is already running:

```
ps aux | grep redis
```

This will give the PIDs of all processess with `redis` in its name. Try killing them
with `kill <pid1> <pid2> ..., <pidN>` and then rerunning `systemctl start redis`.

_Note_: if `redis` is not considered a service, try using `redis-server` or `redis-server.service`.

## Port conflicts

The backend runs on port 5000 and the frontend runs on port 3000. You may already have processes running
on those ports. If this is the case, you will have conflicts and the server(s) will not run normally.

You can check what is running on those ports with:

```
lsof -i :5000
lsof -i :3000
```

If any output appears here, you may either want to kill them with `kill`, or run those processes on different ports.




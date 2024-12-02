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
brew instal redis
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

## Running Rubricapp



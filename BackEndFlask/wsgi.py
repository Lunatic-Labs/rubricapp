#the lines below are used to help set up the EC2 Instance
from core import app
import os

import threading
from Functions.threads import email_checker_thread

if __name__ == "__main__":
    core.config.rubricapp_running_locally = False

    app.run()

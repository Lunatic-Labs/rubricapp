#the lines below are used to help set up the EC2 Instance
from core import app
import os

if __name__ == "__main__":
    os.system("python3 ./setupEnv.py -irds")
    app.run()

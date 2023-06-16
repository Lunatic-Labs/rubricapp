import redis
import subprocess

def startRedis():
    subprocess.Popen(
        'redis-server',
        stdout=subprocess.DEVNULL, 
        stderr=subprocess.DEVNULL
    )

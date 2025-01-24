from gevent import monkey
monkey.patch_all() 
from core import app


if __name__ == '__main__':
    app.run(host="0.0.0.0")

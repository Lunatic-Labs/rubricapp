from gevent import monkey
monkey.patch_all() 
# Socket patching has not been added since it seems to add unwanted complexity.

from core import app


if __name__ == '__main__':
    app.run(host="0.0.0.0")

from gevent import monkey
monkey.patch_all()
# Socket patching has not been added since it seems to add unwanted complexity.

import core

if __name__ == '__main__':
    core.config.rubricapp_running_locally = True

    core.app.run(host="0.0.0.0")

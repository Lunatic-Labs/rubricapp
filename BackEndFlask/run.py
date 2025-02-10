from gevent import monkey
monkey.patch_all()
# Socket patching has not been added since it seems to add unwanted complexity.

import threading
from Functions.threads import email_checker_thread

import core


if __name__ == '__main__':
    core.config.rubricapp_running_locally = True

    email_thread = threading.Thread(target=email_checker_thread, daemon=True)
    email_thread.start()

    core.app.run(host="0.0.0.0")

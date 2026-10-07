#the lines below are used to help set up the EC2 Instance
from core import app
from werkzeug.middleware.proxy_fix import ProxyFix
import os

# Production (gunicorn on a unix socket behind nginx, see Cloud/syscontrol.sh)
# only. Without this, request.remote_addr is the socket, not the client, so
# every caller shares one Flask-Limiter bucket. nginx appends the real client
# address to X-Forwarded-For, so trust exactly that one hop. Not applied in
# run.py: with no proxy in front, a client could set the header itself.
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)

if __name__ == "__main__":
    core.config.rubricapp_running_locally = False

    app.run()

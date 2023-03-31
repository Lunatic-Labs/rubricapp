#!/bin/bash

sudo shutdown -r now

sudo apt update
Sudo apt upgrade

sudo apt install python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools

sudo apt install python3-venv

mkdir POGIL_PRODUCTION
cd POGIL_PRODUCTION

python3 -m venv pogilenv

source pogilenv/bin/activate

pip install wheel

pip install gunicorn flask

#sudo apt install git

#git clone https://github.com/Lunatic-Labs/rubricapp.git



sudo  /rubricapp/run.py

sed "s/debug=True/host='0.0.0.0'/" run.py
##from core import create_app, app
##app = Flask(__name__)


##if __name__ == "__main__":
    ##app.run(host='0.0.0.0')



sudo ufw allow 5000

pip install -r requirements.txt

python3 run.py

cd rubricapp
gunicorn --bind 0.0.0.0:5000 wsgi:app

deactivate

sudo  /etc/systemd/system/rubricapp.service

[Unit] > rubricapp.service
Description=Gunicorn instance to serve my rubricapp > rubricapp.service
After=network.target > rubricapp.service

[Service] > rubricapp.service
User=ubuntu > rubricapp.service
Group=www-data > rubricapp.service
WorkingDirectory=/home/ubuntu/POGIL_PRODUCTION/rubricapp > rubricapp.service
Environment= “PATH=/home/ubuntu/POGIL_PRODUCTION/pogilenv/bin/ > rubricapp.service

ExecStart=/home/ubuntu/POGIL_PRODUCTION/pogilenv/bin/gunicorn --workers 3 --bind unix:rubricapp.sock -m 007 wsgi:app > rubricapp.service


[Install] > rubricapp.service
WantedBy=multi-user.target > rubricapp.service


sudo systemctl start rubricapp
sudo systemctl enable rubricapp

sudo systemctl status rubricapp

sudo apt install nginx

sudo  /etc/nginx/sites-available/rubricapp

server { > /etc/nginx/sites-available/rubricapp
    listen 80; > /etc/nginx/sites-available/rubricapp
    #server_name 172.31.30.80 www. 172.31.30.80; > /etc/nginx/sites-available/rubricapp
    server_name 172.31.30.80;; > /etc/nginx/sites-available/rubricapp

    location / { > /etc/nginx/sites-available/rubricapp
        include proxy_params; > /etc/nginx/sites-available/rubricapp
        proxy_pass http://unix:/home/ubuntu/POGIL_PRODUCTION/rubricapp/rubricapp.sock; > /etc/nginx/sites-available/rubricapp
 } > /etc/nginx/sites-available/rubricapp
} > /etc/nginx/sites-available/rubricapp

sudo ln -s /etc/nginx/sites-available/rubricapp /etc/nginx/sites-enabled

sudo systemctl restart nginx

sudo ufw delete allow 5000
sudo ufw allow 'Nginx Full'

sudo nginx -s reload

sudo unlink /etc/nginx/sites-enabled/default

sudo chmod 755 /home/ubuntu


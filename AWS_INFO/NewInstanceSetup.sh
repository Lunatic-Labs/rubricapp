#!/bin/bash

# These command needs to be run before anything!!!
# sudo shutdown -r now
# mkdir /home/ubuntu/rubricapp/POGIL_DEV
# cd /home/ubuntu/rubricapp/POGIL_DEV
# sudo apt install git
# git clone https://github.com/Lunatic-Labs/rubricapp.git

sudo apt update
sudo apt upgrade
sudo apt install python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools
sudo apt install python3-venv
python3 -m venv pogilenv
source pogilenv/bin/activate
pip install wheel
pip install gunicorn flask
sudo ufw allow 5000
pip install -r /home/POGIL_DEV/rubricapp/requirements.txt
python3 run.py .
gunicorn --bind 0.0.0.0:5000 wsgi:app
deactivate
touch /etc/systemd/system/rubricapp.service
echo "[Unit]" >> /etc/systemd/system/rubricapp.service
echo "Description=Gunicorn instance to serve my rubricapp" >> /etc/systemd/system/rubricapp.service
echo "After=network.target" >> /etc/systemd/system/rubricapp.service
echo "[Service]" >> /etc/systemd/system/rubricapp.service
echo "User=ubuntu" >> /etc/systemd/system/rubricapp.service
echo "Group=www-data" >> /etc/systemd/system/rubricapp.service
echo "WorkingDirectory=/home/ubuntu/POGIL_PRODUCTION/rubricapp" >> /etc/systemd/system/rubricapp.service
echo "Environment= \"PATH=/home/ubuntu/POGIL_PRODUCTION/pogilenv/bin/\"" >> /etc/systemd/system/rubricapp.service
echo "ExecStart=/home/ubuntu/POGIL_PRODUCTION/pogilenv/bin/gunicorn --workers 3 --bind unix:rubricapp.sock -m 007 wsgi:app" >> /etc/systemd/system/rubricapp.service
echo "[Install]" >> /etc/systemd/system/rubricapp.service
echo "WantedBy=multi-user.target" >> /etc/systemd/system/rubricapp.service
sudo systemctl start rubricapp
sudo systemctl enable rubricapp
sudo systemctl status rubricapp
sudo apt install nginx
touch /etc/nginx/sites-available/rubricapp
echo "server {" >> /etc/nginx/sites-available/rubricapp
echo "  listen 80;" >> /etc/nginx/sites-available/rubricapp
echo "  server_name 172.31.30.80;" >> /etc/nginx/sites-available/rubricapp
echo "\n" >> /etc/nginx/sites-availabe/rubricapp
echo "  location / {" >> /etc/nginx/sites-available/rubricapp
echo "      include proxy_params;" >> /etc/nginx/sites-available/rubricapp
echo "      proxy_pass http://unix:/home/ubuntu/POGIL_PRODUCTION/rubricapp/rubricapp.sock;" >> /etc/nginx/sites-available/rubricapp
echo "  }" >> /etc/nginx/sites-available/rubricapp
echo "}" >> /etc/nginx/sites-available/rubricapp
sudo ln -s /etc/nginx/sites-available/rubricapp /etc/nginx/sites-enabled
sudo systemctl restart nginx
sudo ufw delete allow 5000
sudo ufw allow 'Nginx Full'
sudo nginx -s reload
sudo unlink /etc/nginx/sites-enabled/default
sudo chmod 755 /home/ubuntu
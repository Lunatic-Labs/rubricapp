#!/bin/bash

# These command needs to be run before anything!!!
# sudo shutdown -r now
# mkdir /home/ubuntu/rubricapp/POGIL_DEV
# cd /home/ubuntu/rubricapp/POGIL_DEV
# sudo apt install git
# git clone https://github.com/Lunatic-Labs/rubricapp.git

echo "[We are going to be updating Repos]"
sudo apt update
echo "[We are done updating Repos]"

echo "[We are going to be upgrading environment]"
sudo apt upgrade -y
echo "[We are done upgrading environment]"

echo "[We are going to installing required python3 packages to get the instance started]"
sudo apt install python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools

echo "[We are done installing the required python3 packages that will get the instance started]"

echo "[We are going to be editing the rubricapp.service and the file path is /etc/systemd/system/rubricapp]"
sudo chmod 744 /home/ubuntu/POGIL_DEV/rubricapp/NewInstanceSetup.sh
sudo chmod 644 /etc/systemd/system/rubricapp.service
sudo systemctl enable rubricapp.service
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
echo "[We are done editing the the rubricapp.service file]"

echo "[We are going to be starting and enabling rubricapp using systemctl]"
sudo systemctl start rubricapp
sudo systemctl enable rubricapp
sudo systemctl status rubricapp
echo "[We have now started and enalbed rubricapp using systemctl]"

echo "[We are going to be installing nginx now]"
sudo apt install nginx
echo "[We are done installing nginx]"

echo "[We are now going to be editing the rubricapp file which the file path is /etc/nginx/sites-available/rubricapp]"
sudo chmod 644 /etc/nginx/sites-available/rubricapp
sudo systemctrl enable /etc/nginx/sites-available/rubricapp
echo "server {" >> /etc/nginx/sites-available/rubricapp
echo "  listen 80;" >> /etc/nginx/sites-available/rubricapp
echo "  server_name 172.31.30.80;" >> /etc/nginx/sites-available/rubricapp
echo "\n" >> /etc/nginx/sites-availabe/rubricapp
echo "  location / {" >> /etc/nginx/sites-available/rubricapp
echo "      include proxy_params;" >> /etc/nginx/sites-available/rubricapp
echo "      proxy_pass http://unix:/home/ubuntu/POGIL_PRODUCTION/rubricapp/rubricapp.sock;" >> /etc/nginx/sites-available/rubricapp
echo "  }" >> /etc/nginx/sites-available/rubricapp
echo "}" >> /etc/nginx/sites-available/rubricapp
echo "[We are now done editing the rubricapp file from the file path /etc/nginx/sites-available/rubircapp]"

echo "[We are now enabling the nginx configuration of rubricapp]"
sudo ln -s /etc/nginx/sites-available/rubricapp /etc/nginx/sites-enabled
echo "[We have enabled the nginx config of rubricapp]"

echo "[We are going to restart nginx]"
sudo systemctl restart nginx
echo "[We have restarted nginx]"

echo "[We are changing the port access so that instead of port 5000, it is port 8000]"
sudo ufw delete allow 5000
sudo ufw allow 'Nginx Full'
echo "[We have successfully changed the port access]"

echo "[We are reloading nginx]"
sudo nginx -s reload
echo "[Nginx is fully reloaded]"

echo "[We are unlinking the default nginx site so that our site will be displayed]"
sudo unlink /etc/nginx/sites-enabled/default
echo "[The default nginx site is successfully unlinked]"

echo "[We are letting the root user of ubuntu have access]"
sudo chmod 755 /home/ubuntu
echo "[The root user of ubuntu has access now]"

#!/bin/bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y python3
sudo apt install -y python3-pip
sudo apt install -y python3-gdbm
sudo apt install -y ufw

sudo ufw allow 5000
sudo ufw allow 3000
sudo ufw allow 443
sudo ufw allow 80
sudo ufw allow 22

sudo apt install -y gunicorn
sudo apt install -y nginx

sudo apt install -y npm
sudo apt install -y git
cd ~/.
git clone https://github.com/Lunatic-Labs/rubricapp.git

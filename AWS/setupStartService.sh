setupStartService () {
printf '============ Configure startup service ============= \n'
# Create service that starts the app from the startup script
sudo bash -c 'cat > /etc/systemd/system/rubricapp.service <<EOF
[Unit]
Description=Gunicorn instance to serve my rubricapp
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=~/rubricapp
Environment= “PATH=~/rubricapp/BackEndFlask/.env

ExecStart=~/pogilenv/bin/gunicorn --workers 3 --bind unix:rubricapp.sock -m 007 wsgi:app


[Install]
WantedBy=multi-user.target
'
sudo chmod 744 ~/rubricapp/BackEndFlask/BackendBash.sh
sudo chmod 664 /etc/systemd/system/recipe.service
sudo systemctl daemon-reload
sudo systemctl enable rubricapp.service
sudo systemctl start rubricapp.service
}

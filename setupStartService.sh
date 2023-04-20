setupStartService () {
printf '============ Configure startup service ============= \n'
# Create service that starts the app from the startup script
sudo bash -c 'cat > /etc/systemd/system/recipe.service <<EOF
[Unit]
Description=Gunicorn instance to serve my rubricapp
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/POGIL_PRODUCTION/rubricapp
Environment= “PATH=/home/ubuntu/POGIL_PRODUCTION/pogilenv/bin/

ExecStart=/home/ubuntu/POGIL_PRODUCTION/pogilenv/bin/gunicorn --workers 3 --bind unix:rubricapp.sock -m 007 wsgi:app


[Install]
WantedBy=multi-user.target
'
sudo chmod 744 /home/ubuntu/RecipeAPI/startenv.sh
sudo chmod 664 /etc/systemd/system/recipe.service
sudo systemctl daemon-reload
sudo systemctl enable recipe.service
sudo systemctl start recipe.service
}

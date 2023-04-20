setupStartService () {
printf '============ Configure startup service ============= \n'
# Create service that starts the app from the startup script
sudo bash -c 'cat > /etc/systemd/system/recipe.service <<EOF
[Unit]
Description=recipe startup service
After=network.target
[Service]
User=ubuntu
ExecStart=/bin/bash /home/ubuntu/RecipeAPI/startenv.sh
Restart=always
[Install]
WantedBy=multi-user.target
'
sudo chmod 744 /home/ubuntu/RecipeAPI/startenv.sh
sudo chmod 664 /etc/systemd/system/recipe.service
sudo systemctl daemon-reload
sudo systemctl enable recipe.service
sudo systemctl start recipe.service
}

configureBackendNginx () {
printf '==================== Configure nginx =================== \n'
# Create the nginx configuration
sudo bash -c 'cat > /etc/nginx/sites-available/rubricapp <<EOF
server {
    listen 80;
    server_name 172.31.30.80 www. 172.31.30.80;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/POGIL_PRODUCTION/rubricapp/rubricapp.sock;
 }
}
'

sudo rm -rf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/rubricapp /etc/nginx/sites-enabled/
sudo systemctl restart nginx
}

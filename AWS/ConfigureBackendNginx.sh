configureBackendNginx () {
printf '==================== Configure apache =================== \n'
# Create the apache configuration
sudo bash -c 'cat > /etc/apache/sites-available/rubricapp <<EOF
server {
    listen 80;
    server_name www.skillbuilder.com;

    location / {
        include proxy_params;
        proxy_pass http://unix:~/rubricapp/BackEndFlask/rubricapp.sock;
 }
}
'

sudo rm -rf /etc/apache/sites-available/default /etc/apache/sites-enabled/default
sudo ln -s /etc/apache/sites-available/rubricapp /etc/apache/sites-enabled/
sudo systemctl restart apache
}

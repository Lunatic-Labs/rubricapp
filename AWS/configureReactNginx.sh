configureReactNginx () {
printf '==================== Configure apache =================== \n'
sudo bash -c 'cat > /etc/apache/sites-available/default <<EOF
server {
    listen 80;
    server_name skillbuilder.elipss.com www.skillbuilder.elipss.com;
location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
     }
}
'
sudo ln -s /etc/apache/sites-available/default /etc/apache/sites-enabled/
sudo systemctl restart apache
}

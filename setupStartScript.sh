setupStartScript () {
printf '=============== Create a startup script =============== \n'
# create a .env file for the environment variables
 sudo bash -c 'cat > /home/ubuntu/rubricapp/\.env <<EOF
export SECRET_KEY='wqrtaeysurid6lr7'
export FLASK_CONFIG=development
'
#export DATABASE_URL='postgresql://thegaijin:12345678@cp3-db-instance.cjfdylbgjjyu.us-west-2.rds.amazonaws.com:5432/recipe_db'
# create a startup script to start the virtual environment, load the environment variables and start the app
sudo bash -c 'cat > /home/ubuntu/rubricapp/BackendBash.sh <<EOF
#!/bin/bash
cd /home/ubuntu
ls
source pogilenv/bin/activate
cd rubricapp
source .pogilenv
gunicorn manage:app
'
}

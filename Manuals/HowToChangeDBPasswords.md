# Updating Passwords for prod

## WARNING DO NOT GIT PULL OR UPDATE THE SERVER CODE YET UNTILL THESES STEPS ARE DONE

## Prerequisit
- Application should be running or at the bare minimum the db should be accessible.

## Steps
### 1. Enter MySQL but do not select a database.

### 2. If you know the users and their corresponding hosts, move to step 3. Otherwise, run the following:
```sql
SELECT User, Host FROM mysql.user;
```
```md
### Exmple output:
+------------------+-----------+
| User             | Host      |
+------------------+-----------+
| root             | %         |
| skillbuilder     | %         |
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+
```

### 3. Traget the desired user and host and alter their password:
```sql
ALTER user 'skillbuilder'@'%' Identified by "NEW_PASSWORD";
-- Or you can target the root login from localhost by doing the follwing
ALTER user 'root'@'localhost' Identified by "NEW_PASSWORD";
```
```md
### Example output:
Query OK, 0 rows affected (0.01 sec)
```

### 4. Flush the changes out:
```sql
flush privileges;
```
```md
### Example output:
Query OK, 0 rows affected (0.00 sec)
```

### 5. Do a git pull or update the code.
- This may remove all the env files and BackEndFlask/env. That is expected since the files are no longer tracked.

### 6. Change/create the backend env with the updated passwords.
```md
### Example env:
FRONT_END_URL=http://127.0.0.1:3000
SUPER_ADMIN_PASSWORD=@super_admin_password123
DEMO_ADMIN_PASSWORD=demo_admin
DEMO_TA_INSTRUCTOR_PASSWORD=demo_ta
DEMO_STUDENT_PASSWORD=demo_student
SECRET_KEY=[YOUR_SECRET]
MYSQL_HOST=localhost:3306
MYSQL_USER=skillbuilder
MYSQL_PASSWORD=[NEW_PASSWORD]
MYSQL_DATABASE=rubricapp
```
### 7. Create/Change the following directory and files in the BackEndFlask directory.
```bash
#------------------------------------------------------------
# Skip this block if the files and directories already exist.
mdkir env
touch env/.env.development
touch env/.env.production
touch env/.flaskenv
#------------------------------------------------------------
cd env/
```

### 8. Populate the files as shown below:
```bash
# Put this in file .env.development
DONT_LOOK = {YOUR_NEW_SECRET}
#-----------------------------------------------
# Put this in file .env.production

MYSQL_HOST = 'rubricapp-db.c1db7ief4oer.us-east-2.rds.amazonaws.com:3306'
MYSQL_PASSWORD = {YOUR_NEW_LOGIN_PASSWORD}
MYSQL_USER = 'rubricapp_admin'
MYSQL_DATABASE = 'rubricapp'
WIN_LIN = 'mysql+pymysql://rubricapp_admin:{MYSQL_PASSWORD}@rubricapp-db.c1db7ief4oer.us-east-2.rds.amazonaws.com:3306/rubricapp'
MAC = 'mysql+pymysql://rubricapp_admin:{MYSQL_PASSWORD}@rubricapp-db.c1db7ief4oer.us-east-2.rds.amazonaws.com:3306/rubricapp'

#-----------------------------------------------
# Put this in file .flaskenv
# Key gets overriden
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = 'NOTHING_HERE'
JSON_SORT_KEYS = False
```

### 9. Restart the application.

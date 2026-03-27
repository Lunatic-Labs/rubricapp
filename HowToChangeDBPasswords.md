# Updating Passwords for prod

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

### 5. Change the backend env with the updated passwords.
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
### 6. Restart the application.

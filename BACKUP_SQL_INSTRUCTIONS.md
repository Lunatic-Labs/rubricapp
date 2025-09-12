Run the following command in the terminal after connecting to the server. 

```bash
mysqldump --no-create-db --no-create-info --no-tablespaces --complete-insert --verbose --compatible=rds --ignore-table=rubricapp.Feedback rubricapp -u [USERNAME] -p > "backup_$(date +"%F_%T").sql"
```
This should create a file named *backup_[DATE_OF_CREATION].sql* in the same directory.
That file will contain only the inserts to restore each tables data.

Now delete all data in the tables including the tables like the following in mysql:
```sql
DROP DATABASE rubricapp;
CREATE DATABASE rubricapp;
```

Now run(or stop it then rerun) the application. Once it is working stop it as if starting fresh. Running setupEnv.py -d should be sufficent. Once the demo data has been reinserted, go into the database and execute the following (copy and paste it in):
```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE AssessmentTask;
TRUNCATE TABLE Category;
TRUNCATE TABLE Checkin;
TRUNCATE TABLE CompletedAssessment;
TRUNCATE TABLE Course;
TRUNCATE TABLE EmailValidation;
TRUNCATE TABLE Feedback;
TRUNCATE TABLE ObservableCharacteristic;
TRUNCATE TABLE Role;
TRUNCATE TABLE Rubric;
TRUNCATE TABLE RubricCategories;
TRUNCATE TABLE SuggestionsForImprovement;
TRUNCATE TABLE Team;
TRUNCATE TABLE TeamUser;
TRUNCATE TABLE User;
TRUNCATE TABLE UserCourse;
-- If the table alembic_version exists, then run the next line.
TRUNCATE TABLE alembic_version;
-- At once everything is done, run this next one.
SET FOREIGN_KEY_CHECKS = 1;

```
That code was run to clear all data in the tables out so there is no conflict with the backup data.
Next run the following command and use the generated sql file from before:

```bash
mysql rubricapp -u [USERNAME] -p < [NAME_OF_SQL_FILE] 
```

Then to make sure everything is on the same page run:

```bash
flask db stamp head
```


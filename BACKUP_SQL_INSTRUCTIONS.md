Run the following command in the terminal after connecting to the server. 

```bash
mysqldump --no-create-db --no-create-info --no-tablespaces --verbose [DATABASE_NAME] -u [USERNAME] -p > "backup_$(date +"%F_%T").sql"
```

This should create a file named backup_[DATE_OF_CREATION].sql in the same directory.
That file will contain only the inserts to restore each tables data.
Next run the following command and use the generated sql file from before:

```bash
mysql [DATABASE] -u [USERNAME] -p < [NAME_OF_SQL_FILE] 
```

Then to make sure everything is on the same page run:

```bash
flask db stamp head
```


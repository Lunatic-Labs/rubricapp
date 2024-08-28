import random, sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Date, event, text, insert
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError, OperationalError
import threading

#-----------------------------------------------------------------------------#
# Checks the integrity of the database                                        #
# Note if verbose information is wanted                                       #
# Important functions to see:                                                 #
#   - map_testing() checks foreign key constraints as well as triggers         #
#   - data_integrity_testing() checks that data properly lands in the database  #
#   - acid_testing() checks to see if database satisfies acid                  #
#-----------------------------------------------------------------------------#

# Manages the creation of threads and their tasks
class myThread(threading.Thread):
    def __init__(self, thread_id, name, counter, db):
        threading.Thread.__init__(self)
        self.thread_id = thread_id
        self.name = name
        self.counter = counter
        self.db = db

    def run(self):
        print(str(self.name) + " is starting...")
        conn = self.db.engine.connect()
        conn.begin()
        if(self.thread_id == 1):
            conn.execute(text('INSERT INTO FORTESTINGPURPOSES (foo) values(1)'))
            thread2 = myThread(2, 'Thread-1', 2, self.db)
            thread2.start()
            thread2.join()
            conn.commit()
        else:
            result = conn.execute(text('Select * from FORTESTINGPURPOSES'))
            for x in result:
                print("Acid failure thread was able to see uncommited work.")        

# Values should not be modified after creation
class DataBase:
    def __init__(self, engine, num_of_tables):
        self.engine = engine
        self.tables = self.get_tables()
        self.num_of_tables = num_of_tables

    # Implimented to stop setting values after initalization
    def __setattr__(self, attr, value):
        if hasattr(self, attr):
            raise Exception(f"Attempting to set a read-only value: {attr}")
        self.__dict__[attr] = value

    def get_tables(self):
        tables = []
        metadata = MetaData()
        metadata.reflect(bind=self.engine)
        for table in (metadata.sorted_tables):
            tables.append(table)
        return tables
    
    # Sends an object to the database
    def command(self, query, commit=True, rollback=False):
        conn = self.engine.connect()
        issue = 1
        try:
            if isinstance(query, str):
                conn.execute(text(query))
        except IntegrityError:
            # Note a roll back must occur or the connection will be blocked, see:
            # https://docs.sqlalchemy.org/en/20/core/connections.html for when to use commit, rollback, and none
            conn.rollback()
            issue = 0
        except OperationalError:
            print("Database refused the query.")
            issue = 0              
        except Exception as ex:
            template = f"An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            print(message)
            issue = 0

        # Ensure that the connection is closed
        if commit:
            conn.commit()
        if rollback:
            conn.rollback()
        conn.close()
        return issue

# Creates a dummy table that it can delete   
def dummy_table(db, delete=False):
    if (delete):
        print("Deleting dummy table...")
        try:
           db.command("DROP TABLE FORTESTINGPURPOSES;") 
        except:
            print("Error deleting exiting-------")
            exit()
        return None
    meta = MetaData()
    FORTESTINGPURPOSES = Table(
        'FORTESTINGPURPOSES', meta,
        Column('foo', Integer, primary_key=True)
    )
    print("Creating dummy table...")
    try:
        meta.create_all(db.engine)
    except:
        print("Failure creating dummy exiting---------------")
        exit()
    return FORTESTINGPURPOSES

# Tests the ability to create and remove a table by:
#   creating a sample table called FORTESTINGPURPOSES
def isolated_table(db):
    FORTESTINGPURPOSES = dummy_table(db)
    tables = db.getTables()
    if('FORTESTINGPURPOSES' not in str(tables)):
        print("Creating dummy table failure. Re-enabling foreign keys and Exiting")
        db.command("PRAGMA foreign_keys=ON")
        return 0
    
    print("Inserting data into dummy table...")
    test_cases = [random.randint(1, 100000)]
    db.command(f'INSERT INTO FORTESTINGPURPOSES (foo) values ({test_cases[0]})')
    random.seed(test_cases[0])
    for x in range(99):
        test_cases.append(random.randint(1, 1000000))
        db.command(f'INSERT INTO FORTESTINGPURPOSES (foo) values ({test_cases[x+1]})')
    
    print("Verifying inserted data...")
    data = FORTESTINGPURPOSES.select()
    conn = db.engine.connect()
    result = conn.execute(data)
    issue = 1
    for row in result:
        if(row[0] not in test_cases):
            issue = 0
            print("Not all data inserted found")

    dummy_table(db, True)
    tables = db.getTables()
    if('FORTESTINGPURPOSES' in str(tables)):
        db.command("PRAGMA foreign_keys=ON")
        return 0
    conn.close()
    return issue

#-----------------------------------------------------------#
# Creates pseudorandom data and checks to see if it landed  #
# on the database. Temporarily disables foreign key         #
# constraints.                                              #
#-----------------------------------------------------------#
def cru_checks(db):
    print("Disabling foreign key constraints...")
    db.command('PRAGMA foreign_keys=OFF')
    random.seed(1024)
    num_of_tests = 2
    random_data = []

    print("Testing creation of an isolated table...")
    if(not isolated_table(db)):
        print("Failed isolated table test")
        print("--------------Exiting Testing--------------------------")
        db.command('PRAGMA foreign_keys=ON')
        exit()

    print("Creating random data and inserting to database...")
    for create_random_data in range(num_of_tests):
        temp = random.randint(5000, 300000)
        random_data.append(str(temp))
        db.command(f'INSERT INTO Role(role_name) VALUES({temp})')
    
    print("Reading from the database...")
    count = 0
    conn = db.engine.connect()
    result = conn.execute(text('SELECT * FROM role'))
    for row in result:
        if(row[1] in random_data):
            count +=1
    conn.close()
    if(count != num_of_tests):
        print("Not all data inserted found.")
        conn.close()
        db.command('PRAGMA foreign_keys=ON')
        print("Exiting tests----------")
        exit()

    print("Create and Read tests passed.")
    print("Deleting inserted data...")

    count = 0
    conn = db.engine.connect()
    for x in range(num_of_tests):
        conn.execute(text(f'Delete FROM Role where role_name = {random_data[x]}'))
    result = conn.execute(text('SELECT * FROM role'))
    for row in result:
        if(row[1] in random_data):
            count +=1
    conn.commit()
    conn.close()
    if(count != 0):
        print("Not all data deleted.")
        conn.close()
        db.command('PRAGMA foreign_keys=ON')
        print("Exiting tests--------------")
        exit()

    print("CRU tests done.")
    print("Re-enabling constraints")
    db.command('PRAGMA foreign_keys=ON')
    return 1

#---------------------------------------------------------#
# Checks every tables' constraints. Temporarily disables  #
# foreign key constraints.                                #
#---------------------------------------------------------#
def constraint_checks(db):
    print("Disabling foreign key constraints...")
    db.command('PRAGMA foreign_keys=OFF')
    amount = 1
    testing = lambda command, undo: (db.command(command), db.command(undo))

    tests = [
        "INSERT INTO Role(role_id) values('A')"
        #Outline:"INSERT INTO Users(user_id, fname, lname, email, password, role, lms_id, consent, owner_id) values('','','','','','','','','')" 
    ]

    undos = [
        "INSERT INTO Role(role_id) values(A)"
    ]

    for x in range(amount):
       check, temp = testing(tests[x], undos[x])
       if (check):
            print(f"Constraint failure: {tests[x]} rose no errors")
            print("Enabling foreign key constraints...")
            db.command('PRAGMA foreign_keys=ON')
            print("Exiting testing------------")

    print("Enabling foreign key constraints...")
    db.command('PRAGMA foreign_keys=ON')
    return 1

def data_integrity_testing(db):
    if (db.num_of_tables != len(db.tables)):
        exit("Incorrect number of tables detected: Exiting tests")
    if(not cru_checks(db) or not constraint_checks(db)): 
        exit("--------Testing interrupted---------")
    print("Ensuring foreign keys are on...")
    db.command("PRAGMA foreign_keys=ON")
    print("Data integrity tests passed")
    return

def mapping_testing(db):
    print("Ensuring foreign keys are on ...")
    db.command("PRAGMA foreign_keys=ON")

    print("Inserting foreign key violating data...")
    if(db.command("INSERT INTO UserCourse(user_id, course_id) VALUES('-123', '-90')")):
        print("Failure in foreign key constraints.")
        print("Exiting testing--------")
        exit()

    print("Mapping tests passed")
    return

# Works by checking if uncommited reads are possible
def acid_testing(db):
    # SQLite does not have row locking so instead I need to do a transaction to see if 
    # lockdowns happen on the whole database. 
    print("Ensuring foreign keys are on...")
    db.command("PRAGMA foreign_keys=ON")
    dummy_table(db)

    # Two threads started so main can observe and protect itself from failure
    try:
        thread1 = myThread(1, 'Thread-1', 1, db)
    except:
        print("Failure to create threads.")
        print("-------------Exiting tests--------------")
        exit()

    # Off to the races
    thread1.start()
    thread1.join()

    print("Threads have finished and joined back.")
    dummy_table(db, True)
    print("ACID tests passed")
    return

def setup(num_of_tables, verbose):
    db = DataBase(sqlalchemy.create_engine('sqlite:///instance/account.db', echo=verbose), num_of_tables)
    sessionmaker(bind=db.engine)
    Base = declarative_base()
    Base.metadata.create_all(db.engine)
    MetaData()
    return db    

# When swapping off of mysql, for databases like postgres, the WAL will need testing.
# Verbose will post all the actions that are being done along with what the database is doing.
def testing():
    num_of_tables = input("Number of expected tables: ")
    while(not num_of_tables.strip().isnumeric()):
        num_of_tables = input("Please enter a valid number: ")
    num_of_tables = int(num_of_tables)
    debugging = input("Verbose(y/n): ")
    verbose  = True if debugging == 'y' else False
    db = setup(num_of_tables, verbose)
    print("-----------------------------------------")
    data_integrity_testing(db)
    print("-----------------------------------------")
    mapping_testing(db)
    print("-----------------------------------------")
    acid_testing(db)
    print("--------END OF Tests-------")
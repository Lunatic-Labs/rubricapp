import random, sqlite3, sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Date, event,text, insert
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError, OperationalError
from typing import Any, final
from multiprocessing import Pool
#--------------------------------------------------------------------
#Checks the integrity of the database
#Note if verbose information is wanted
#Important functions to see:
#
# mapTesting() checks foreign key constraints as well as triggers
# dataIntegrityTesting() checks that data properly lands in the database
# acidTesting() checks to see if database satisfies acid
#--------------------------------------------------------------------

#values should not be modified after creation
#the memeber function that keeps a simple dabase schema should be updated
class DataBase:
    def __init__(self, engine, numOfTables):
        self.engine = engine
        self.numOfTables = numOfTables
        self.tables = self.getTables()
        self.basicSchema = self.__schema()

    def __setattr__(self, attr, value):
        if hasattr(self, attr):
            raise Exception("Attempting to set a read-only value: %s"%(attr))
        self.__dict__[attr]=value

    def getTables(self):
        tables = ['Remove']
        metadata = MetaData()
        metadata.reflect(bind=self.engine)
        for table in (metadata.sorted_tables):
            tables.append(table)
        tables.remove('Remove')
        return tables
    
    #sends an object to the database
    def command(self, query, commit=True, rollback=False):
        conn = self.engine.connect()
        issue = 1
        try:
            if(isinstance(query, str)):
                conn.execute(text(query))
            else:
                conn.execute(query)
        except IntegrityError:
            #Note a roll back must occur or the connection will be blocked see
            #https://docs.sqlalchemy.org/en/20/core/connections.html for when to use commit, rollback, and none
            conn.rollback()
            issue = 0
        except OperationalError:
            print("database refused the querey")
            issue = 0
        except Exception as ex:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            print(message)
            issue = 0
        #ensure that the connection is closed to prevent data corruption
        #note that without commit the Transaction is is rolledback starting from a begin(or implicit begin)
        if commit:
            conn.commit()
        if rollback:
            conn.rollback()
        conn.close()
        return issue

    #sparce controlled checking throughout the database
    #can be modified to work like isolatedTable() but there would be issues to resolve
    def __schema(self):
        meta = MetaData()
        role = Table(
            'Role' , meta , 
            Column('role_id', Integer, primary_key=True),
        )
        oc = Table(
            'ObservableCharacteristics', meta,
            Column('oc_id', Integer, primary_key=True),
            Column('rubric_id', Integer, nullable=False),
            Column('category_id', Integer, nullable=False),
            Column('oc_text', String(10000), nullable=False),
        )
        course = Table(
            'Table', meta,
            Column('course_id', Integer, primary_key=True),  
            Column('course_number', Integer, primary_key=True),  
            Column('course_name', String(10), nullable=False),  
            Column('year', Date, nullable=False),  
            Column('term', String(50), nullable=False),  
            Column('active', Boolean, nullable=False),  
            Column('admin_id', Integer, nullable=False),  
        )
        struct = [role, oc, course] 
        return struct

#creates a duummy table and can delete it   
def dummyTable(db, delete=False):
    if (delete):
        print("Deleting dummy table...")
        try:
           db.command("DROP TABLE FORTESTINGPURPOSES;") 
        except:
            print("Error deleteing exiting-------")
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

#tests the ability to create and remove a table 
#by creating a sample table called FORTESTINGPURPOSES
def isolatedTable(db):
    FORTESTINGPURPOSES = dummyTable(db)
    tables = db.getTables()
    if('FORTESTINGPURPOSES' not in str(tables)):
        print("Creating dummy table faluire. Re-enabling forigen keys and Exiting")
        db.command("PRAGMA foreign_keys=ON")
        return 0
    
    print("Inserting data into dummy table...")
    testCases = [random.randint(1, 100000)]
    db.command('INSERT INTO FORTESTINGPURPOSES (foo) values (%s)' %testCases[0])
    random.seed(testCases[0])
    for x in range(99):
        testCases.append(random.randint(1, 1000000))
        db.command('INSERT INTO FORTESTINGPURPOSES (foo) values (%s)' %testCases[x+1])
    
    print("Verifying inserted data...")
    data = FORTESTINGPURPOSES.select()
    conn = db.engine.connect()
    result = conn.execute(data)
    issue = 1
    for row in result.fetchall():
        if(row[0] not in testCases):
            issue = 0
            print("Not all data inserted found")

    dummyTable(db, True)
    tables = db.getTables()
    if('FORTESTINGPURPOSES' in str(tables)):
        db.command("PRAGMA foreign_keys=ON")
        return 0
    return issue

#-------------------------------------------------------
#Creates psudorandom data and checks to see if it landed
#on the database. Temporaryly disables forigen key 
#constraints. Little
#-------------------------------------------------------
def cruChecks(db):
    print("Disabling forigen key constraints...")
    db.command('PRAGMA foreign_keys=OFF')
    random.seed(1024)
    numOfTests = 10
    randomData = [random.randint(1, 300000)]

    print("Testing creation of isolated table...")
    if(not isolatedTable(db)):
        print("Failed isolated table test")
        print("--------------Exiting Testing--------------------------")
        db.command('PRAGMA foreign_keys=ON')
        exit()

    print("Creating random data and inserting to database...")

    for table in range(db.numOfTables):
        for createRandomData in range(numOfTests-1):
            temp = random.randint(1, 300000)
            randomData.append(temp)
            #add
    
    print("Reading from the database...")
    for read in range(numOfTests):
        temp = read
        #if(data returned not in randomdata) rais Exception("Create and/or Read integrity faliure")   
    print("Create and Read tests passed.")

    print("Updating values in the database...")
    for u in range(numOfTests):
        temp = u
        #updata database with another random values
        #update list
    print("Reading back updates along with all other data...")
    for finalChecks in range(numOfTests):
        temp = FileNotFoundError
        #if data recived not in randomdata then raise Exception("Update failure")

    #should be expanded to include delete checks

    print("CRU tests done.")
    print("Re-enabling constraints")
    db.command('PRAGMA foreign_keys=ON')
    return 1

#-------------------------------------------------------
#Checks every tables' constraints. Temporaryaly disables
#foeign key constraints.
#-------------------------------------------------------
def constraintChecks(db):
    print("Disabling forigen key constraints...")
    db.command('PRAGMA foreign_keys=OFF')
    amount = 1
    testing = lambda command, undo: (db.command(command), db.command(undo))

    tests = [
        "INSERT INTO Role(role_id) values('A')",
        "INSERT INTO Users(user_id, fname, lname, email, password, role, lms_id, consent, owner_id) values('','','','','','','','','')" 

    ]
    undos = [
        "INSERT INTO Role(role_id) values(A)",
    ]


    for x in range(amount):
       check, temp = testing(tests[x], undos[x])
       if (check):
            print("Constraint failure: %s rose no errors" %tests[x])
            print("Enabling forigen key constraints...")
            db.command('PRAGMA foreign_keys=ON')
            print("Exiting testing------------")
       

    print("Enabling forigen key constraints...")
    db.command('PRAGMA foreign_keys=ON')
    return 1

def dataIntegrityTesting(db):
    if (db.numOfTables != len(db.tables)):
        exit("Incorrect number of tables detected: Exiting tests")
    if(not cruChecks(db) or not constraintChecks(db)): 
        exit("--------Testing interupted---------")
    print("Ensuring foreign keys are on...")
    db.command("PRAGMA foreign_keys=ON")
    print("Data integrity tests passed")
    return

def mappingTesting(db):
    print("Ensuring foreign keys are on ...")
    db.command("PRAGMA foreign_keys=ON")

    print("Inserting forigen key violating data...")
    if(db.command("INSERT INTO UserCourse(user_id, course_id) VALUES('-123', '-90')")):
        print("Faiure in foreign key constraints.")
        print("Exiting testing--------")
        exit()

    print("Mapping tests passed")
    return

#works by locking writes to ensure that acid is mantained
def acidTesting(db):
    #sqltie does not have row locking so instead i need to do a transaction to see if 
    #lockdowns happend on the whole of the database. 
    print("Ensuring foreign keys are on...")
    db.command("PRAGMA foreign_keys=ON")
    FORTESTINGPURPOSES = dummyTable(db)

    conn = db.engine.connect()
    conn.begin()
    conn.rollback()

    dummyTable(db, True)
    print("ACID tests passed")
    return

def play(db):
    engine = sqlalchemy.create_engine('sqlite:///instance/account.db')
    conn = engine.connect()
    conn.execute()
    meta = MetaData()
   #meta = MetaData()
    #u = Users.select()
    #conn = engine.connect()
    #result = conn.execute(u)
    #for row in result:
    #    print(row)
    #return _SessionFactory()

def setup(numOfTables, verbose):
    db = DataBase(sqlalchemy.create_engine('sqlite:///instance/account.db', echo=verbose), numOfTables)
    _SessionFactory = sessionmaker(bind=db.engine)
    Base = declarative_base()
    Base.metadata.create_all(db.engine)
    meta = MetaData()
    return db

#when swapping off of mysql, for databases like postgres, the WAL will need testing
#verbose will post all the acctions that are being done along with what the database is doing
def main():
    numOfTables = input("Number of expected tables: ")
    while (not numOfTables.strip().isnumeric()):
          numOfTables = input("Please enter a valid number: ")
    numOfTables = int(numOfTables)
    verbose = False
    moreOutPut = input("Verbose(y/n): ")
    if (moreOutPut == 'y'):
        verbose = True
    db = setup(numOfTables, verbose)
    print("-----------------------------------------")
    dataIntegrityTesting(db)
    print("-----------------------------------------")
    mappingTesting(db)
    print("-----------------------------------------")
    acidTesting(db)
    print("--------END OF Tests-------")
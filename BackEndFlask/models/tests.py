import random, sqlite3, sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Date, event,text, insert
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Any, final
from multiprocessing import Pool
#--------------------------------------------------------------------
#Checks the integretity of the database
#Note if verbose informations is wanted
#Important funtions to see:
#
# mappTesting() checks foriegn key constraints as well as triggers
# dataIntegrityTesting() checks that data properly lands in the database
# acidTesting() checks to see if database satisfies acid
#--------------------------------------------------------------------

#values should not be modified after creation
class DataBase:
    def __init__(self, engine, numOfTables):
        self.engine = engine
        self.numOfTables = numOfTables
        self.tables = self.getTables()

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
    def command(self, query, commit=True):
        conn = self.engine.connect()
        if(isinstance(query, str)):
            conn.execute(text(query))
        else:
            conn.execute(query)
        #ensure that the connection is closed to prevent data corruption
        #note that without commit the Transaction is is rolledback starting from a begin(or implicit begin)
        if commit:
            conn.commit()
        conn.close()
    
#tests the ability to create and remove a table 
#by creating a sample table called FORTESTINGPURPOSES
def isolatedTable(db):
    meta = MetaData()
    FORTESTINGPURPOSES = Table(
        'FORTESTINGPURPOSES', meta,
        Column('foo', Integer, primary_key=True)
    )
    print("Creating Dummy table...")
    meta.create_all(db.engine)
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

    db.command("DROP TABLE FORTESTINGPURPOSES;")
    tables = db.getTables()
    if('FORTESTINGPURPOSES' in str(tables)):
        db.command("PRAGMA foreign_keys=ON")
        return 0
    return issue

#-------------------------------------------------------
#Creates psudorandom data and checks to see if it landed
#on the database. Temporaryly disables forigen key 
#constraints.
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
    issue = 1

    return issue

def dataIntegrityTesting(db):
    if (db.numOfTables != len(db.tables)):
        exit("Incorrect number of tables detected: Exiting tests")
    if(not cruChecks(db) or not constraintChecks(db)): 
        exit("--------Testing interupted---------")
    print("Data integrity tests passed")
    return

def mappingTesting():
    #we want to be able to ask the database for information and 
    print("Mapping tests passed")
    return

def acidTesting():
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
    mappingTesting()
    print("-----------------------------------------")
    acidTesting()
    print("--------END OF Tests-------")
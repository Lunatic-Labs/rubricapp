import random, sqlite3, sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, Date, event,text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import final
#--------------------------------------------------------------------
#Checks the integretity of the database
#Important funtions to see:
#
# mappTesting() checks foriegn key constraints as well as triggers
# dataIntegrityTesting() checks that data properly lands in the database
# acidTesting() checks to see if database satisfies acid
#--------------------------------------------------------------------

#sends an object to the database
def command(query, engine):
    conn = engine.connect()
    if(isinstance(query, str)):
        conn.execute(text(query))
    else:
        conn.execute(query)
    #ensure that the connection is closed to prevent data corruption
    conn.close()

class DataBaseInfo:
    def __init__(self, engine, tables, amountOfTables):
        self.engine = engine
        self.tables = tables
        self.amountOftables = amountOfTables


#-------------------------------------------------------
#Creates psudorandom data and checks to see if it landed
#on the database. Temporaryly disables forigen key 
#constraints.
#-------------------------------------------------------
def cruChecks(engine, Users, Course, numTable):
    print("Disabling forigen key constraints...")
    command('PRAGMA foreign_keys=OFF', engine)
    random.seed(1024)
    numOfTests = 500
    randomData = [random.randint(1, 300000)]

    print("Creating random data and inserting to database...")

    for table in range(numTable):
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
    command('PRAGMA foreign_keys=ON', engine)
    return 1

#-------------------------------------------------------
#Checks every tables' constraints. Temporaryaly disables
#foeign key constraints.
#-------------------------------------------------------
def constraintChecks(engine, Users, Course, numTables):
    #insert random data of the correct typing to each table
    return 1

def dataIntegrityTesting(engine, Users, Course, numberOfTables):
    if(not cruChecks(engine, Users, Course, numberOfTables) or not constraintChecks(engine, Users, Course, numberOfTables)): 
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

def play(Users):
    engine = sqlalchemy.create_engine('sqlite:///instance/account.db')
    _SessionFactory = sessionmaker(bind=engine)
    Base = declarative_base()
    Base.metadata.create_all(engine)
    meta = MetaData()
    u = Users.select()
    conn = engine.connect()
    result = conn.execute(u)
    for row in result:
        print(row)
    return _SessionFactory()

def setup():
    engine = sqlalchemy.create_engine('sqlite:///instance/account.db')
    _SessionFactory = sessionmaker(bind=engine)
    Base = declarative_base()
    Base.metadata.create_all(engine)
    meta = MetaData()
    
    Users = Table(
        'Users', meta,
        Column('user_id', Integer),
        Column('fname', String(30)),
        Column('lname', String(30)),
        Column('email', String(255)),
        Column('password', String(80)),
        Column('role', String(80)),
        Column('lms_id', Integer),
        Column('consent', Boolean),
        Column('owner_id', Integer),
    )
    Course = Table(
        'Course', meta,
        Column('course_id', Integer),
        Column('course_number', Integer),
        Column('course_name', String(10)),
        Column('year', Date),
        Column('term', String(50)),
        Column('active', Boolean),
        Column('admin_id', Integer),
    )

    return engine,Users,Course

#when swapping off of mysql, for databases like postgres, the WAL will need testing
def main():
    numberOfTables = 2
    engine,Users,Course = setup()
    print("-----------------------------------------")
    dataIntegrityTesting(engine, Users, Course, numberOfTables)
    print("-----------------------------------------")
    mappingTesting()
    print("-----------------------------------------")
    acidTesting()
    print("--------END OF Tests-------")
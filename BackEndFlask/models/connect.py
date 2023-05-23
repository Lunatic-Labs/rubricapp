from sqlalchemy import create_engine

engine = create_engine('mysql+pymysql://sbadmin_tester:testsummer1@192.185.2.108 /sbadmin_test', echo=True)
conn =  engine.connect()


conn.close()
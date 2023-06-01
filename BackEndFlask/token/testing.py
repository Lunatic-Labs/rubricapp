from encryption import encodeAuthToken, decodeAuthToken
import sqlalchemy
from sqlalchemy import create_engine, text

engine = sqlalchemy.create_engine('sqlite:////home/hen/code/rubricapp/BackEndFlask/instance/account.db')
conn = engine.connect()
result = conn.execute(text('select * from users;'))
for row in result:
    print(row[4])
conn.close()
thing = encodeAuthToken('')
#print(thing)
#print(decodeAuthToken(thing))
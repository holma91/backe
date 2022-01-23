import psycopg2
import json

# connect to the db
con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

# cursor
cur = con.cursor()

with open('./initial_data/exchanges.json', 'r') as f:
    data = f.read()

exchanges = json.loads(data)


for exchange in exchanges:
    cur.execute("insert into exchange (address, account_type, label) values (%s, %s, %s);",
                (exchange['address'], exchange['account_type'], exchange['label']))

con.commit()
cur.close()
con.close()

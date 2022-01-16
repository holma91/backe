import json

import psycopg2

# connect to the db
con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

with open('initial_data/accounts.json', 'r') as f:
    data = f.read()

accounts = json.loads(data)

for account in accounts:
    cur.execute("insert into account (address, account_type) values (%s, %s);",
                (account['address'], account['account_type']))

con.commit()
cur.close()
con.close()

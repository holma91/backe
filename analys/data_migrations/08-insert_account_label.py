import json

import psycopg2

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

with open('./initial_data/accounts.json', 'r') as f:
    data = f.read()

accounts = json.loads(data)


for account in accounts:
    if account['label'] == '' or account['label'] == 'no-label':
        continue
    cur.execute("insert into account_label (address, label_id) values (%s, %s);",
                (account['address'], account['label']))

con.commit()
cur.close()
con.close()

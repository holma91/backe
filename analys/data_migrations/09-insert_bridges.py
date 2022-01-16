import json

import psycopg2

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

with open('./initial_data/bridges.json', 'r') as f:
    data = f.read()

bridges = json.loads(data)


for bridge in bridges:
    cur.execute("insert into bridge (address, label) values (%s, %s);",
                (bridge['address'], bridge['label']))

con.commit()
cur.close()
con.close()

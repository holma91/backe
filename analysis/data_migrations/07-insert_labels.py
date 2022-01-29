import json

import psycopg2

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

with open('initial_data/labels.json', 'r') as f:
    data = f.read()

labels = json.loads(data)

for label in labels:
    cur.execute("insert into label (label_id) values (%s);", (label,))

con.commit()
cur.close()
con.close()

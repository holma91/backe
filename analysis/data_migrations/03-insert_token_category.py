import json

import psycopg2

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

with open('initial_data/token_with_category.json', 'r') as f:
    data = f.read()

tokens = json.loads(data)

for token in tokens:
    for category in token['categories']:
        cur.execute("insert into token_category (token, category_id) values (%s, %s)",
                    (token['address'], category))

con.commit()
cur.close()
con.close()

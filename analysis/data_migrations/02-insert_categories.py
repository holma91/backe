import json

import psycopg2

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

with open('initial_data/categories.json', 'r') as f:
    data = f.read()

categories = json.loads(data)

for category in categories:
    cur.execute("insert into category (coingecko_id, coingecko_name) values (%s, %s)",
                (category['category_id'], category['name']))

con.commit()
cur.close()
con.close()

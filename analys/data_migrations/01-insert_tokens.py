import json

import psycopg2

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

with open('initial_data/tokens.json', 'r') as f:
    data = f.read()

tokens = json.loads(data)

for token in tokens:
    cur.execute("select * from token where address = %s", (token['platforms']['ethereum'],))
    res = cur.fetchall()
    if len(res) == 0:
        cur.execute("insert into token (address, name, symbol, decimals, coingecko_id) values (%s, %s, %s, %s, %s)",
                    (token['platforms']['ethereum'], token['name'], token['symbol'], token['decimals'], token['id']))

con.commit()
cur.close()
con.close()

import json
import psycopg2

from utils.helpers import fix_address

# connect to the db
con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()


cur.execute("select address from account;")
rows = cur.fetchall()
addresses = [row[0] for row in rows]

print(addresses)
con.commit()
cur.close()
con.close()

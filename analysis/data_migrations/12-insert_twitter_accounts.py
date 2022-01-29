import json
import psycopg2

con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

con.autocommit = True
cur = con.cursor()
with open('./initial_data/ct_elite.json', 'r') as f:
    data = f.read()

ranked_accounts = json.loads(data)

with open('./initial_data/twitter_accounts.json', 'r') as f:
    data = f.read()

accounts = json.loads(data)

for twitter_id in accounts.keys():
    try:
        rank = 0
        if twitter_id in ranked_accounts.values():
            rank = 1

        cur.execute("insert into twitter_account (username, twitter_id, rank) values (%s, %s, %s);",
                    (accounts[twitter_id]['username'], twitter_id, rank))

    except Exception as e:
        print(f'exception at user with id = {twitter_id}')
        print(e)


cur.close()
con.close()

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


for account in accounts.keys():
    try:
        rank = 0
        if account in ranked_accounts:
            rank = 1

        cur.execute("insert into twitter_account (username, twitter_id, rank) values (%s, %s, %s);",
                    (account['username'], account, rank))

        # insert connection
        for follower in accounts[account]['followers']:
            cur.execute("insert into twitter_connection (follower, followee) values (%s, %s);",
                        (follower, str(ranked_accounts[follower])))

    except Exception as e:
        print(f'exception at user with id = {account}')
        print(e)


cur.close()
con.close()

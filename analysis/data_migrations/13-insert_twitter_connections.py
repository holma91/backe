import json
from utils.db_utils import connect_to_database


def main():
    with open('./initial_data/ct.json', 'r') as f:
        data = f.read()
    ranked_accounts = json.loads(data)

    with open('./initial_data/ct_all.json', 'r') as f:
        data = f.read()
    accounts = json.loads(data)

    with connect_to_database() as (con, cur):
        con.autocommit = True

        for twitter_id in accounts.keys():
            try:

                for follower in accounts[twitter_id]['followers']:
                    cur.execute("insert into twitter_connection (follower_id, followee_id) values (%s, %s);",
                                (str(ranked_accounts[follower]), twitter_id))

            except Exception as e:
                print(f'exception at user with id = {twitter_id}')
                print(e)


if __name__ == '__main__':
    main()

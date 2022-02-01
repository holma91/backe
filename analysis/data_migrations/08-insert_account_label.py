# This Module is Depricated
import json

from utils.db_utils import connect_to_database


def main():
    with open('./initial_data/accounts.json', 'r') as f:
        data = f.read()
    accounts = json.loads(data)

    with connect_to_database() as (con, cur):
        for account in accounts:
            if not (account['label'] == '' or account['label'] == 'no-label'):
                cur.execute("insert into account_label (address, label_id) values (%s, %s);",
                            (account['address'], account['label']))

        con.commit()


if __name__ == '__main__':
    main()

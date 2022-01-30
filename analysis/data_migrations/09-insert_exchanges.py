import json

from utils.db_utils import connect_to_database


def main():
    with open('./initial_data/exchanges.json', 'r') as f:
        data = f.read()
    exchanges = json.loads(data)

    with connect_to_database() as (con, cur):
        for exchange in exchanges:
            cur.execute("insert into exchange (address, account_type, label) values (%s, %s, %s);",
                        (exchange['address'], exchange['account_type'], exchange['label']))
        con.commit()


if __name__ == '__main__':
    main()

import json

from utils.db_utils import connect_to_database


def main():
    with open('./initial_data/bridges.json', 'r') as f:
        data = f.read()
    bridges = json.loads(data)

    with connect_to_database() as (con, cur):
        for bridge in bridges:
            cur.execute("insert into bridge (address, label) values (%s, %s);",
                        (bridge['address'], bridge['label']))
        con.commit()


if __name__ == '__main__':
    main()

import json
from utils.db_utils import connect_to_database


def main():
    # Load JSON data
    with open('initial_data/tokens.json', 'r') as file:
        data = file.read()

    tokens = json.loads(data)

    with connect_to_database() as (con, cur):

        for token in tokens:
            cur.execute("select * from token where address = %s",
                        (token['platforms']['ethereum'],))

            res = cur.fetchall()
            if len(res) == 0:
                cur.execute("insert into token (address, name, symbol, decimals, coingecko_id) values (%s, %s, %s, %s, %s)",
                            (token['platforms']['ethereum'], token['name'], token['symbol'], token['decimals'], token['id']))

        con.commit()


if __name__ == '__main__':
    main()

import json
from utils.db_utils import connect_to_database


def main():

    # Load JSON data
    with open('initial_data/categories.json', 'r') as f:
        data = f.read()

    categories = json.loads(data)

    with connect_to_database() as (con, cur):
        for category in categories:
            cur.execute("insert into category (coingecko_id, coingecko_name) values (%s, %s)",
                        (category['category_id'], category['name']))

        con.commit()


if __name__ == '__main__':
    main()

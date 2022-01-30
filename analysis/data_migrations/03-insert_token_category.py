import json
from utils.db_utils import connect_to_database


def main():

    with open('initial_data/token_with_category.json', 'r') as f:
        data = f.read()

    tokens = json.loads(data)

    with connect_to_database() as (con, cur):
        for token in tokens:
            for category in token['categories']:
                cur.execute("insert into token_category (token, category_id) values (%s, %s)",
                            (token['address'], category))

        con.commit()


if __name__ == '__main__':
    main()

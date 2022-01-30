import json

from utils.db_utils import connect_to_database


def main():
    with open('initial_data/labels.json', 'r') as f:
        data = f.read()
    labels = json.loads(data)

    with connect_to_database() as (con, cur):
        for label in labels:
            cur.execute("insert into label (label_id) values (%s);", (label,))

        con.commit()


if __name__ == "__main__":
    main()

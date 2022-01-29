
import psycopg2
import os
import contextlib


def get_db_env():
    """
    Gets variables from db.txt file
    HOST="examplehostname"
    DATABASE="exampledbname"
    USER="username"
    PASSWORD="PASSWORD"

    return: [host, db_name, user, password]

    """

    # Get abs file path so other python files can open it
    script_dir = os.path.dirname(__file__)
    rel_path = ".db_env"
    abs_file_path = os.path.join(script_dir, rel_path)

    with open(abs_file_path, "r") as file:
        args = []

        for line in file.readlines():
            args.append(line.split("=")[1].replace("\n", ""))  # Get args

    return args


@contextlib.contextmanager
def connect_to_database(**kwargs):
    """
    Context manager for handling connections to database
    Automatically closes the connection and cursor (You have to commit)
    Connects to the database based on the db.txt contents.


    Note: port can be passed in kwargs

    """
    host, database, user, password = get_db_env()

    con = psycopg2.connect(host=host, dbname=database,
                           user=user, password=password, **kwargs)

    cur = con.cursor()
    try:
        yield con, cur
    finally:
        cur.close()
        con.close()


def main():
    """Test function to connect"""
    try:
        with connect_to_database() as (con, cur):
            pass

    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()

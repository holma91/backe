# How to run

### Install python requirements using pip (From backe dir)

Depending on what system is running you might have to comment out (#) either psycopg2 or psycopg2_binary

- pip install -r analysis/requirements.txt

You need a `data_migrations/utils/.db_env` file to run some scripst. See `data_migrations/utils/.db_env.example`

### Run python files from data_migrations

You need to run the (01-14)\*.py files from the data_migrations directory due to relative paths

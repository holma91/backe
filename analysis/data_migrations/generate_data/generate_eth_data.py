import json
import time
from datetime import datetime, timedelta, timezone

import psycopg2
import requests


con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

# autocommit because if we get an error halfway we through,
# the first half should still be inserted to the db
# con.autocommit = True
cur = con.cursor()

# for some weird reason, coingecko api doesn not have ethereum data for certain dates
# figure out which dates


eth = {
    'address': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    'price_in_usd': 1184,
    'market_cap_in_usd': 113796120454.081,
    'volume_in_usd': 4107859968,
    'snapshot_timestamp': 1517270400

}

cur.execute("select * from token_snapshot where address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';")
rows = cur.fetchall()


def get_timestamps() -> list:
    AUG7_2015 = 1438898400
    JAN2_2022 = 1641081600

    start_tuple = datetime.utcfromtimestamp(AUG7_2015).timetuple()
    end_tuple = datetime.utcfromtimestamp(JAN2_2022).timetuple()
    start = datetime(start_tuple[0], start_tuple[1],
                     start_tuple[2]).replace(tzinfo=timezone.utc)
    end = datetime(end_tuple[0], end_tuple[1],
                   end_tuple[2]).replace(tzinfo=timezone.utc)

    ts = [datetime.timestamp(start+timedelta(days=x)) for x in range((end-start).days)]
    return ts


cur.execute("select snapshot_timestamp from token_snapshot where address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';")
timestamps = cur.fetchall()
cur.close()
con.commit()
con.close()

actual_timestamps = [int(datetime.timestamp(ts[0].replace(tzinfo=timezone.utc))) for ts in timestamps]
all_timestamps = get_timestamps()

missing_timestamps = []

for ts in all_timestamps:
    if ts not in actual_timestamps:
        missing_timestamps.append(ts)


print(json.dumps(missing_timestamps, indent=2))

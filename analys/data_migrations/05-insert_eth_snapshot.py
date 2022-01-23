import json
import time
from datetime import datetime

import psycopg2
import requests


con = psycopg2.connect(
    host="localhost",
    database="lasse",
    user="alexander",
    password="")

cur = con.cursor()

# for some weird reason, coingecko api doesn not have ethereum data for 2018-01-30-00:00

missing_snapshots = [
    {
        'address': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'price_in_usd': 1.33,
        'market_cap_in_usd': 80339475,
        'volume_in_usd': 368070,
        'snapshot_timestamp': 1439078400
    },
    {
        'address': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'price_in_usd': 751,
        'market_cap_in_usd': 73290929918,
        'volume_in_usd': 2635662719,
        'snapshot_timestamp': 1518048000
    },
    {
        'address': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'price_in_usd': 1184,
        'market_cap_in_usd': 113796120454.081,
        'volume_in_usd': 4107859968,
        'snapshot_timestamp': 1517270400
    }
]


for snapshot in missing_snapshots:
    cur.execute("""insert into token_snapshot (address, price_in_usd, market_cap_in_usd, volume_in_usd, snapshot_timestamp)
                values (%s, %s, %s, %s, %s);""", (snapshot['address'], snapshot['price_in_usd'], snapshot['market_cap_in_usd'],
                                                  snapshot['volume_in_usd'], datetime.utcfromtimestamp(snapshot['snapshot_timestamp']).astimezone()))


cur.close()
con.commit()
con.close()

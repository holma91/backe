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

# autocommit because if we get an error halfway we through,
# the first half should still be inserted to the db
con.autocommit = True
cur = con.cursor()

with open('initial_data/tokens.json', 'r') as f:
    data = f.read()

tokens = json.loads(data)


def get_price_history(token):
    return requests.get(f"https://api.coingecko.com/api/v3/coins/{token['id']}/market_chart?vs_currency=usd&days=max")


for token in tokens:
    try:
        response = get_price_history(token)
        while response.status_code == 429:
            # rate limited, try again after 30s
            print("sleeping at ", token['id'])
            time.sleep(30)
            response = get_price_history(token)

    except requests.exceptions.HTTPError as err:
        print(f"token['id'] gives us:",  err)
        # keep going with the next token anyway
        continue

    price_history = response.json()
    if 'error' in price_history.keys():
        print('error at ', token)
        # keep going with the next token anyway
        continue

    days = len(price_history['prices'])
    token_address = token['platforms']['ethereum']
    for i in range(days):
        snapshot = {}
        # remove the milliseconds from the time
        timestamp = price_history['prices'][i][0] / 1000
        if str(datetime.utcfromtimestamp(timestamp))[-8:] != '00:00:00':
            continue

        snapshot['snapshot_timestamp'] = datetime.utcfromtimestamp(
            timestamp).astimezone()
        snapshot['price_in_usd'] = price_history['prices'][i][1]
        snapshot['market_cap_in_usd'] = price_history['market_caps'][i][1]
        snapshot['volume_in_usd'] = price_history['total_volumes'][i][1]

        cur.execute("""insert into token_snapshot (address, price_in_usd, market_cap_in_usd, volume_in_usd, snapshot_timestamp)
                    values (%s, %s, %s, %s, %s);""", (token_address, snapshot['price_in_usd'], snapshot['market_cap_in_usd'],
                                                      snapshot['volume_in_usd'], snapshot['snapshot_timestamp']))


cur.close()
con.close()

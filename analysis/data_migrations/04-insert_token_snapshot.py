import json
import time
from datetime import datetime

import requests

from utils.db_utils import connect_to_database


def get_price_history(token):
    return requests.get(f"https://api.coingecko.com/api/v3/coins/{token['id']}/market_chart?vs_currency=usd&days=max")


def get_response(token):
    response = get_price_history(token)
    while response.status_code == 429:
        # rate limited, try again after 30s
        print("sleeping at ", token['id'])
        time.sleep(30)
        response = get_price_history(token)
    return response


def main():
    with open('initial_data/tokens.json', 'r') as f:
        data = f.read()

    tokens = json.loads(data)

    with connect_to_database() as (con, cur):
        # if we get an error halfway the first half should still be inserted to the db
        con.autocommit = True

        for token in tokens:
            try:
                response = get_response(token)

            except requests.exceptions.HTTPError as err:
                print(f"token['id'] gives us:",  err)
                continue  # keep going anyway

            price_history = response.json()
            if 'error' in price_history.keys():
                print('error at ', token)
                continue  # keep going anyway

            days = len(price_history['prices'])
            token_address = token['platforms']['ethereum']
            for i in range(days):
                snapshot = {}
                # remove the milliseconds from the time
                timestamp = price_history['prices'][i][0] / 1000
                if str(datetime.utcfromtimestamp(timestamp))[-8:] == '00:00:00':
                    snapshot['snapshot_timestamp'] = datetime.utcfromtimestamp(
                        timestamp).astimezone()
                    snapshot['price_in_usd'] = price_history['prices'][i][1]
                    snapshot['market_cap_in_usd'] = price_history['market_caps'][i][1]
                    snapshot['volume_in_usd'] = price_history['total_volumes'][i][1]

                    cur.execute("""insert into token_snapshot (address, price_in_usd, market_cap_in_usd, volume_in_usd, snapshot_timestamp)
                                values (%s, %s, %s, %s, %s);""", (token_address, snapshot['price_in_usd'], snapshot['market_cap_in_usd'],
                                                                  snapshot['volume_in_usd'], snapshot['snapshot_timestamp']))
    return


if __name__ == '__main__':
    main()

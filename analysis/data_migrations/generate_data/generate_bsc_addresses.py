import json
import requests
import time
# read in all ethereum addresses
# save all that has > 100 txs on bsc
APIKEY_BSCSCAN = '9W1BVC324ZY6RMEDES1R5RJ5WTGV8YTQJE'


def get_transactions(address):
    response = requests.get(
        f'https://api.bscscan.com/api?module=account&action=txlist&address={address}&page=1&offset=10000&sort=asc&apikey={APIKEY_BSCSCAN}')
    count = 0
    while response.status_code == 429 and count < 50:
        # print(count)
        count += 1
        time.sleep(10)
        response = requests.get(
            f'https://api.bscscan.com/api?module=account&action=txlist&address={address}&page=1&offset=10000&sort=asc&apikey={APIKEY_BSCSCAN}')
    return response.json()['result']


with open('./dump_data/eth_addresses.json', 'r') as f:
    data = f.read()

eth_addresses = json.loads(data)
bsc_addresses = {}

for address in eth_addresses.keys():
    try:
        txs = get_transactions(address)
        # print(len(txs))
        if len(txs) > 100:
            bsc_addresses[address] = eth_addresses[address]
    except Exception as e:
        print(f'error at {address}')
        print(e)

print(json.dumps(bsc_addresses, indent=2))

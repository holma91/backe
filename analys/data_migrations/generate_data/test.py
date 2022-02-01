import requests
import json

APIKEY_BSCSCAN = 'Y12MPWPZCETCQGM7K4Z95XT58JA5XU3G6U'
address = '0xff2fbc735d33ae830f056107f1b551783ec4ed5b'
response = requests.get(
    f'https://api.ftmscan.com/api?module=account&action=txlist&address={address}&page=1&offset=10000&sort=asc&apikey={APIKEY_BSCSCAN}')
data = response.json()['result']
print(json.dumps(data, indent=2))

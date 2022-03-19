import os
from time import time
import requests
from dotenv import load_dotenv
load_dotenv('./.env')

APIKEY_ALCHEMY = os.environ.get('api_key_alchemy')


def fix_address(address):
    return address.lower()


def get_type(address):
    response = requests.post(f'https://eth-mainnet.alchemyapi.io/v2/{APIKEY_ALCHEMY}', json={
        "jsonrpc": "2.0",
        "method": "eth_getCode",
        "params": [f"{address}", "latest"],
        "id": 0
    })
    return response


def get_account_type(address):
    """checks with alchemy if the provided accounts contains any code"""
    response = get_type(address)

    try:
        account_code = response.json()
        if account_code['result'] == '0x':
            return 'EOA'
        else:
            return 'CA'
    except Exception as e:
        print(f'exception at {address}')
        print(f'response: {response}')
        print(f'account_code: {account_code}')
        print(e)

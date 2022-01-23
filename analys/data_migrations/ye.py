import json
import time
from datetime import datetime

import psycopg2
import requests


response = requests.post(f'https://eth-mainnet.alchemyapi.io/v2/{ALCHEMY_KEY}', json={
    "jsonrpc": "2.0",
    "method": "eth_getCode",
    "params": [f"{address}", "latest"],
    "id": 0
})

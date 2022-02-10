import json


def get_exchanges():
    with open('./initial_data/exchanges.json', 'r') as exchanges_file:
        data = exchanges_file.read()
        exchanges = json.loads(data)
        return [exchange['address'] for exchange in exchanges]


def get_bridges():
    with open('./initial_data/bridges.json', 'r') as bridges_file:
        data = bridges_file.read()
    bridges = json.loads(data)
    return [bridge['address'] for bridge in bridges]


def get_accounts():
    with open('./dump_data/eth_addresses.json', 'r') as f:
        data = f.read()
    return json.loads(data)

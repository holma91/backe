import json

from env import APIKEY_ETHERSCAN
from helpers import fix_address, get_account_type
from EthAccount import EthAccount

with open('./initial_data/exchanges.json', 'r') as exchanges_file:
    data = exchanges_file.read()

exchanges = json.loads(data)
exchanges = [exchange['address'] for exchange in exchanges]

with open('./initial_data/bridges.json', 'r') as bridges_file:
    data = bridges_file.read()

bridges = json.loads(data)
bridges = [bridge['address'] for bridge in bridges]

with open('./dump_data/addresses.json', 'r') as f:
    data = f.read()

accounts = json.loads(data)

generated_accounts = []
# generate EOAs with less than 10k txs and 10k ttes
for address in accounts.keys():
    # check if CA
    account_type = get_account_type(address)
    if account_type == 'CA' or address in exchanges or address in bridges:
        # we only care about EOAs that are not bridges or exchanges
        continue

    ethAcc = EthAccount(address, APIKEY_ETHERSCAN)
    if len(ethAcc.get_transactions()) >= 10000 or len(ethAcc.get_ERC20_token_transfer_events()) >= 10000:
        # can't handle the huge accounts with etherscan
        continue

    account = {
        "address": fix_address(address),
        "label": accounts[address],
        "account_type": "EOA"
    }
    generated_accounts.append(account)

print(json.dumps(generated_accounts, indent=2))
